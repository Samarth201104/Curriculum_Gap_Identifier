'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FileUpload from '@/components/FileUpload'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '@/services/api'

export default function AnalyzePage() {
  const router = useRouter()
  const [curriculumFile, setCurriculumFile] = useState(null)
  const [standardsFile, setStandardsFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleCurriculumUpload = (file) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file for curriculum')
      return
    }
    setCurriculumFile(file)
    toast.success('Curriculum document uploaded successfully')
  }

  const handleStandardsUpload = (file) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file for standards')
      return
    }
    setStandardsFile(file)
    toast.success('Standards document uploaded successfully')
  }

  const handleRemoveCurriculum = () => {
    setCurriculumFile(null)
    toast.info('Curriculum document removed')
  }

  const handleRemoveStandards = () => {
    setStandardsFile(null)
    toast.info('Standards document removed')
  }

  const handleSubmit = async () => {
    if (!curriculumFile || !standardsFile) {
      toast.error('Please upload both documents')
      return
    }

    setIsProcessing(true)
    setUploadProgress(0)

    try {
      // Upload files
      const formData = new FormData()
      formData.append('curriculum', curriculumFile)
      formData.append('standards', standardsFile)

      toast.info('Uploading files...')
      const uploadResponse = await api.uploadFiles(formData, (progress) => {
        setUploadProgress(progress)
      })

      const sessionId = uploadResponse.data.session_id
      toast.success('Files uploaded! Starting AI analysis...')

      // Start processing
      setUploadProgress(50)
      
      const processResponse = await api.processAnalysis({
        session_id: sessionId,
        curriculum: uploadResponse.data.files.curriculum,
        standards: uploadResponse.data.files.standards
      })
      
      toast.success('AI analysis started! This may take 2-3 minutes...')

      // Poll for completion
      let isComplete = false
      let attempts = 0
      const maxAttempts = 90  // 90 * 2 seconds = 3 minutes timeout
      
      while (!isComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
        attempts++
        
        try {
          const statusResponse = await api.getAnalysisStatus(sessionId)
          const status = statusResponse.data
          
          console.log(`Attempt ${attempts}:`, status)
          
          if (status.status === 'completed') {
            isComplete = true
            setUploadProgress(100)
            toast.success('Analysis completed!')
            break
          } else if (status.status === 'failed') {
            throw new Error(status.message || 'Analysis failed')
          }
          
          // Update progress
          if (status.progress) {
            setUploadProgress(status.progress)
          }
          
          // Show progress messages
          if (status.message && attempts % 5 === 0) {
            toast.info(status.message)
          }
          
        } catch (error) {
          if (error.response?.status === 404 && attempts < 10) {
            // Still processing, continue polling
            continue
          }
          throw error
        }
      }
      
      if (isComplete) {
        // Get the report data
        const reportResponse = await api.getReport(sessionId)
        
        // Redirect to results page
        router.push(`/results?reportId=${sessionId}`)
      } else {
        toast.warning('Analysis is taking longer than expected. You can check back later.')
        router.push(`/results?reportId=${sessionId}&status=processing`)
      }

    } catch (error) {
      console.error('Analysis failed:', error)
      toast.error(error.response?.data?.error || error.message || 'Analysis failed. Please try again.')
    } finally {
      setIsProcessing(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Analyze Your Curriculum
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Upload your curriculum and standards documents to begin AI-powered gap analysis
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Curriculum Upload */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Curriculum Document
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Upload your course syllabus or curriculum PDF
                  </p>
                </div>
              </div>
              <FileUpload
                onFileUpload={handleCurriculumUpload}
                onFileRemove={handleRemoveCurriculum}
                file={curriculumFile}
                acceptedFileType="application/pdf"
                maxSizeMB={10}
              />
              {curriculumFile && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Ready for analysis</span>
                  </div>
                </div>
              )}
            </div>

            {/* Standards Upload */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Standards Document
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Upload national or state academic standards PDF
                  </p>
                </div>
              </div>
              <FileUpload
                onFileUpload={handleStandardsUpload}
                onFileRemove={handleRemoveStandards}
                file={standardsFile}
                acceptedFileType="application/pdf"
                maxSizeMB={10}
              />
              {standardsFile && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Ready for analysis</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Processing...</span>
                <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Analysis Process</h3>
                  <p className="text-blue-700 text-sm">
                    Our AI will extract learning outcomes, compare with standards, 
                    identify gaps, and provide recommendations. This usually takes 1-2 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <button
              onClick={handleSubmit}
              disabled={!curriculumFile || !standardsFile || isProcessing}
              className="btn-primary text-lg px-8 py-4"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Run AI Analysis
                </>
              )}
            </button>
            <button
              onClick={() => {
                setCurriculumFile(null)
                setStandardsFile(null)
                toast.info('Uploads cleared')
              }}
              disabled={isProcessing}
              className="btn-secondary text-lg px-8 py-4"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
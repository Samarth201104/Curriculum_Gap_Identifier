'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Download, FileText, CheckCircle, AlertTriangle, BarChart3, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import api from '@/services/api'
import ResultViewer from '@/components/ResultViewer'
import Confetti from 'react-confetti'

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const reportId = searchParams.get('reportId')
  
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Set window size for confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    
    // Fetch report data
    if (reportId) {
      fetchReportData()
    } else {
      // For demo purposes, show sample data
      setTimeout(() => {
        setReport(sampleReport)
        setLoading(false)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }, 1500)
    }

    return () => window.removeEventListener('resize', handleResize)
  }, [reportId])

  const fetchReportData = async () => {
    try {
      const response = await api.getReport(reportId)
      setReport(response.data)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    } catch (error) {
      console.error('Failed to fetch report:', error)
      toast.error('Failed to load report. Using sample data.')
      setReport(sampleReport)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await api.downloadPDF(reportId || 'sample')
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `curriculum-report-${Date.now()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed. Please try again.')
    }
  }

  const handleDownloadJSON = async () => {
    try {
      const response = await api.downloadJSON(reportId || 'sample')
      const url = window.URL.createObjectURL(new Blob([JSON.stringify(response.data, null, 2)]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `curriculum-data-${Date.now()}.json`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('JSON downloaded successfully')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed. Please try again.')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Curriculum Gap Analysis Report',
        text: 'Check out my curriculum analysis report!',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Generating your report...</h2>
          <p className="text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <Link
                href="/analyze"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Analysis
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Analysis Results
              </h1>
              <p className="text-gray-600 mt-2">
                Generated on {new Date().toLocaleDateString()} • Report ID: {reportId || 'DEMO-123'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleShare}
                className="btn-secondary px-4 py-2"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={handleDownloadPDF}
                className="btn-primary px-4 py-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Coverage Score</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {report?.summary?.coverage || '85%'}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: report?.summary?.coverage || '85%' }}
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Topics Covered</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {report?.summary?.topicsCovered || 42}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Out of {report?.summary?.totalTopics || 50} required topics
              </p>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Gaps Identified</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {report?.summary?.gaps || 8}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Need attention for improvement
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🧭 Next Steps</h3>
              <ul className="space-y-3">
                {[
                  'Review high-severity gaps and prioritize fixes',
                  'Update curriculum content and assessment strategy',
                  'Schedule faculty training on new content areas',
                  'Re-evaluate improvements after 3 months',
                  'Establish continuous curriculum improvement process'
                ].map((step, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full 
                                  flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Gap Analysis */}
            <div className="lg:col-span-2">
              <ResultViewer report={report} />
            </div>

            {/* Right Column - Actions & Downloads */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Export Results
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full btn-primary py-3"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Full Report (PDF)
                  </button>
                  <button
                    onClick={handleDownloadJSON}
                    className="w-full btn-secondary py-3"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Download Raw Data (JSON)
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Next Steps
                </h3>
                <ul className="space-y-3">
                  {[
                    'Review gap analysis in detail',
                    'Implement priority recommendations',
                    'Schedule curriculum review meeting',
                    'Update learning materials',
                    'Re-assess in 6 months',
                  ].map((step, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full 
                                    flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Need Help?
                </h3>
                <p className="text-gray-600 mb-4">
                  Our education consultants can help you implement these recommendations.
                </p>
                <button
                  onClick={() => toast.info('Contact form coming soon!')}
                  className="w-full btn-secondary py-3"
                >
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample report data for demonstration
const sampleReport = {
  summary: {
    coverage: '85%',
    topicsCovered: 42,
    totalTopics: 50,
    gaps: 8,
    recommendations: 15,
    alignmentScore: 78,
  },
  gaps: [
    {
      id: 1,
      topic: 'Data Structures - Graphs',
      severity: 'high',
      description: 'Missing coverage of graph algorithms and traversal methods',
      recommendation: 'Add 2-week module on graph theory and algorithms',
    },
    {
      id: 2,
      topic: 'Machine Learning Ethics',
      severity: 'medium',
      description: 'Insufficient coverage of ethical considerations in ML',
      recommendation: 'Include ethics case studies and discussion sessions',
    },
    {
      id: 3,
      topic: 'Cloud Computing Security',
      severity: 'high',
      description: 'No content on cloud security best practices',
      recommendation: 'Add security module covering IAM, encryption, compliance',
    },
  ],
  recommendations: [
    'Add supplemental materials on emerging technologies',
    'Increase hands-on project-based learning hours',
    'Incorporate industry certification preparation',
    'Update assessment methods to include practical exams',
    'Include peer review and collaborative learning',
  ],
  strengths: [
    'Strong foundation in programming fundamentals',
    'Excellent coverage of core algorithms',
    'Good balance of theory and practice',
    'Regular assessment and feedback mechanisms',
  ],
}
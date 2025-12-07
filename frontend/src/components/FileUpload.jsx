'use client'

import { useState, useCallback } from 'react'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

export default function FileUpload({
  onFileUpload,
  onFileRemove,
  file,
  acceptedFileType = 'application/pdf',
  maxSizeMB = 10,
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const validateFile = (file) => {
    if (!file.type.includes('pdf')) {
      toast.error('Please upload a PDF file')
      return false
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`)
      return false
    }

    return true
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && validateFile(droppedFile)) {
      onFileUpload(droppedFile)
    }
  }, [onFileUpload])

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && validateFile(selectedFile)) {
      onFileUpload(selectedFile)
    }
    e.target.value = null // Reset input
  }

  const handleRemove = () => {
    onFileRemove()
  }

  if (file) {
    return (
      <div className="p-6 border-2 border-dashed border-green-300 bg-green-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`p-8 border-2 border-dashed rounded-xl transition-all duration-200 ${
        isDragging
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept={acceptedFileType}
        onChange={handleFileSelect}
      />
      
      <div className="text-center">
        <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
          <Upload className="w-8 h-8 text-primary-600" />
        </div>
        
        <div className="mb-2">
          <label
            htmlFor="file-upload"
            className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
          >
            Click to upload
          </label>
          <span className="text-gray-600"> or drag and drop</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">
          PDF files only (max. {maxSizeMB}MB)
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <AlertCircle className="w-4 h-4" />
          <span>Upload curriculum or standards document</span>
        </div>
      </div>
    </div>
  )
}
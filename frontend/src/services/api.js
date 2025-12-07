import axios from 'axios'

// Point to your Flask backend
const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes for AI processing
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add loading state tracking if needed
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend connection refused. Is the server running?')
      throw new Error('Cannot connect to backend server. Please ensure it is running on port 5000.')
    }
    
    if (error.response?.status === 404) {
      console.error('API endpoint not found:', error.config.url)
    }
    
    return Promise.reject(error)
  }
)

// Backend API Integration
export const checkHealth = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    console.error('Health check failed:', error)
    throw error
  }
}

export const uploadFiles = async (formData, onProgress) => {
  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(percentCompleted)
        }
      },
    })
    return response
  } catch (error) {
    console.error('File upload error:', error)
    throw error
  }
}

export const processAnalysis = async (sessionData) => {
  try {
    const response = await api.post('/process', sessionData, {
      timeout: 300000,
    })
    return response
  } catch (error) {
    console.error('Analysis processing error:', error)
    throw error
  }
}

export const getAnalysisStatus = async (sessionId) => {
  try {
    const response = await api.get(`/status/${sessionId}`)
    return response
  } catch (error) {
    console.error('Status check error:', error)
    throw error
  }
}

export const getReport = async (sessionId) => {
  try {
    const response = await api.get(`/reports/${sessionId}`)
    return response
  } catch (error) {
    console.error('Get report error:', error)
    throw error
  }
}

export const downloadPDF = async (sessionId) => {
  try {
    const response = await api.get(`/reports/${sessionId}/pdf`, {
      responseType: 'blob',
    })
    return response
  } catch (error) {
    console.error('PDF download error:', error)
    throw error
  }
}

export const downloadJSON = async (sessionId) => {
  try {
    const response = await api.get(`/reports/${sessionId}/json`, {
      responseType: 'blob',
    })
    return response
  } catch (error) {
    console.error('JSON download error:', error)
    throw error
  }
}

export const getMapping = async (sessionId) => {
  try {
    const response = await api.get(`/results/${sessionId}/mapping`)
    return response
  } catch (error) {
    console.error('Get mapping error:', error)
    throw error
  }
}

export default {
  checkHealth,
  uploadFiles,
  processAnalysis,
  getAnalysisStatus,
  getReport,
  downloadPDF,
  downloadJSON,
  getMapping,
}
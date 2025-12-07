'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, TrendingUp, Award, Target, FileText } from 'lucide-react'

export default function ResultViewer({ report }) {
  const [expandedGaps, setExpandedGaps] = useState({})

  const toggleGap = (id) => {
    setExpandedGaps(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const getSeverityColor = (severity) => {
    const severityLower = severity?.toLowerCase()
    switch (severityLower) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Ensure gaps have proper structure
  const formattedGaps = report?.gaps?.map((gap, index) => ({
    id: gap.id || index + 1,
    topic: gap.topic || gap.standard_topic || `Topic ${index + 1}`,
    severity: gap.severity || 'MEDIUM',
    description: gap.description || `Missing coverage of ${gap.topic || gap.standard_topic}`,
    recommendation: gap.recommendation || `Add module on ${gap.topic || gap.standard_topic}`
  })) || []

  // Ensure recommendations is an array
  const recommendations = Array.isArray(report?.recommendations) 
    ? report.recommendations 
    : (typeof report?.recommendations === 'string' 
        ? report.recommendations.split('\n').filter(line => line.trim()).slice(0, 10)
        : [])

  // Ensure strengths is an array
  const strengths = Array.isArray(report?.strengths) 
    ? report.strengths 
    : ["Strong foundation in programming fundamentals", "Good balance of theory and practice"]

  return (
    <div className="space-y-6">
      {/* Gap Analysis Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">🔍 Gap Analysis</h2>
            <p className="text-gray-600">Missing or weak curriculum areas by severity</p>
          </div>
          <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            {formattedGaps.length} Gaps Found
          </div>
        </div>

        <div className="space-y-4">
          {formattedGaps.length > 0 ? (
            formattedGaps.map((gap) => (
              <div
                key={gap.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleGap(gap.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(gap.severity)}`}>
                        {gap.severity.toUpperCase()}
                      </div>
                      <h3 className="font-semibold text-gray-900">{gap.topic}</h3>
                    </div>
                    <div>
                      {expandedGaps[gap.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedGaps[gap.id] && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Issue:</h4>
                        <p className="text-gray-600 text-sm">{gap.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Action Needed:</h4>
                        <p className="text-gray-600 text-sm">{gap.recommendation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">No significant gaps identified. Curriculum is well-aligned.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">✔ Recommendations</h2>
            <p className="text-gray-600">Actionable suggestions for improvement</p>
          </div>
        </div>

        <div className="space-y-3">
          {recommendations.length > 0 ? (
            recommendations.slice(0, 10).map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700">{rec.replace(/^[-•*]\s*/, '').trim()}</p>
              </div>
            ))
          ) : (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-800">
                    Download the PDF report for complete recommendations including:
                  </p>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li>• Detailed gap analysis with severity ratings</li>
                    <li>• Actionable improvement suggestions</li>
                    <li>• Topic sequencing recommendations</li>
                    <li>• Implementation roadmap</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Strengths Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">⭐ Strengths</h2>
            <p className="text-gray-600">Areas where curriculum performs well</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {strengths.map((strength, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
            >
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-blue-800 text-sm">{strength}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
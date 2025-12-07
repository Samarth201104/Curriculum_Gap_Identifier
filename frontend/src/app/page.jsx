'use client'

import { ArrowRight, Brain, CheckCircle, BarChart3, Upload } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

export default function Home() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Analysis',
      description: 'Leverage Gemini 2.5 Flash for intelligent curriculum mapping and gap detection.',
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Standards Alignment',
      description: 'Ensure curriculum meets national and state academic standards automatically.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Detailed Insights',
      description: 'Get comprehensive reports on coverage, gaps, and improvement recommendations.',
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: 'Easy Upload',
      description: 'Simple drag-and-drop interface for curriculum and standards documents.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                AI-Powered Curriculum
                <span className="text-primary-600"> Gap Analysis</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                Automatically align your curriculum with academic standards, identify gaps, 
                and receive actionable recommendations with our AI-driven platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/analyze" className="btn-primary text-lg px-8 py-4">
                  Start Free Analysis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => toast.info('Demo coming soon!')}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  View Demo
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Streamline your curriculum review process with cutting-edge AI technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card hover:border-primary-200"
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three simple steps to comprehensive curriculum analysis
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Upload Documents',
                  description: 'Upload your curriculum and standards PDF documents',
                },
                {
                  step: '02',
                  title: 'AI Processing',
                  description: 'Our AI analyzes alignment, gaps, and recommendations',
                },
                {
                  step: '03',
                  title: 'Get Results',
                  description: 'Download detailed reports and implementation roadmap',
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full 
                                flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Curriculum?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join educators and institutions using AI to ensure curriculum excellence
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center bg-white text-primary-600 px-8 py-4 
                     rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Start Your Free Analysis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
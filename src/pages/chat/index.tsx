import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function ChatPage() {
  return (
    <>
      <Head>
        <title>UnderwritePro AI</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="container mx-auto px-4 py-10 flex-grow">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">UnderwritePro AI</h1>
          <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800">Credit Analysis Assistant</h2>
            <p className="mt-4 text-gray-600">Get instant insights about credit scoring and risk assessment.</p>
            <ul className="mt-3 space-y-1">
              <li className="flex items-center py-3 px-5 border border-gray-100/50 rounded-lg hover:bg-gray-50/10 transition-all duration-75">
                <div className="flex-shrink-0 w-3 h-3 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-1.5 h-1.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-400 text-lg">Analyzing credit applications and data</span>
              </li>
              <li className="flex items-center py-3 px-5 border border-gray-100/50 rounded-lg hover:bg-gray-50/10 transition-all duration-75">
                <div className="flex-shrink-0 w-3 h-3 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-1.5 h-1.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-400 text-lg">Providing detailed risk assessments</span>
              </li>
              <li className="flex items-center py-3 px-5 border border-gray-100/50 rounded-lg hover:bg-gray-50/10 transition-all duration-75">
                <div className="flex-shrink-0 w-3 h-3 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-1.5 h-1.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-400 text-lg">Explaining credit decisions</span>
              </li>
            </ul>
            <div className="mt-8 relative">
              <input
                type="text"
                placeholder="Ask about credit scoring or upload a CSV file for analysis..."
                className="w-full py-3.5 px-5 pr-24 bg-gray-50/5 border border-gray-100/30 rounded-3xl focus:outline-none focus:ring-1 focus:ring-purple-300/30 focus:border-transparent placeholder-gray-300/40 transition-all duration-150 text-base text-gray-600"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <button className="p-1.5 text-purple-100 hover:text-purple-200 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button className="p-1.5 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <Link href="/" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

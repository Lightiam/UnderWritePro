import * as React from 'react'
import Head from 'next/head'

export default function ChatPage() {
  return (
    <>
      <Head>
        <title>UnderwritePro AI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"></link>
        <style>{`
          body {
            font-family: 'Roboto', sans-serif;
          }
        `}</style>
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="container mx-auto px-4 py-10 flex-grow">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">UnderwritePro AI</h1>
          <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800">Credit Analysis Assistant</h2>
            <p className="mt-4 text-gray-600">Get instant insights about credit scoring and risk assessment.</p>
            <ul className="mt-3 space-y-1">
              <li className="flex items-center py-2.5 px-4 border border-gray-50 rounded-lg hover:bg-gray-50/50 transition-all duration-200">
                <div className="flex-shrink-0 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-500 text-sm">Analyzing credit applications and data</span>
              </li>
              <li className="flex items-center py-2.5 px-4 border border-gray-50 rounded-lg hover:bg-gray-50/50 transition-all duration-200">
                <div className="flex-shrink-0 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-500 text-sm">Providing detailed risk assessments</span>
              </li>
              <li className="flex items-center py-2.5 px-4 border border-gray-50 rounded-lg hover:bg-gray-50/50 transition-all duration-200">
                <div className="flex-shrink-0 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-500 text-sm">Explaining credit decisions</span>
              </li>
            </ul>
            <div className="mt-8 relative">
              <input
                type="text"
                placeholder="Ask about credit scoring or upload a CSV file for analysis..."
                className="w-full py-3.5 px-5 pr-24 bg-gray-50/30 border border-gray-100/80 rounded-3xl focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent placeholder-gray-400/90 transition-all duration-200 text-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <button className="p-2 text-purple-500 hover:text-purple-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <a href="/" className="inline-flex items-center px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Dashboard</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

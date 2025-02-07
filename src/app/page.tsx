import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/utils'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-purple-600">{APP_NAME}</h1>
            <nav className="space-x-4">
              <Link href="/chat" className="text-purple-600 hover:text-purple-800">
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        <main className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-bold text-gray-900">
                AI-Powered Credit Scoring Platform
              </h2>
              <p className="text-xl text-gray-600">
                Make smarter lending decisions with our advanced AI credit scoring system.
                Upload documents, analyze credit data, and get instant insights.
              </p>
              <div className="space-x-4">
                <Link href="/chat">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] w-full">
              <Image
                src="/UnderwriteAI.PNG"
                alt="Lendify AI Dashboard"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>

          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600">
                Advanced machine learning algorithms analyze credit data to provide accurate scoring.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Real-time Insights
              </h3>
              <p className="text-gray-600">
                Get instant feedback and recommendations through our interactive chat interface.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Document Processing
              </h3>
              <p className="text-gray-600">
                Upload and analyze credit documents with our advanced document processing system.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

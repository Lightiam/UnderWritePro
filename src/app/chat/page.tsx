"use client"

import * as React from 'react'
import { Chat } from '@/components/ui/chat-new'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { APP_NAME } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = false

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="py-4 px-6 border-b">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link href="/" className="text-xl font-semibold text-purple-600 hover:text-purple-700">
            {APP_NAME}
          </Link>
          <span className="text-gray-600">AI-Powered Credit Analysis</span>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Credit Analysis Assistant</h1>
        <p className="text-gray-600 mb-6">Get instant insights about credit scoring and risk assessment</p>
        <div className="bg-white rounded-lg shadow-lg">
          <ErrorBoundary>
            <Chat />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  )
}

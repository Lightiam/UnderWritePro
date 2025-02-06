"use client"

import { Chat } from '@/components/ui/chat-new'
import { APP_NAME } from '@/lib/utils'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6 border-b bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
              {APP_NAME}
            </Link>
            <div className="text-sm text-gray-500">
              AI-Powered Credit Analysis
            </div>
          </div>
        </header>
        <main className="py-8">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <ErrorBoundary>
              <Chat />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}

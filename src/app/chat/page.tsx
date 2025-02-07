import * as React from 'react'
import { Chat } from '@/components/ui/chat-new'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export const metadata = {
  title: 'Chat - Lendify AI',
  description: 'AI-powered credit scoring and risk assessment',
}

export default function ChatPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Credit Analysis Assistant</h1>
      <p className="text-gray-600 mb-6">Get instant insights about credit scoring and risk assessment</p>
      <div className="bg-white rounded-lg shadow-lg">
        <ErrorBoundary>
          <Chat />
        </ErrorBoundary>
      </div>
    </main>
  )
}

import * as React from 'react'
import { APP_NAME } from '@/lib/utils'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const ChatClient = dynamic(() => import('./client'), { ssr: false })

export const metadata = {
  title: `${APP_NAME} - Chat`,
  description: 'AI-powered credit scoring and risk assessment platform',
}

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
        <ChatClient />
      </main>
    </div>
  )
}

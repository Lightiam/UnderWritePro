import * as React from 'react'
import { APP_NAME } from '../lib/utils'
import Link from 'next/link'
import { Chat } from '../components/ui/chat-new'
import { ErrorBoundary } from '../components/ui/error-boundary'

export default function ChatPage() {
  return (
    <div className="bg-gray-100 min-h-screen font-['Roboto']">
      <div className="container mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold text-center">{APP_NAME}</h1>
        <div className="bg-white shadow-md rounded-lg p-5 mt-5">
          <h2 className="text-2xl font-semibold">Credit Analysis Assistant</h2>
          <p className="mt-3">Get instant insights about credit scoring and risk assessment.</p>
          <ul className="mt-5">
            <li className="border p-4 mb-2 rounded">
              <i className="fas fa-check-circle text-green-500"></i> Analyzing credit applications and data
            </li>
            <li className="border p-4 mb-2 rounded">
              <i className="fas fa-check-circle text-green-500"></i> Providing detailed risk assessments
            </li>
            <li className="border p-4 mb-2 rounded">
              <i className="fas fa-check-circle text-green-500"></i> Explaining credit decisions
            </li>
          </ul>
          <div className="mt-5">
            <ErrorBoundary>
              <Chat />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}

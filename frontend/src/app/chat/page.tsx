"use client"

import { Chat } from '@/components/ui/chat'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6 border-b">
          <h1 className="text-2xl font-bold text-purple-900">Credit Analysis Dashboard</h1>
        </header>
        <div className="py-8">
          <div className="bg-white rounded-lg shadow-lg">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import * as React from 'react'
import { Chat } from '@/components/ui/chat-new'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export default function ChatClient() {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <ErrorBoundary>
        <Chat />
      </ErrorBoundary>
    </div>
  )
}

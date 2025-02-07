"use client"

import * as React from 'react'
import { APP_NAME } from '@/lib/utils'
import Link from 'next/link'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      {children}
    </div>
  )
}

"use client"

import * as React from 'react'
import { Button } from './button'
import { Paperclip, Send } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const WELCOME_MESSAGE = {
  role: 'assistant' as const,
  content: 'Hello! I\'m your AI credit scoring assistant. I can help you understand credit profiles, analyze loan applications, and provide risk assessments. How can I assist you today?'
}

export function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !fileInputRef.current?.files?.length) return

    const formData = new FormData()
    formData.append('message', input)
    
    if (fileInputRef.current?.files?.length) {
      formData.append('file', fileInputRef.current.files[0])
    }

    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about credit scoring or upload a CSV file for analysis..."
        className="border w-full p-3 rounded mb-4"
      />
      <div className="flex justify-between items-center">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv,.pdf,.doc,.docx"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-600 hover:text-gray-800"
        >
          <Paperclip className="h-4 w-4 mr-2" />
          Upload File
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          {isLoading ? 'Sending...' : 'Send'}
          <Send className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <div className="mt-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "p-3 rounded-lg",
              message.role === 'user'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-100 text-gray-900'
            )}
            style={{ maxWidth: '80%' }}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 text-gray-900 p-3 rounded-lg" style={{ maxWidth: '80%' }}>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

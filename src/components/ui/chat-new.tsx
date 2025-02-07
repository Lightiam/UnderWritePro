"use client"

import * as React from 'react'
import { Button } from './button'
import { PaperClipIcon, SendIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([])
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
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn("flex", message.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2 shadow-sm",
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-900 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv,.pdf,.doc,.docx"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="hover:bg-purple-50"
          >
            <PaperClipIcon className="h-4 w-4" />
          </Button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

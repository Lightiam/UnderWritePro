import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function ChatPage() {
  const [message, setMessage] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [messages, setMessages] = React.useState<Array<{type: 'user' | 'assistant', content: string}>>([
    { type: 'assistant', content: 'Hello! I\'m your AI credit scoring assistant. I can help you understand credit profiles, analyze loan applications, and provide risk assessments. How can I assist you today?' }
  ])
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        e.target.value = ''
        return
      }
      setError('')
    }
  }

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message && !fileInputRef.current?.files?.length) return

    setIsLoading(true)
    const formData = new FormData()
    if (message) {
      formData.append('message', message)
      setMessages(prev => [...prev, { type: 'user', content: message }])
    }
    if (fileInputRef.current?.files?.length) {
      formData.append('file', fileInputRef.current.files[0])
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to send message')
      const data = await response.json()
      setMessages(prev => [...prev, { type: 'assistant', content: data.response }])
      setMessage('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to send message. Please try again.')
      setMessages(prev => [...prev, { type: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>UnderwritePro AI</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">UnderwritePro AI</h1>
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800">Credit Analysis Assistant</h2>
          <p className="mt-3 text-gray-600">Get instant insights about credit scoring and risk assessment.</p>
          <ul className="mt-6 space-y-4">
            <li className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-all duration-200">
              <i className="fas fa-check-circle text-green-500 text-xl mr-3"></i>
              <span className="text-gray-700">Analyzing credit applications and data</span>
            </li>
            <li className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-all duration-200">
              <i className="fas fa-check-circle text-green-500 text-xl mr-3"></i>
              <span className="text-gray-700">Providing detailed risk assessments</span>
            </li>
            <li className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-all duration-200">
              <i className="fas fa-check-circle text-green-500 text-xl mr-3"></i>
              <span className="text-gray-700">Explaining credit decisions</span>
            </li>
          </ul>
          <div className="mt-8">
            <div className="mb-6 space-y-4 max-h-[500px] overflow-y-auto relative">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-xl ${
                      msg.type === 'user'
                        ? 'bg-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow'
                        : 'bg-white border border-gray-200 text-gray-800 shadow hover:shadow-md transition-shadow'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-lg bg-white border border-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about credit scoring or upload a CSV file for analysis..."
                  className="w-full p-4 pr-32 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 bg-white shadow-md text-base transition-all duration-200 placeholder-gray-500 hover:shadow-lg"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-2 flex space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv,.pdf,.doc,.docx"
                    className="hidden"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-600 hover:text-purple-600 transition-all duration-200 rounded-xl hover:bg-purple-50 flex items-center"
                    disabled={isLoading}
                    aria-label="Upload file"
                  >
                    <i className="fas fa-paperclip text-lg"></i>
                  </button>
                  <button
                    type="submit"
                    className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
                    disabled={isLoading}
                    aria-label="Send message"
                  >
                    <i className="fas fa-paper-plane text-lg"></i>
                  </button>
                </div>
              </div>
            </form>
            {error && (
              <div className="mt-2 text-red-500 text-sm">{error}</div>
            )}
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-md font-medium">
            <svg className="w-5 h-5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

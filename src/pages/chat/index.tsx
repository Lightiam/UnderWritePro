import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function ChatPage() {
  const [message, setMessage] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
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
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message && !fileInputRef.current?.files?.length) return

    setIsLoading(true)
    const formData = new FormData()
    if (message) formData.append('message', message)
    if (fileInputRef.current?.files?.length) {
      formData.append('file', fileInputRef.current.files[0])
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to send message')
      setMessage('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>UnderwritePro AI</title>
      </Head>
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-6">UnderwritePro AI</h1>
        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Credit Analysis Assistant</h2>
          <p className="mt-2 text-gray-600">Get instant insights about credit scoring and risk assessment.</p>
          <ul className="mt-5 space-y-3">
            <li className="border border-gray-200 p-4 rounded-lg flex items-center bg-white shadow-sm">
              <i className="fas fa-check-circle text-green-500 mr-3 text-lg"></i>
              <span className="text-gray-700">Analyzing credit applications and data</span>
            </li>
            <li className="border border-gray-200 p-4 rounded-lg flex items-center bg-white shadow-sm">
              <i className="fas fa-check-circle text-green-500 mr-3 text-lg"></i>
              <span className="text-gray-700">Providing detailed risk assessments</span>
            </li>
            <li className="border border-gray-200 p-4 rounded-lg flex items-center bg-white shadow-sm">
              <i className="fas fa-check-circle text-green-500 mr-3 text-lg"></i>
              <span className="text-gray-700">Explaining credit decisions</span>
            </li>
          </ul>
          <div className="mt-6">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about credit scoring or upload a CSV file for analysis..."
                  className="w-full p-4 pr-24 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 bg-white shadow-sm"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
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
                    className="p-2.5 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    <i className="fas fa-paperclip text-xl"></i>
                  </button>
                  <button
                    type="submit"
                    className="p-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center shadow-sm"
                    disabled={isLoading}
                  >
                    <i className="fas fa-paper-plane text-xl"></i>
                  </button>
                </div>
              </div>
            </form>
            {error && (
              <div className="mt-2 text-red-500 text-sm">{error}</div>
            )}
          </div>
        </div>
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
            <i className="fas fa-home mr-2"></i>
            Dashboard
          </Link>
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

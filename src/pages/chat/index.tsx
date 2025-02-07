import * as React from 'react'
import { APP_NAME } from '../../lib/utils'
import Link from 'next/link'
import Head from 'next/head'
import Script from 'next/script'

export default function ChatPage() {
  const [message, setMessage] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message && !file) return

    const formData = new FormData()
    if (message) formData.append('message', message)
    if (file) formData.append('file', file)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to send message')
      setMessage('')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen font-['Roboto']">
      <Head>
        <title>{APP_NAME} - Credit Analysis</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js" strategy="beforeInteractive" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">{APP_NAME}</h1>
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800">Credit Analysis Assistant</h2>
          <p className="mt-3 text-gray-600">Get instant insights about credit scoring and risk assessment.</p>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center p-4 border border-gray-200 rounded-lg">
              <i className="fas fa-check-circle text-green-500 mr-3 text-xl"></i>
              <span className="text-gray-700">Analyzing credit applications and data</span>
            </li>
            <li className="flex items-center p-4 border border-gray-200 rounded-lg">
              <i className="fas fa-check-circle text-green-500 mr-3 text-xl"></i>
              <span className="text-gray-700">Providing detailed risk assessments</span>
            </li>
            <li className="flex items-center p-4 border border-gray-200 rounded-lg">
              <i className="fas fa-check-circle text-green-500 mr-3 text-xl"></i>
              <span className="text-gray-700">Explaining credit decisions</span>
            </li>
          </ul>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about credit scoring or upload a CSV file for analysis..."
                className="w-full p-4 pr-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute right-2 top-2 flex space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv,.pdf,.doc,.docx"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <i className="fas fa-paperclip text-xl"></i>
                </button>
                <button
                  type="submit"
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <i className="fas fa-paper-plane text-xl"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <i className="fas fa-home mr-2"></i>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

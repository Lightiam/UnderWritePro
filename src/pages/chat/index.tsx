import * as React from 'react'
import { APP_NAME } from '../../lib/utils'
import Link from 'next/link'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faPaperclip, faPaperPlane, faHome } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white font-['Roboto']">
      <Head>
        <title>{APP_NAME} - Credit Analysis</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-900">{APP_NAME}</h1>
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-purple-900">Credit Analysis Assistant</h2>
          <p className="mt-4 text-gray-600">Get instant insights about credit scoring and risk assessment.</p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-center p-5 border border-purple-100 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <FontAwesomeIcon icon={faCheckCircle} className="text-purple-600 mr-4 text-xl" />
              <span className="text-purple-900">Analyzing credit applications and data</span>
            </li>
            <li className="flex items-center p-5 border border-purple-100 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <FontAwesomeIcon icon={faCheckCircle} className="text-purple-600 mr-4 text-xl" />
              <span className="text-purple-900">Providing detailed risk assessments</span>
            </li>
            <li className="flex items-center p-5 border border-purple-100 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <FontAwesomeIcon icon={faCheckCircle} className="text-purple-600 mr-4 text-xl" />
              <span className="text-purple-900">Explaining credit decisions</span>
            </li>
          </ul>
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about credit scoring or upload a CSV file for analysis..."
                className="w-full p-5 pr-36 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
              />
              <div className="absolute right-3 top-2.5 flex space-x-3">
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
                  className="p-2.5 text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faPaperclip} className="text-xl" />
                </button>
                <button
                  type="submit"
                  className="p-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="text-xl" />
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl">
            <FontAwesomeIcon icon={faHome} className="mr-3 text-lg" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

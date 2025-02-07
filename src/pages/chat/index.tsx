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
    <div className="min-h-screen bg-gray-100 font-['Roboto']">
      <Head>
        <title>{APP_NAME} - Credit Analysis</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-bold text-center">{APP_NAME}</h1>
        <div className="bg-white shadow-md rounded-lg p-5 mt-5">
          <h2 className="text-2xl font-semibold">Credit Analysis Assistant</h2>
          <p className="mt-3">Get instant insights about credit scoring and risk assessment.</p>
          <ul className="mt-5">
            <li className="border p-4 mb-2 rounded flex items-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> 
              Analyzing credit applications and data
            </li>
            <li className="border p-4 mb-2 rounded flex items-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> 
              Providing detailed risk assessments
            </li>
            <li className="border p-4 mb-2 rounded flex items-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> 
              Explaining credit decisions
            </li>
          </ul>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about credit scoring or upload a CSV file for analysis..."
                className="w-full p-4 pr-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
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
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faPaperclip} className="text-xl" />
                </button>
                <button
                  type="submit"
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="text-xl" />
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

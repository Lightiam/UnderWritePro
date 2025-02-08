import * as React from 'react'
import { APP_NAME } from '../lib/utils'
import Link from 'next/link'

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
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-bold text-center">{APP_NAME}</h1>
        <div className="bg-white shadow-md rounded-lg p-5 mt-5">
          <h2 className="text-2xl font-semibold">Credit Analysis Assistant</h2>
          <p className="mt-3">Get instant insights about credit scoring and risk assessment.</p>
          <ul className="mt-5">
            <li className="border p-4 mb-2 rounded">
              <i className="fas fa-check-circle text-green-500"></i> Analyzing credit applications and data
            </li>
            <li className="border p-4 mb-2 rounded">
              <i className="fas fa-check-circle text-green-500"></i> Providing detailed risk assessments
            </li>
            <li className="border p-4 mb-2 rounded">
              <i className="fas fa-check-circle text-green-500"></i> Explaining credit decisions
            </li>
          </ul>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about credit scoring or upload a CSV file for analysis..."
              className="border w-full p-3 rounded"
            />
            <div className="flex justify-between items-center">
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
                className="text-gray-600 hover:text-gray-800"
              >
                <i className="fas fa-paperclip mr-2"></i>
                Upload File
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </form>
        </div>
        <div className="text-center mt-5">
          <Link href="/" className="bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

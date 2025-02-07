import * as React from 'react'
import Head from 'next/head'

export default function ChatPage() {
  return (
    <>
      <Head>
        <title>UnderwritePro AI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"></link>
        <style>{`
          body {
            font-family: 'Roboto', sans-serif;
          }
        `}</style>
      </Head>
      <div className="bg-gray-100">
        <div className="container mx-auto mt-10">
          <h1 className="text-3xl font-bold text-center">UnderwritePro AI</h1>
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
            <div className="mt-5">
              <input type="text" placeholder="Ask about credit scoring or upload a CSV file for analysis..." className="border w-full p-3 rounded" />
            </div>
          </div>
          <div className="text-center mt-5">
            <a href="#" className="bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold">Dashboard</a>
          </div>
        </div>
      </div>
    </>
  )
}

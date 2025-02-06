"use client"

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Alert, AlertDescription } from './alert';
import { Button } from './button';

interface Factor {
  name: string;
  score: number;
  impact: string;
  weight: number;
}

interface ApiResponse {
  message?: string;
  error?: string;
  credit_score?: number;
  details?: string;
  factors?: Factor[];
  recommendations?: string[];
}

interface Message {
  content: string | React.ReactNode;
  isUser: boolean;
}

export function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([{
    content: "Hello! I'm your AI credit scoring assistant. How can I help you today? You can ask me questions about credit scoring or upload documents for analysis.",
    isUser: false
  }]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    const userMessage = message.trim();
    setMessages((prev) => [...prev, { content: userMessage, isUser: true }]);
    setIsLoading(true);
    setMessage('');

    // Check API health
    try {
      const healthCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      if (!healthCheck.ok) {
        throw new Error('API service is currently unavailable. Please try again later.');
      }
    } catch (error) {
      setIsLoading(false);
      setMessages((prev) => [...prev, { 
        content: (
          <Alert variant="destructive">
            <AlertDescription>
              Cannot connect to the API. Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        ),
        isUser: false 
      }]);
      return;
    }

    // Add typing indicator
    setMessages((prev) => [...prev, {
      content: (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
        </div>
      ),
      isUser: false
    }]);

    try {
      // Add typing indicator while checking API health
      const TypingIndicator = () => (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
        </div>
      );

      setMessages((prev) => [...prev, { 
        content: <TypingIndicator />,
        isUser: false 
      }]);

      // Check API health first
      const healthCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);
      if (!healthCheck.ok) {
        throw new Error('API service is currently unavailable. Please try again later.');
      }
      
      const healthData = await healthCheck.json();
      if (!healthData.openai_configured) {
        throw new Error('OpenAI API is not configured. Please try again later.');
      }

      // Remove typing indicator after health check
      setMessages((prev) => prev.slice(0, -1));

      // Add typing indicator for API request
      setMessages((prev) => [...prev, { 
        content: <TypingIndicator />,
        isUser: false 
      }]);

      const apiUrl = 'https://lendify-ai-api.netlify.app/.netlify/functions/api';

      // Check API health first
      try {
        const healthCheck = await fetch(`${apiUrl}/health`);
        if (!healthCheck.ok) {
          throw new Error('API service is currently unavailable');
        }
        const healthData = await healthCheck.json();
        if (!healthData.openai_configured) {
          throw new Error('OpenAI API is not configured');
        }
      } catch (error) {
        throw new Error('Cannot connect to the API. Please try again later.');
      }

      try {
        const response = await fetch(`${apiUrl}/chat`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ content: userMessage })
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        // Remove typing indicator before adding response
        setMessages((prev) => prev.slice(0, -1));

        setMessages((prev) => [...prev, {
          content: data.message || 'No response from server',
          isUser: false
        }]);

      } catch (error) {
        // Remove typing indicator
        setMessages((prev) => prev.slice(0, -1));
        
        setMessages((prev) => [...prev, {
          content: (
            <div className="text-red-500">
              Error: {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </div>
          ),
          isUser: false
        }]);
      }

      // Previous API call already handled the response
      return;
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { 
        content: (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              {error instanceof Error ? error.message : 'Sorry, I could not process your request. Please try again.'}
            </p>
          </div>
        ),
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    setMessages((prev) => [...prev, { 
      content: `Uploading file: ${file.name}...`,
      isUser: true 
    }]);
    setIsLoading(true);

    try {
      setMessages((prev) => [...prev, { 
        content: (
          <div className="flex items-center space-x-2 text-blue-600">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analyzing {file.name}...</span>
          </div>
        ),
        isUser: false 
      }]);

      const apiUrl = 'https://lendify-ai-api.netlify.app/.netlify/functions/api';
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result;
        if (!content) {
          throw new Error('Failed to read file content');
        }

      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          filename: file.name,
          content: content
        })
      });

      if (!response.ok) {
        throw new Error(`File upload failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { 
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Credit Score Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{data.credit_score}</p>
                <p className="text-sm text-blue-600">Credit Score</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">{data.details}</p>
              </div>
            </div>
            {data.factors && (
              <div className="space-y-2">
                <h4 className="font-medium">Key Factors</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {data.factors.map((factor: Factor, index: number) => (
                    <div key={`upload-factor-${index}`} className="p-2 bg-gray-50 rounded">
                      <p className="text-sm font-medium">{factor.name}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-600">Impact: {factor.impact}</p>
                        <p className="text-xs font-medium text-blue-600">Score: {factor.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.recommendations && (
              <div className="space-y-2">
                <h4 className="font-medium">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1">
                  {data.recommendations.map((rec: string, index: number) => (
                    <li key={`upload-rec-${index}`} className="text-sm text-gray-600">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ),
        isUser: false 
      }]);
    };

    reader.readAsText(file);
    } catch (error) {
      console.error('Upload error:', error);
      setMessages((prev) => [...prev, { 
        content: (
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to upload file. Please try again.'}
            </AlertDescription>
          </Alert>
        ),
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
      setFile(null);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-blue-900">Lendify AI Assistant</h1>
            <p className="text-xl text-blue-600 mt-2">Get instant insights about credit scoring and risk assessment</p>
          </div>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isUser && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">AI</span>
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
                    msg.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-100'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">AI</span>
                  </div>
                </div>
                <div className="max-w-[80%] rounded-lg p-4 bg-gray-50 text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative bg-white rounded-lg shadow-sm">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about credit scoring or upload a CSV file for analysis..."
                  className="w-full p-4 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm"
                  disabled={isLoading}
                />
                <label className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".csv,.pdf,.doc,.docx"
                    className="hidden"
                    disabled={isLoading}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </label>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || (!message.trim() && !file)}
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <span>Sending</span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                  </span>
                ) : 'Send'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Press Enter to send • Upload CSV, PDF, DOC, or DOCX files for instant analysis
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

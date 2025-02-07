"use client"

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Alert, AlertDescription } from './alert';
import { Button } from './button';

interface Factor {
  name: string;
  score: number;
  weight?: number;
  impact: string;
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

interface Props {
  className?: string;
}

export function Chat({ className = "" }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([{
    content: "Hello! I'm your AI credit scoring assistant. How can I help you today? You can ask me questions about credit scoring or upload documents for analysis.",
    isUser: false
  }]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
    </div>
  );

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    const userMessage = message.trim();
    setMessages((prev: Message[]) => [...prev, { content: userMessage, isUser: true }]);
    setIsLoading(true);
    setMessage('');
    setIsTyping(true);

    try {
      if (!apiUrl) {
        throw new Error('API URL is not configured');
      }

      // Check API health first
      const healthCheck = await fetch(`${apiUrl}/health`);
      if (!healthCheck.ok) {
        throw new Error('API service is currently unavailable. Please try again later.');
      }
      const healthData = await healthCheck.json();
      
      if (!healthData.openai_configured) {
        throw new Error('OpenAI API is not properly configured. Please try again later.');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          content: userMessage,
          model: "gpt-3.5-turbo",
          max_tokens: 500,
          temperature: 0.7,
          system_message: "You are an AI credit scoring assistant for Lendify AI. Help users understand credit profiles, loan applications, risk assessment, and debt management. Be professional and provide actionable recommendations."
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      // Remove typing indicator
      setMessages((prev: Message[]) => prev.filter(msg => msg.content !== <TypingIndicator />));
      
      if (!response.ok || data.error) {
        const errorMessage = data.error || `API request failed with status ${response.status}`;
        setMessages((prev: Message[]) => [...prev, { 
          content: (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">Error: {errorMessage}</p>
              <p className="text-xs text-red-600 mt-1">Please try again or contact support if the issue persists.</p>
            </div>
          ), 
          isUser: false 
        }]);
        setIsTyping(false);
        setIsLoading(false);
        return;
      }
      
      if (data.message) {
        setMessages((prev: Message[]) => [...prev, { 
          content: (
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-800">{data.message}</p>
            </div>
          ), 
          isUser: false 
        }]);
      } else if (data.credit_score) {
        setMessages((prev: Message[]) => [...prev, {
          content: (
            <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Credit Score Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-3xl font-bold text-blue-600">{data.credit_score}</p>
                  <p className="text-sm text-blue-600 mt-1">Credit Score</p>
                </div>
                {data.details && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm font-medium text-gray-700">{data.details}</p>
                  </div>
                )}
              </div>
              {data.factors && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Key Factors</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.factors.map((factor, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-sm font-medium text-gray-800">{factor.name}</p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            factor.impact === 'Excellent' ? 'bg-green-100 text-green-800' :
                            factor.impact === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                            factor.impact === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {factor.impact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data.recommendations && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Recommendations</h4>
                  <ul className="space-y-2">
                    {data.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                        <span className="ml-2 text-sm text-gray-600">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ),
          isUser: false
        }]);
      } else {
        throw new Error('Invalid response format from API');
      }
      
      // Scroll to bottom after new message
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error in chat:', error);
      setIsTyping(false);
      setMessages((prev: Message[]) => [...prev, {
        content: (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Please try again or contact support if the issue persists.
            </p>
          </div>
        ),
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supportedTypes = ['.csv', '.pdf', '.doc', '.docx'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    setIsTyping(true);
    
    if (!supportedTypes.includes(fileExtension)) {
      setMessages((prev: Message[]) => [...prev, {
        content: (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Please upload a CSV, PDF, DOC, or DOCX file for credit analysis.</span>
            </AlertDescription>
          </Alert>
        ),
        isUser: false
      }]);
      if (e.target) e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessages((prev: Message[]) => [...prev, {
        content: (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>File size must be less than 10MB.</span>
            </AlertDescription>
          </Alert>
        ),
        isUser: false
      }]);
      if (e.target) e.target.value = '';
      return;
    }

    setFile(file);
    setMessages((prev: Message[]) => [...prev, { 
      content: (
        <div className="flex items-center space-x-2 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Analyzing {file.name}...</span>
        </div>
      ),
      isUser: true 
    }]);
    setIsLoading(true);

    try {
      setMessages((prev: Message[]) => [...prev, { 
        content: <TypingIndicator />,
        isUser: false 
      }]);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result;
        if (!content) {
          throw new Error('Failed to read file content');
        }

      if (!apiUrl) {
        throw new Error('API URL is not configured');
      }

      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          content: content
        })
      });

      if (!response.ok) {
        throw new Error(`File upload failed with status ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Remove typing indicator
      setMessages((prev: Message[]) => prev.slice(0, -1));

      setMessages((prev: Message[]) => [...prev, { 
        content: (
          <div className="space-y-4 p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-800">Credit Score Analysis</h3>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Score: {data.credit_score}
              </div>
            </div>
            
            <div className="text-sm text-gray-700">{data.details}</div>
            {data.factors && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Key Factors</h4>
                <div className="grid gap-2">
                  {data.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-800">{factor.name}</span>
                        <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                          {factor.impact}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-xs text-gray-500">Weight: {factor.weight}%</div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${factor.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-blue-700">{factor.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.recommendations && (
              <div className="space-y-3 mt-4">
                <h4 className="font-medium text-gray-900">Recommendations</h4>
                <div className="space-y-2">
                  {data.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-blue-900">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ),
        isUser: false 
      }]);
    };

    reader.readAsText(file);
    } catch (error) {
      // Remove typing indicator
      setMessages((prev: Message[]) => prev.slice(0, -1));
      
      setMessages((prev: Message[]) => [...prev, {
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
    <div className="space-y-4">
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="space-y-2">
            <span className="text-sm font-medium text-gray-500">
              {msg.isUser ? 'You' : 'AI'}
            </span>
            <p className="text-gray-800">{msg.content}</p>
          </div>
        ))}
        {(isLoading || isTyping) && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-500">AI</span>
            <div className="text-gray-800">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about credit scoring or upload documents for analysis..."
            className="w-full p-3 border border-gray-300 rounded-lg pr-12"
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
            <span className="text-gray-400 hover:text-gray-600">
              📎
            </span>
          </label>
        </div>
        <p className="text-sm text-gray-500">
          Press Enter to send • Upload CSV, PDF, DOC, or DOCX files for instant credit analysis
        </p>
      </form>
    </div>
  );
}

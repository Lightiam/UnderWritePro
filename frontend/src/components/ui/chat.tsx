"use client"

import { useState, ReactNode } from 'react';
import { APP_NAME } from '@/lib/utils';
import { Paperclip, Send, Bot, ArrowLeft } from 'lucide-react';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import Link from 'next/link';

interface Message {
  content: string | ReactNode;
  isUser: boolean;
}

export function Chat() {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setIsLoading(true);
    setMessages((prev: Message[]) => [...prev, { content: userMessage, isUser: true }]);
    setMessage('');

    try {
      const response = await fetch('https://lendify-ai-api.netlify.app/.netlify/functions/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ content: userMessage }),
        mode: 'cors',
        credentials: 'omit'
      });
    
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Raw API Response:', data);
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        throw new Error(`API error: ${response.status} - ${response.statusText}`);
      }

      if (data.error) {
        console.error('API Error:', data.error);
        throw new Error(data.error);
      }

      const responseContent = data.message;
      console.log('Response content:', responseContent);
      
      if (responseContent) {
        setMessages((prev: Message[]) => [...prev, { 
          content: responseContent,
          isUser: false 
        }]);
      } else {
        console.error('No response content found in API response:', data);
        throw new Error('No response content found in API response');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev: Message[]) => [...prev, { 
        content: (
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : 'Sorry, I could not process your request. Please try again.'}
            </AlertDescription>
          </Alert>
        ),
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isLoading) return;

    setIsLoading(true);
    setMessages((prev: Message[]) => [...prev, { 
      content: `Processing file: ${file.name}...`, 
      isUser: true 
    }]);

    try {
      // Convert file to text and send as JSON
      const fileContent = await file.text();
      const response = await fetch('https://lendify-ai-api.netlify.app/.netlify/functions/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          filename: file.name,
          content: fileContent
        }),
        mode: 'cors',
        credentials: 'omit'
      });
      
      console.log('Upload response status:', response.status);
      const data = await response.json();
      console.log('Upload response data:', data);
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      if (data.credit_score) {
        setMessages((prev: Message[]) => [...prev, { 
          content: (
            <div className="space-y-8 p-6 md:p-8 bg-white rounded-2xl shadow-lg">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Credit Score Analysis
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="relative">
                  <div className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {Math.round(data.credit_score)}
                  </div>
                  <div className="absolute -bottom-2 left-1 w-full h-2 bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-full" />
                </div>
                <div className="text-sm md:text-base text-blue-600 font-semibold px-5 py-2 bg-blue-50 rounded-full inline-flex items-center justify-center shadow-sm">
                  {data.credit_score >= 750 ? 'Excellent' : data.credit_score >= 700 ? 'Very Good' : data.credit_score >= 650 ? 'Good' : 'Fair'}
                </div>
              </div>
              <div className="text-gray-600 text-base md:text-lg leading-relaxed">{data.details}</div>
              {data.factors && (
                <div className="space-y-4">
                  {data.factors.map((factor: any, index: number) => (
                    <div key={index} className="group flex items-center justify-between p-5 md:p-6 bg-gradient-to-br from-white to-blue-50/30 rounded-xl border-2 border-blue-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <span className="text-base md:text-lg font-semibold text-gray-800">{factor.name}</span>
                        {factor.weight && (
                          <span className="text-sm md:text-base text-blue-600/70 font-medium">({factor.weight}%)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{factor.score}</span>
                        <span className="text-sm md:text-base px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-medium shadow-sm group-hover:bg-blue-200 transition-colors">{factor.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {data.recommendations && (
                <div className="mt-10 space-y-6">
                  <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Recommendations
                  </div>
                  <ul className="list-none space-y-4">
                    {data.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-base md:text-lg text-gray-700 leading-relaxed">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                        {rec}
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
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev: Message[]) => [...prev, { 
        content: (
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : 'Unable to process your file. Please try again.'}
            </AlertDescription>
          </Alert>
        ),
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-100px)] bg-gradient-to-br from-blue-50 to-white">
      <div className="sticky top-0 z-10 p-4 md:p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link 
            href="/" 
            className="p-2 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {APP_NAME}
            </h2>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full shadow-sm">Beta</span>
          </div>
        </div>
        <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto justify-start md:justify-end">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 rounded-lg shadow-sm hover:shadow transition-all">
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">AI-Powered Credit Analysis</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-12 space-y-4 md:space-y-6">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-8 md:py-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent" />
              <div className="relative">
                <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32 mb-8 md:mb-10">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20" />
                  <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 to-white rounded-full shadow-lg">
                    <Bot className="w-12 h-12 md:w-16 md:h-16 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Welcome to {APP_NAME}
                </h3>
                <p className="text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed text-gray-600 mb-12 md:mb-16">
                  Your AI-powered assistant for credit scoring and risk assessment
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <div className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 md:p-8 text-left transition-all hover:shadow-lg border-2 border-blue-100 hover:border-blue-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                        <Paperclip className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                      </div>
                      <h4 className="text-xl font-semibold text-blue-900">Upload Documents</h4>
                    </div>
                    <p className="text-gray-600">Upload credit documents for instant analysis and scoring</p>
                  </div>
                  <div className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 md:p-8 text-left transition-all hover:shadow-lg border-2 border-blue-100 hover:border-blue-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                        <Bot className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                      </div>
                      <h4 className="text-xl font-semibold text-blue-900">Ask Questions</h4>
                    </div>
                    <p className="text-gray-600">Get expert insights on credit scoring and risk assessment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} px-2 md:px-6 group`}>
            <div
              className={`max-w-[85%] md:max-w-3xl px-5 md:px-6 py-3.5 md:py-4 rounded-2xl shadow-lg transform transition-all duration-200 ${
                msg.isUser
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white group-hover:translate-x-[-2px]'
                  : 'bg-white text-gray-900 border-2 border-blue-100 hover:border-blue-200 group-hover:translate-x-[2px]'
              }`}
            >
              <div className="text-sm md:text-base leading-relaxed tracking-wide">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start px-2 md:px-6">
            <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-lg border-2 border-blue-100 group hover:border-blue-200 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-transparent animate-pulse rounded-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-30" />
                  <Bot className="w-5 h-5 text-blue-600 relative" />
                </div>
                <span className="text-sm md:text-base text-blue-700 font-medium">Processing your request</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-600/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-600/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-600/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="sticky bottom-0 border-t bg-white/95 backdrop-blur-sm shadow-lg px-4 md:px-8 py-4 md:py-6">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 md:gap-4 max-w-4xl mx-auto">
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept=".csv,.pdf,.doc,.docx"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            asChild
            className="relative text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all p-2.5 rounded-xl group"
            disabled={isLoading}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              <Paperclip className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110 duration-200" />
              <div className="absolute inset-0 bg-blue-100 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" />
            </label>
          </Button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me about credit scoring and risk assessment..."
              className="w-full px-4 md:px-5 py-3 md:py-4 text-base md:text-lg rounded-2xl bg-white border-2 border-blue-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-200 transition-all"
              disabled={isLoading}
              data-devinid="2"
            />
            <div className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity opacity-0 hover:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 to-transparent" />
            </div>
          </div>
          
          <Button 
            type="submit" 
            variant="ghost"
            size="icon"
            disabled={isLoading || !message.trim()}
            className="relative text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all p-2.5 rounded-xl group"
            data-devinid="3"
          >
            <Send className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110 duration-200" />
            <div className="absolute inset-0 bg-blue-100 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" />
          </Button>
        </form>
      </div>
    </div>
  );
}

"use client"

import { useState, ReactNode } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';

export function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ content: string | ReactNode; isUser: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { content: message, isUser: true }]);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { content: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        content: (
          <Alert variant="destructive">
            <AlertDescription>
              Sorry, I couldn't process your request. Please try again.
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
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { 
        content: `Processing file: ${file.name}...`, 
        isUser: true 
      }]);
      
      if (data.credit_score) {
        setMessages(prev => [...prev, { 
          content: (
            <div className="space-y-2">
              <div className="font-medium">Credit Score Analysis</div>
              <div className="text-2xl font-bold">{Math.round(data.credit_score)}</div>
              <div className="text-sm">{data.details}</div>
            </div>
          ), 
          isUser: false 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          content: data.message || 'File processed successfully', 
          isUser: false 
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        content: (
          <Alert variant="destructive">
            <AlertDescription>
              Sorry, I couldn't process your file. Please try again.
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
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-slate-500 py-12">
            <h3 className="text-lg font-semibold mb-2">Welcome to UnderWritePro AI Assistant</h3>
            <p className="text-sm">
              I can help you analyze credit data and answer questions about underwriting.
              Upload a file or start a conversation to begin.
            </p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm ${
                msg.isUser
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-2.5 flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t bg-white px-4 py-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
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
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              <Paperclip className="w-5 h-5" />
            </label>
          </Button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message UnderwritePro..."
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none"
            disabled={isLoading}
          />
          
          <Button 
            type="submit" 
            variant="ghost"
            size="icon"
            disabled={isLoading || !message.trim()}
            className="text-gray-500 hover:text-gray-700"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, Send, Loader2, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  content: string | React.ReactNode;
  isUser: boolean;
}

export function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([{
    content: "Hello! I'm your AI credit scoring assistant. I can help analyze credit data and provide insights. You can upload a CSV file with credit information or ask me questions about credit scoring.",
    isUser: false
  }]);
  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { content: message, isUser: true }]);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process chat request');
      }

      const data = await response.json();
      
      if (data.credit_score) {
        setMessages(prev => [...prev, { 
          content: (
            <div className="space-y-4">
              <div className="text-lg font-semibold">Credit Score Analysis</div>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-purple-600">
                  {Math.round(data.credit_score)}
                </div>
                <div className="text-sm text-gray-600">
                  Credit Score
                </div>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {data.details}
              </div>
            </div>
          ),
          isUser: false 
        }]);
      } else {
        setMessages(prev => [...prev, { content: data.response, isUser: false }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        content: (
          <div className="text-red-500">
            Sorry, I couldn't process your request. Please try again.
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
    if (!file || isLoading) return;

    if (!file.name.endsWith('.csv')) {
      setMessages(prev => [...prev, { 
        content: (
          <div className="text-red-500">
            Please upload a CSV file containing credit data.
          </div>
        ),
        isUser: false 
      }]);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      setMessages(prev => [...prev, { 
        content: (
          <div className="text-gray-600">
            Processing file: {file.name}...
          </div>
        ), 
        isUser: true 
      }]);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to process file upload');
      }

      const data = await response.json();
      
      if (data.credit_score) {
        setMessages(prev => [...prev, { 
          content: (
            <div className="space-y-4 bg-white rounded-lg p-6 shadow-lg">
              <div className="text-xl font-semibold text-purple-600">Credit Score Analysis</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-purple-600">
                    {Math.round(data.credit_score)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Credit Score
                  </div>
                </div>
                <div className="text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-600">
                  {data.credit_score >= 700 ? 'Excellent' : 
                   data.credit_score >= 650 ? 'Good' :
                   data.credit_score >= 600 ? 'Fair' : 'Poor'}
                </div>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line mt-4">
                {data.details}
              </div>
            </div>
          ), 
          isUser: false 
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        content: (
          <div className="text-red-500">
            Sorry, I couldn't process your file. Please try again.
          </div>
        ),
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-start gap-3",
              msg.isUser ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border shadow-sm",
              msg.isUser ? "bg-purple-600 text-white" : "bg-white"
            )}>
              {msg.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={cn(
                "chat-message",
                msg.isUser ? "chat-message-user" : "chat-message-system"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="chat-button"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="chat-button bg-purple-600 text-white hover:bg-purple-700"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

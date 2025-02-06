'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, Send, Loader2, Bot, User } from 'lucide-react';
import { ErrorMessage } from './error-message';
import { CreditScore } from './credit-score';
import { cn } from '@/lib/utils';

interface Message {
  content: string | React.ReactNode;
  isUser: boolean;
}

export function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([{
    content: (
      <div className="prose prose-sm max-w-none">
        Hello! I'm your AI credit scoring assistant. I can help analyze credit data and provide insights. You can upload a CSV file with credit information or ask me questions about credit scoring.
      </div>
    ),
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
    setMessages(prev => [...prev, { 
      content: (
        <div className="prose prose-sm max-w-none">
          {message}
        </div>
      ), 
      isUser: true 
    }]);
    setMessage('');

    try {
      setMessages(prev => [...prev, {
        content: (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing your request...
          </div>
        ),
        isUser: false
      }]);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        throw new Error('Failed to process chat request');
      }

      const data = await response.json();

      setMessages(prev => {
        const messages = prev.slice(0, -1); // Remove loading message
        return [...messages, {
          content: (
            <div className="prose prose-sm max-w-none">
              {data.response}
            </div>
          ),
          isUser: false
        }];
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev.slice(0, -1), {
        content: <ErrorMessage message="Failed to process your request. Please try again." />,
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
        content: <ErrorMessage message="Please upload a CSV file containing credit data." />,
        isUser: false 
      }]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    setMessages(prev => [...prev, {
      content: (
        <div className="flex items-center gap-2 text-sm">
          <Paperclip className="h-4 w-4" />
          {file.name}
        </div>
      ),
      isUser: true
    }, {
      content: (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Analyzing credit data from {file.name}...
        </div>
      ),
      isUser: false
    }]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to process file upload');
      }

      const data = await response.json();
      
      if (data.credit_score) {
        setMessages(prev => [...prev.slice(0, -1), {
          content: <CreditScore score={data.credit_score} details={data.details} />,
          isUser: false
        }]);
      } else {
        setMessages(prev => [...prev.slice(0, -1), {
          content: (
            <div className="prose prose-sm max-w-none">
              {data.response || 'Failed to analyze credit data. Please try again.'}
            </div>
          ),
          isUser: false
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev.slice(0, -1), {
        content: <ErrorMessage message="Failed to process the file. Please ensure it contains valid credit data and try again." />,
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
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-start gap-4",
              msg.isUser ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full shadow-md",
              msg.isUser ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white" : "bg-white border border-gray-100"
            )}>
              {msg.isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
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

      <div className="border-t bg-white p-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
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
            className="chat-button chat-button-ghost"
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
            disabled={isLoading || !message.trim()}
            className="chat-button chat-button-primary"
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

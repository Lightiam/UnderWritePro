import { useState, ReactNode } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Button } from './button.tsx';
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { 
        content: `Processing file: ${file.name}...`, 
        isUser: true 
      }]);
      setMessages(prev => [...prev, { 
        content: data.message || 'File processed successfully', 
        isUser: false 
      }]);
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
    <div className="flex flex-col h-full bg-white rounded-lg">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-slate-900">Credit Score Assistant</h2>
        <p className="text-sm text-slate-500 mt-1">Upload documents or ask questions about credit scoring</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-slate-500 py-8">
            <p className="text-lg font-medium">Welcome to UnderWritePro!</p>
            <p className="mt-2">Ask questions about credit scoring or upload documents for analysis.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} items-start`}>
            <div className={`max-w-[80%] rounded-lg px-6 py-3 shadow-sm ${
              msg.isUser ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-start">
            <div className="bg-slate-50 text-slate-900 rounded-lg px-6 py-3 border border-slate-100 shadow-sm flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-6 flex items-center gap-3">
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
          className="hover:bg-slate-100"
          disabled={isLoading}
        >
          <label htmlFor="file-upload" className="cursor-pointer">
            <Paperclip className="w-5 h-5 text-slate-600" />
          </label>
        </Button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about credit scoring or upload documents..."
          className="flex-1 bg-slate-50 rounded-lg px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600/10 border border-slate-200 hover:border-slate-300 transition-colors disabled:opacity-50"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !message.trim()}
          className="px-6"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}

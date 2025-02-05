import { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Button } from './button';

export function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([]);
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
        content: "Sorry, I couldn't process your request. Please try again.", 
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
        content: "Sorry, I couldn't process your file. Please try again.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-slate-900">Credit Score Assistant</h2>
        <p className="text-sm text-slate-500">Upload documents or ask questions about credit scoring</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
              msg.isUser ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-900'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-900 rounded-lg px-4 py-2">
              Thinking...
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4 flex items-center gap-2">
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
          placeholder="Type your message..."
          className="flex-1 bg-slate-50 rounded-lg px-4 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !message.trim()}>
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}

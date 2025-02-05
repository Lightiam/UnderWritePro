import { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';

export function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages(prev => [...prev, { content: message, isUser: true }]);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { content: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { content: `File processed: ${data.message}`, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
              msg.isUser ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-900'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4 flex items-center gap-2">
        <input
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
        >
          <Paperclip className="w-5 h-5 text-gray-500" />
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

import { Chat } from '@/components/ui/chat';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-900">Lendify AI Chat</h1>
          </div>
        </header>
        <main className="py-8">
          <Chat />
        </main>
      </div>
    </div>
  );
}

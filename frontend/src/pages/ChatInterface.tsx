import { Chat } from '../components/ui/chat';

export function ChatInterface() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 text-center text-sm">
        The Role of AI and IDP in Underwriting's Future →
      </div>
      
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="text-purple-600 font-bold text-xl">UnderWritePro</div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-[calc(100vh-12rem)]">
          <Chat />
        </div>
      </main>
    </div>
  );
}

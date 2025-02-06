import { Chat } from '@/components/ui/chat';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-purple-600">UnderwritePro AI</h1>
              <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600 font-medium">
                Beta
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-500">AI-Powered Credit Scoring</div>
              <Link href="/" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-6 py-6 overflow-hidden">
        <div className="h-full max-w-5xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Credit Analysis Assistant</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload credit data or ask questions about credit scoring
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg h-[calc(100%-6rem)]">
            <Chat />
          </div>
        </div>
      </main>
    </div>
  );
}

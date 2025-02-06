import { Chat } from '@/components/ui/chat';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 text-center text-sm">
        Beta
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">
              AI-Powered Credit Scoring
            </h1>
            <p className="text-lg text-gray-600">
              Intelligent credit analysis and risk assessment
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Credit Analysis Assistant
                </h2>
                <p className="text-sm text-gray-500">
                  Upload credit data or ask questions about credit scoring
                </p>
              </div>
            </div>
            
            <div className="h-[calc(100vh-20rem)]">
              <Chat />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

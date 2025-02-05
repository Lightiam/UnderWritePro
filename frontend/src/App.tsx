import { Chat } from './components/ui/chat';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-purple-600 text-white py-2 px-4 text-center text-sm">
        The Future of AI-Powered Credit Scoring →
      </div>
      
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="text-purple-600 font-bold text-xl">CreditScorePro</div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-slate-600 hover:text-slate-900">Product</a>
              <a href="#" className="text-slate-600 hover:text-slate-900">Solutions</a>
              <a href="#" className="text-slate-600 hover:text-slate-900">Responsible AI</a>
              <a href="#" className="text-slate-600 hover:text-slate-900">Partners</a>
              <a href="#" className="text-slate-600 hover:text-slate-900">Resources</a>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Chat />
      </main>
    </div>
  );
}

export default App;

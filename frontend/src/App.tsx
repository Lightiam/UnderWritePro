import { Chat } from './components/ui/chat';
import { Button } from './components/ui/button';

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
              <div className="text-purple-600 font-bold text-xl">UnderWritePro</div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-slate-600 hover:text-slate-900">Product</a>
              <a href="#" className="text-slate-600 hover:text-slate-900">Solutions</a>
              <a href="#" className="text-slate-600 hover:text-slate-900">Responsible AI</a>
              <a href="#" className="text-slate-600 hover:text-slate-900">Partners</a>
              <a href="#" className="text-slate-600 hover:text-slate-900">Resources</a>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-900">AI-Powered Credit Scoring</h1>
            <p className="text-lg text-slate-600">Make better lending decisions with our advanced AI technology.</p>
            <div className="flex gap-4">
              <Button size="lg">Try Demo</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
          <div>
            <Chat />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

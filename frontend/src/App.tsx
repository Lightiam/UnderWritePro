import { Chat } from './components/ui/chat';
import { Button } from './components/ui/button';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 text-center text-sm">
        Revolutionizing Credit Scoring with AI →
      </div>
      
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="text-purple-600 font-bold text-xl">UnderWritePro</div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium">Features</a>
              <a href="#solutions" className="text-slate-600 hover:text-slate-900 font-medium">Solutions</a>
              <a href="#ai" className="text-slate-600 hover:text-slate-900 font-medium">Responsible AI</a>
              <a href="#partners" className="text-slate-600 hover:text-slate-900 font-medium">Partners</a>
              <a href="#resources" className="text-slate-600 hover:text-slate-900 font-medium">Resources</a>
              <Button size="lg">Try Demo</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6 flex flex-col justify-center">
            <h1 className="text-5xl font-bold text-slate-900 leading-tight">
              AI-Powered Credit Scoring for the Modern Era
            </h1>
            <p className="text-xl text-slate-600">
              Make smarter, faster lending decisions with our advanced AI technology. 
              Upload documents or chat with our AI to get instant credit assessments.
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" className="text-base px-8">Try Demo</Button>
              <Button variant="outline" size="lg" className="text-base px-8">Learn More</Button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-slate-200">
            <Chat />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

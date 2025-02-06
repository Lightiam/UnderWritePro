import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();
  
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
            <div className="flex items-center">
              <div className="hidden md:flex items-center space-x-8">
                <a href="#product" className="text-slate-600 hover:text-slate-900 font-medium">Product</a>
                <a href="#solutions" className="text-slate-600 hover:text-slate-900 font-medium">Solutions</a>
                <a href="#responsible-ai" className="text-slate-600 hover:text-slate-900 font-medium">Responsible AI</a>
                <a href="#partners" className="text-slate-600 hover:text-slate-900 font-medium">Partners</a>
                <a href="#resources" className="text-slate-600 hover:text-slate-900 font-medium">Resources</a>
                <Button size="lg" onClick={() => navigate('/chat')}>Get Started</Button>
              </div>
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Badge className="mb-8 bg-purple-100 text-purple-800 rounded-full px-4 py-1">
          GEN AI FOR INSURANCE UNDERWRITING
        </Badge>
        
        <h1 className="text-6xl font-bold tracking-tight">
          <span className="text-slate-900">Amplifying</span>{' '}
          <span className="text-purple-600">Confidence In</span>{' '}
          <span className="text-purple-300">Every Underwriting</span>{' '}
          <span className="text-slate-900">Decision</span>
        </h1>
        
        <p className="mt-6 text-xl text-slate-600 max-w-3xl">
          UnderwritePro is a risk assessment AI solution built exclusively for insurance underwriters.
          Our platform boosts underwriting efficiency, accuracy, and transparency for insurers, MGAs, and reinsurers.
        </p>

        <div className="mt-10 flex gap-4">
          <Button size="lg" onClick={() => navigate('/chat')} className="px-8">Get Started</Button>
          <Button variant="outline" size="lg" className="px-8">Learn More</Button>
        </div>
      </main>
    </div>
  );
}

'use client';

import * as React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './button';
import Link from 'next/link';

export function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { label: 'Product', href: '#product' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Responsible AI', href: '#responsible-ai' },
    { label: 'Partners', href: '#partners' },
    { label: 'Resources', href: '#resources' },
  ];

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="flex flex-col p-6 space-y-6">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-slate-600 hover:text-slate-900 font-medium text-lg"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link href="/chat" passHref>
              <Button 
                size="lg" 
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

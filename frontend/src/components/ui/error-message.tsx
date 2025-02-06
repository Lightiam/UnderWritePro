'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 text-red-500">
      <AlertCircle className="h-5 w-5" />
      {message}
    </div>
  );
}

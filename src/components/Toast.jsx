import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 bg-[#081c15] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#52b788]/40 text-xs sm:text-sm font-semibold backdrop-blur-md">
        <CheckCircle2 className="w-5 h-5 text-[#52b788] shrink-0" />
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white ml-2 p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


"use client";

import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      
      <div className="relative flex flex-col items-center">
        {/* Modern Minimalist Loader */}
        <div className="relative w-20 h-20 mb-10">
          {/* Main Outer Ring */}
          <div className="absolute inset-0 border-[3px] border-slate-100 rounded-full" />
          
          {/* Animated Spinner Sections */}
          <div className="absolute inset-0 border-t-[3px] border-primary rounded-full animate-spin duration-[1.2s] shadow-[0_-4px_10px_rgba(59,130,246,0.2)]" />
          <div className="absolute inset-3 border-b-[3px] border-purple-500 rounded-full animate-spin-reverse duration-[1s]" />
          
          {/* Pulsing Core */}
          <div className="absolute inset-0 m-auto w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse" />
        </div>

        {/* Brand & Status */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight uppercase">Next</span>
            <span className="text-2xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent tracking-tight uppercase">Bazar</span>
          </div>
          
          <div className="flex items-center justify-center gap-1">
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[9px] translate-x-1">Processing</p>
            <div className="flex gap-1 ml-2">
              <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1 h-1 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="mt-12 w-48 h-1 bg-slate-50 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-purple-500 w-1/3 rounded-full animate-shimmer" />
      </div>

      {/* Modern CSS Animations */}
      <style jsx global>{`
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); width: 20%; }
          50% { transform: translateX(100%); width: 50%; }
          100% { transform: translateX(300%); width: 20%; }
        }
        .animate-spin-reverse {
          animation: spin-reverse linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}

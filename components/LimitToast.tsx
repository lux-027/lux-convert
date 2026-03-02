'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function LimitToast({ message, isVisible, onClose }: ToastProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      // Allow exit animation to complete
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-4 sm:right-4 z-[60] max-w-md sm:max-w-md">
        <div 
          className={`transform transition-all duration-300 ease-out ${
            isVisible 
              ? 'translate-x-0 opacity-100 scale-100' 
              : 'translate-x-full opacity-0 scale-95'
          }`}
        >
          <div 
            className="relative overflow-hidden rounded-2xl shadow-2xl border border-purple-200/60"
            style={{
              backdropFilter: 'blur(25px) saturate(150%)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              background: 'linear-gradient(170deg, rgba(255,255,255,0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.3), 0 8px 32px rgba(147, 51, 234, 0.15)'
            }}
          >
            {/* Gradient Accent Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 pointer-events-none" />
            
            {/* Content */}
            <div className="relative p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-xl flex items-center justify-center border border-purple-200/60">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              
              {/* Message */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 mb-1">
                  Dosya Limitine Ulaştınız
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {message}
                </p>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 flex items-center justify-center transition-colors border border-slate-200/60"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-purple-600/20">
              <div 
                className="h-full bg-purple-600 transition-all duration-5000 ease-linear"
                style={{
                  width: isVisible ? '100%' : '0%',
                  animation: isVisible ? 'shrink 5s linear forwards' : 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </>
  );
}

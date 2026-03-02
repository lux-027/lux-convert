'use client';

import React from 'react';
import { FileText } from 'lucide-react';

interface FileCounterProps {
  currentCount: number;
  maxCount: number;
}

export default function FileCounter({ currentCount, maxCount }: FileCounterProps) {
  const isNearLimit = currentCount >= maxCount * 0.8;
  const isAtLimit = currentCount >= maxCount;

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
        isAtLimit 
          ? 'bg-red-50/90 border-red-200/60 text-red-600' 
          : isNearLimit 
            ? 'bg-orange-50/90 border-orange-200/60 text-orange-600'
            : 'bg-purple-50/90 border-purple-200/60 text-purple-600'
      } border backdrop-blur-sm shadow-lg`}
    >
      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span className="font-bold hidden xs:inline">
        {currentCount} / {maxCount} Dosya
      </span>
      <span className="font-bold xs:hidden">
        {currentCount}/{maxCount}
      </span>
      {isAtLimit && (
        <span className="text-xs ml-1 opacity-75 hidden sm:inline">(Doldu)</span>
      )}
    </div>
  );
}

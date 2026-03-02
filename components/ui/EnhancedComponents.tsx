'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ type, message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={cn(
            'fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm',
            colors[type]
          )}
        >
          {icons[type]}
          <span className="text-sm font-medium text-gray-800">{message}</span>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'green' | 'blue';
}

export function ProgressBar({ 
  progress, 
  showPercentage = true, 
  size = 'md',
  color = 'purple' 
}: ProgressBarProps) {
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colors = {
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600'
  };

  return (
    <div className="w-full">
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          className={cn('h-full rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      {showPercentage && (
        <div className="mt-2 text-center text-sm font-medium text-gray-600">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}

interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
  progress?: number;
  status?: 'pending' | 'processing' | 'completed' | 'error';
}

export function FilePreview({ file, onRemove, progress = 0, status = 'pending' }: FilePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, [file]);

  const statusColors = {
    pending: 'text-gray-500',
    processing: 'text-blue-500',
    completed: 'text-green-500',
    error: 'text-red-500'
  };

  const statusIcons = {
    pending: <Upload className="w-4 h-4" />,
    processing: <Loader2 className="w-4 h-4 animate-spin" />,
    completed: <CheckCircle className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      {/* File Preview */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {preview ? (
          <img src={preview} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <Upload className="w-8 h-8 text-gray-400" />
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <span className={cn('flex items-center gap-1', statusColors[status])}>
            {statusIcons[status]}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
        </p>
        
        {/* Progress Bar */}
        {status === 'processing' && (
          <div className="mt-2">
            <ProgressBar progress={progress} size="sm" color="blue" showPercentage={false} />
          </div>
        )}
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
}

interface CloudStorageButtonProps {
  service: 'dropbox' | 'google-drive';
  onConnect: () => void;
  isConnected?: boolean;
}

export function CloudStorageButton({ service, onConnect, isConnected = false }: CloudStorageButtonProps) {
  const configs = {
    'dropbox': {
      name: 'Dropbox',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.007 0C8.618 0 5.61 2.308 4.002 5.766L0 5.766 0 18.234 4.002 18.234C5.61 21.692 8.618 24 12.007 24 17.525 24 22.014 19.511 22.014 14.002 22.014 8.493 17.525 4.002 12.007 4.002L12.007 0ZM12.007 8.004C15.313 8.004 18.01 10.701 18.01 14.002 18.01 17.303 15.313 20 12.007 20 8.696 20 5.999 17.303 5.999 14.002 5.999 10.701 8.696 8.004 12.007 8.004Z"/>
        </svg>
      ),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    'google-drive': {
      name: 'Google Drive',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 8.57h-8.32L12 12.85 8.32 8.57H0l12 15.43L24 8.57zM12 0L0 8.57h4.94l7.06-7.98 7.06 7.98H24L12 0z"/>
        </svg>
      ),
      color: 'bg-red-600 hover:bg-red-700'
    }
  };

  const config = configs[service];

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onConnect}
      disabled={isConnected}
      className={cn(
        'flex items-center gap-2 px-6 py-3 rounded-xl text-white text-lg font-semibold shadow-lg transition-all',
        isConnected ? 'bg-green-600 hover:bg-green-700' : config.color,
        isConnected && 'cursor-not-allowed'
      )}
    >
      {config.icon}
      <span>{isConnected ? `${config.name} Bağlı` : config.name}</span>
      {isConnected && <CheckCircle className="w-5 h-5" />}
    </motion.button>
  );
}

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'white' | 'gray';
}

export function LoadingSpinner({ size = 'md', color = 'purple' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colors = {
    purple: 'text-purple-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  return (
    <div className={cn('animate-spin', sizes[size], colors[color])}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

export default {
  Toast,
  ProgressBar,
  FilePreview,
  CloudStorageButton,
  AnimatedCard,
  LoadingSpinner
};

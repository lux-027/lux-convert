// Unified type definitions for the application

export interface FileFormat {
  name: string;
  extensions: string[];
  category: 'image' | 'audio' | 'document';
  mimeType?: string;
}

export interface FileState {
  id: string;
  file: File;
  targetFormat: FileFormat | null;
  status: 'pending' | 'processing' | 'converting' | 'completed' | 'error';
  quality: number;
  convertedBlob?: Blob;
  error?: string;
  downloaded?: boolean;
}

export interface FileItemProps {
  fileState: FileState;
  mode: 'convert' | 'compress' | 'music' | 'document';
  onRemove: (id: string) => void;
  onFormatChange: (id: string, format: FileFormat) => void;
  onQualityChange: (id: string, quality: number) => void;
  onDownload: (id: string) => void;
}

export type AppMode = 'convert' | 'compress' | 'music' | 'document';

// Cloud Storage Integration Utilities
import axios from 'axios';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

// Dropbox API Configuration
export const DROPBOX_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI || '',
  apiUrl: 'https://content.dropboxapi.com/2/files',
  authUrl: 'https://www.dropbox.com/oauth2/authorize'
};

// Google Drive API Configuration
export const GOOGLE_DRIVE_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || '',
  apiUrl: 'https://www.googleapis.com/drive/v3',
  scope: 'https://www.googleapis.com/auth/drive.readonly'
};

// Dropbox Integration
export class DropboxIntegration {
  static getAuthUrl() {
    const params = new URLSearchParams({
      client_id: DROPBOX_CONFIG.clientId,
      redirect_uri: DROPBOX_CONFIG.redirectUri,
      response_type: 'token',
      scope: 'files.read'
    });
    return `${DROPBOX_CONFIG.authUrl}?${params.toString()}`;
  }

  static async listFiles(accessToken: string) {
    try {
      const response = await axios.post(
        `${DROPBOX_CONFIG.apiUrl}/list_folder`,
        { path: '' },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.entries;
    } catch (error) {
      console.error('Dropbox API Error:', error);
      throw new Error('Dropbox dosyaları yüklenemedi');
    }
  }

  static async downloadFile(accessToken: string, filePath: string) {
    try {
      const response = await axios.post(
        `${DROPBOX_CONFIG.apiUrl}/download`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Dropbox-API-Arg': JSON.stringify({ path: filePath })
          },
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Dropbox Download Error:', error);
      throw new Error('Dosya indirilemedi');
    }
  }
}

// Google Drive Integration
export class GoogleDriveIntegration {
  static getAuthUrl() {
    const params = new URLSearchParams({
      client_id: GOOGLE_DRIVE_CONFIG.clientId,
      redirect_uri: GOOGLE_DRIVE_CONFIG.redirectUri,
      response_type: 'token',
      scope: GOOGLE_DRIVE_CONFIG.scope,
      include_granted_scopes: 'true'
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  static async listFiles(accessToken: string) {
    try {
      const response = await axios.get(
        `${GOOGLE_DRIVE_CONFIG.apiUrl}/files`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          params: {
            pageSize: 1000,
            fields: 'files(id,name,mimeType,size,webViewLink)'
          }
        }
      );
      return response.data.files;
    } catch (error) {
      console.error('Google Drive API Error:', error);
      throw new Error('Google Drive dosyaları yüklenemedi');
    }
  }

  static async downloadFile(accessToken: string, fileId: string) {
    try {
      const response = await axios.get(
        `${GOOGLE_DRIVE_CONFIG.apiUrl}/files/${fileId}/export`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          params: {
            mimeType: 'application/octet-stream'
          },
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Google Drive Download Error:', error);
      throw new Error('Dosya indirilemedi');
    }
  }
}

// Enhanced File Utilities
export class FileUtilities {
  static async compressFile(file: File, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Sıkıştırma başarısız'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Resim yüklenemedi'));
      img.src = URL.createObjectURL(file);
    });
  }

  static async convertFormat(file: File, targetFormat: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Dönüştürme başarısız'));
            }
          },
          targetFormat,
          0.9
        );
      };

      img.onerror = () => reject(new Error('Resim yüklenemedi'));
      img.src = URL.createObjectURL(file);
    });
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  static isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  static isAudioFile(file: File): boolean {
    return file.type.startsWith('audio/');
  }

  static async downloadMultipleFiles(files: Array<{blob: Blob, filename: string}>) {
    if (files.length === 1) {
      // Single file download
      saveAs(files[0].blob, files[0].filename);
    } else {
      // Multiple files as ZIP
      const zip = new JSZip();
      
      files.forEach(file => {
        zip.file(file.filename, file.blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'converted_files.zip');
    }
  }

  static validateFile(file: File, maxSize: number = 100 * 1024 * 1024): boolean {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'
    ];
    
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }

  static async createThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isImageFile(file)) {
        reject(new Error('Sadece resim dosyaları için küçük resim oluşturulabilir'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const maxSize = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => reject(new Error('Küçük resim oluşturulamadı'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// Progress Tracking
export class ProgressTracker {
  private static progressCallbacks: Map<string, (progress: number) => void> = new Map();

  static trackProgress(id: string, callback: (progress: number) => void) {
    this.progressCallbacks.set(id, callback);
  }

  static updateProgress(id: string, progress: number) {
    const callback = this.progressCallbacks.get(id);
    if (callback) {
      callback(progress);
    }
  }

  static removeTracking(id: string) {
    this.progressCallbacks.delete(id);
  }
}

// Error Handling
export class FileProcessingError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'FileProcessingError';
  }
}

// Supported Formats
export const SUPPORTED_FORMATS = {
  image: {
    input: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    output: ['image/jpeg', 'image/png', 'image/webp']
  },
  audio: {
    input: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac'],
    output: ['audio/mpeg', 'audio/wav', 'audio/ogg']
  }
};

export default {
  DropboxIntegration,
  GoogleDriveIntegration,
  FileUtilities,
  ProgressTracker,
  FileProcessingError,
  SUPPORTED_FORMATS
};

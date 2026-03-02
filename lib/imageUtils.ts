import imageCompression from 'browser-image-compression';

export type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/avif' | 'image/bmp' | 'image/gif';
export type AudioFormat = 'audio/mpeg' | 'audio/wav' | 'audio/ogg' | 'audio/flac';
export type FileFormat = ImageFormat | AudioFormat;

interface ProcessImageOptions {
  file: File;
  format: FileFormat;
  quality?: number; // 0 to 1
  mode: 'convert' | 'compress' | 'music';
}

export const processImage = async ({ file, format, quality = 0.8, mode }: ProcessImageOptions): Promise<Blob> => {
  if (mode === 'music') {
    // Basic placeholder for music conversion
    // Real conversion would require ffmpeg.wasm or similar
    throw new Error('Müzik dönüştürme yakında eklenecek!');
  }

  if (mode === 'compress') {
    const options = {
      maxSizeMB: quality * (file.size / (1024 * 1024)), // Target size based on quality
      maxWidthOrHeight: 4096,
      useWebWorker: true,
      initialQuality: quality,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Compression error:', error);
      throw error;
    }
  }

  // Conversion logic using Canvas for better format support
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Conversion failed'));
        },
        format,
        quality
      );
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

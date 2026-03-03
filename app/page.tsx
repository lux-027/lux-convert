'use client';

import { useState, useEffect } from 'react';
import Header, { AppMode } from '@/components/Header';
import Dropzone from '@/components/Dropzone';
import FileItem, { FileState } from '@/components/FileItem';
import FileCounter from '@/components/FileCounter';
import LimitToast from '@/components/LimitToast';
import Footer from '@/components/Footer';
import { processImage, FileFormat } from '@/lib/imageUtils';
import { Plus, Zap, Trash2, Download, UploadCloud, SlidersHorizontal, Music, Minimize2, Image as ImageIcon, ChevronDown, Search } from 'lucide-react';

export default function Home() {
  const [mode, setMode] = useState<AppMode>('convert');
  const [files, setFiles] = useState<FileState[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLimitToast, setShowLimitToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Toast event listener
  useEffect(() => {
    const handleShowLimitToast = (event: CustomEvent) => {
      setToastMessage(event.detail.message);
      setShowLimitToast(true);
    };

    window.addEventListener('show-limit-toast', handleShowLimitToast as EventListener);
    
    return () => {
      window.removeEventListener('show-limit-toast', handleShowLimitToast as EventListener);
    };
  }, []);

  // Dosya türüne göre aktif modu belirle
  const [activeType, setActiveType] = useState<'image' | 'music' | null>(null);
  
  // Global format ve kalite ayarları (tüm dosyalar için)
  const [globalFormat, setGlobalFormat] = useState<FileFormat | null>(null);
  const [globalQuality, setGlobalQuality] = useState(0.8);
  const [isGlobalDropdownOpen, setIsGlobalDropdownOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalActiveCategory, setGlobalActiveCategory] = useState(mode === 'music' ? 'Ses' : 'Görüntü');

  const handleFilesSelect = (selectedFiles: File[]) => {
    // Dosya türlerini tespit et
    const hasImages = selectedFiles.some(file => file.type.startsWith('image/'));
    const hasMusic = selectedFiles.some(file => file.type.startsWith('audio/'));
    
    // Çakışma önlemesi: Aynı anda hem fotoğraf hem müzik varsa uyarı ver
    if (hasImages && hasMusic) {
      alert('Lütfen aynı anda sadece fotoğraf veya sadece müzik dosyası yükleyin.');
      return; // İşlemi durdur
    }
    
    // Dosya limiti kontrolü - maksimum 10 dosya
    const currentFileCount = files.length;
    const maxFiles = 10;
    const remainingSlots = maxFiles - currentFileCount;
    
    if (currentFileCount >= maxFiles) {
      // Zaten limit doluysa hiçbir dosya ekleme
      return;
    }
    
    // Seçilen dosyaları limit ile sınırla
    const filesToAdd = selectedFiles.slice(0, remainingSlots);
    
    // Eğer seçilen dosya sayısı limiti aşıyorsa uyarı ver
    if (selectedFiles.length > remainingSlots) {
      // Toast bildirimini tetikle
      window.dispatchEvent(new CustomEvent('show-limit-toast', { 
        detail: { message: 'Dosya limitine ulaştınız. Eğer tamamını yüklediyseniz bu dosyaları işleyin, ardından ana sayfaya dönüp yenilerini ekleyebilirsiniz.' }
      }));
    }
    
    // Dosya türüne göre activeType'ı ayarla
    if (hasImages) {
      setActiveType('image');
      if (mode === 'music') {
        setMode('convert');
      }
    } else if (hasMusic) {
      setActiveType('music');
      if (mode !== 'music') {
        setMode('music');
      }
    }

    const newFiles: FileState[] = filesToAdd.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      targetFormat: null as unknown as FileFormat,
      status: 'pending' as const,
      quality: 0.8,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    
    // Eğer dosya sayısı tam olarak 10'a ulaştıysa toast göster
    if (files.length + filesToAdd.length >= maxFiles && files.length < maxFiles) {
      window.dispatchEvent(new CustomEvent('show-limit-toast', { 
        detail: { message: 'Dosya limitine ulaştınız. Eğer tamamını yüklediyseniz bu dosyaları işleyin, ardından ana sayfaya dönüp yenilerini ekleyebilirsiniz.' }
      }));
    }
  };

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    // Update formats for existing files when mode changes
    setFiles((prev) =>
      prev.map((f) => ({
        ...f,
        targetFormat: null as unknown as FileFormat,
        status: 'pending' as const,
      }))
    );
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const removeAllFiles = () => {
    setFiles([]);
    setActiveType(null);
    // Global formatı sıfırla
    setGlobalFormat(null);
    setGlobalQuality(0.8);
    setIsGlobalDropdownOpen(false);
    setGlobalSearchQuery('');
    setGlobalActiveCategory(mode === 'music' ? 'Ses' : 'Görüntü');
  };

  // Dosya listesi değiştiğinde aktif türü kontrol et
  useEffect(() => {
    if (files.length === 0) {
      setActiveType(null); // Tüm dosyalar silinirse kilidi kaldır
      // Global formatı sıfırla
      setGlobalFormat(null);
      setGlobalQuality(0.8);
      setIsGlobalDropdownOpen(false);
      setGlobalSearchQuery('');
      setGlobalActiveCategory(mode === 'music' ? 'Ses' : 'Görüntü');
    }
  }, [files, mode]);

  const updateFormat = (id: string, format: FileFormat) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, targetFormat: format, status: 'pending', convertedBlob: undefined, downloaded: false } : f))
    );
    // Tekli dosya formatı değiştirildiğinde global formatı sıfırla
    setGlobalFormat(null);
  };

  const updateQuality = (id: string, quality: number) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, quality, status: 'pending', convertedBlob: undefined, downloaded: false } : f))
    );
  };

  // Global format ve kalite değişikliklerini tüm dosyalara uygula
  const applyGlobalFormat = (format: FileFormat | null) => {
    setGlobalFormat(format);
    setFiles((prev) =>
      prev.map((f) => ({ ...f, targetFormat: format as unknown as FileFormat, status: 'pending', convertedBlob: undefined, downloaded: false }))
    );
  };

  const applyGlobalQuality = (quality: number) => {
    setGlobalQuality(quality);
    setFiles((prev) =>
      prev.map((f) => ({ ...f, quality, status: 'pending', convertedBlob: undefined, downloaded: false }))
    );
  };

  const convertAll = async () => {
    console.log('convertAll called', { mode, isProcessing, filesLength: files.length, filesStatus: files.map(f => ({ id: f.id, status: f.status, targetFormat: f.targetFormat })) });
    setIsProcessing(true);
    // In compression mode, process all pending files (no target format needed)
    // In other modes, only process files with target format
    const pendingFiles = mode === 'compress' 
      ? files.filter(f => f.status === 'pending')
      : files.filter(f => f.status === 'pending' && f.targetFormat);
    
    console.log('pendingFiles', pendingFiles.length);
    
    for (const fileState of pendingFiles) {
      // For compression mode, use original file format; for others use target format
      const processFormat = mode === 'compress' ? fileState.file.type as FileFormat : fileState.targetFormat;
      
      if (!processFormat) continue;
      
      setFiles(prev => prev.map(f => f.id === fileState.id ? { ...f, status: 'converting' } : f));
      
      try {
        const blob = await processImage({
          file: fileState.file,
          format: processFormat,
          quality: fileState.quality,
          mode: mode,
        });
        
        setFiles(prev => prev.map(f => f.id === fileState.id ? { 
          ...f, 
          status: 'completed', 
          convertedBlob: blob,
          // For compression mode, set target format to original format for download
          targetFormat: mode === 'compress' ? processFormat : fileState.targetFormat
        } : f));

        window.dispatchEvent(new CustomEvent('conversion-complete', { 
          detail: { size: blob.size } 
        }));
      } catch (err) {
        console.error('Conversion error:', err);
        setFiles(prev => prev.map(f => f.id === fileState.id ? { 
          ...f, 
          status: 'error', 
          error: 'İşlem başarısız' 
        } : f));
      }
    }
    setIsProcessing(false);
  };

  const downloadFile = (id: string) => {
    const fileState = files.find(f => f.id === id);
    if (!fileState?.convertedBlob || !fileState.targetFormat) return;

    const extension = fileState.targetFormat.split('/')[1] || 'file';
    const originalName = fileState.file.name.substring(0, fileState.file.name.lastIndexOf('.')) || 'download';
    const fileName = mode === 'compress' 
      ? `${originalName}_compressed.${fileState.file.name.split('.').pop()}`
      : `${originalName}_converted.${extension}`;

    const url = URL.createObjectURL(fileState.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Dosyayı indirildi olarak işaretle
    setFiles(prev => prev.map(f => f.id === id ? { ...f, downloaded: true } : f));
  };

  const hasFiles = files.length > 0;
  const allCompleted = hasFiles && files.every(f => f.status === 'completed');
  const allDownloaded = hasFiles && files.every(f => f.downloaded);
  const somePending = files.some(f => f.status === 'pending');

  return (
    <div className="min-h-screen selection:bg-purple-600 selection:text-white pb-20 relative" style={{ backgroundColor: '#F5F5F7' }}>
      {/* Animated Neon Missile Lines Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
        {/* Füze 1 - Sol üstten sağ alta çapraz */}
        <div className="absolute" style={{ top: '8%', left: '5%', width: '300px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(-35deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 6s ease-in-out infinite' }}></div>
        
        {/* Füze 2 - Sağ üstten sol alta */}
        <div className="absolute" style={{ top: '12%', right: '8%', width: '280px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(45deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 8s ease-in-out infinite', animationDelay: '2s' }}></div>
        
        {/* Füze 3 - Sol üst yatay */}
        <div className="absolute" style={{ top: '18%', left: '15%', width: '220px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(-15deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 7s ease-in-out infinite', animationDelay: '1s' }}></div>
        
        {/* Füze 4 - Orta sol dikey */}
        <div className="absolute" style={{ top: '35%', left: '3%', width: '260px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(-60deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 9s ease-in-out infinite', animationDelay: '3s' }}></div>
        
        {/* Füze 5 - Orta sağ */}
        <div className="absolute" style={{ top: '40%', right: '5%', width: '240px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(30deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 10s ease-in-out infinite', animationDelay: '4s' }}></div>
        
        {/* Füze 6 - Orta merkez */}
        <div className="absolute" style={{ top: '50%', left: '25%', width: '200px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(-20deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 11s ease-in-out infinite', animationDelay: '5s' }}></div>
        
        {/* Füze 7 - Alt sol */}
        <div className="absolute" style={{ bottom: '15%', left: '10%', width: '270px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(-45deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 8s ease-in-out infinite', animationDelay: '2.5s' }}></div>
        
        {/* Füze 8 - Alt sağ */}
        <div className="absolute" style={{ bottom: '20%', right: '12%', width: '230px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(20deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 7s ease-in-out infinite', animationDelay: '1.5s' }}></div>
        
        {/* Füze 9 - Alt merkez */}
        <div className="absolute" style={{ bottom: '25%', left: '30%', width: '250px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(-10deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 9s ease-in-out infinite', animationDelay: '3.5s' }}></div>
        
        {/* Füze 10 - Üst merkez */}
        <div className="absolute" style={{ top: '25%', left: '40%', width: '190px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(50deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 10s ease-in-out infinite', animationDelay: '4.5s' }}></div>
        
        {/* Füze 11 - Sağ orta dikey */}
        <div className="absolute" style={{ top: '55%', right: '15%', width: '210px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(-70deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 11s ease-in-out infinite', animationDelay: '5.5s' }}></div>
        
        {/* Füze 12 - Sol alt yatay */}
        <div className="absolute" style={{ bottom: '10%', left: '20%', width: '260px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(5deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 6s ease-in-out infinite', animationDelay: '0.5s' }}></div>
      </div>
      <div className="relative" style={{ zIndex: 1 }}>
        <Header mode={mode} onModeChange={handleModeChange} activeType={activeType} />
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 flex flex-col items-center relative overflow-x-hidden" style={{ zIndex: 1 }}>
        <div className="text-center mb-8 sm:mb-16 space-y-4 sm:space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 blur-3xl opacity-20"></div>
            <h2 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-2 sm:mb-4 px-4">
              {mode === 'convert' ? 'Dosya Çevirici' : mode === 'compress' ? 'Dosya Sıkıştırıcı' : 'Müzik Dönüştürücü'}
            </h2>
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed px-4">
            {mode === 'convert' 
              ? 'Dosyalarınızı istediğiniz biçime dönüştürün' 
              : mode === 'compress'
                ? 'Dosyalarınızı boyutunu kaliteden ödün vermeden düşürün'
                : 'Müzik dosyalarınızı hızlıca çevirin'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-6 sm:mt-8 px-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Her zaman aktif</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Güvenli bağlantı</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Yüksek hız</span>
            </div>
          </div>
        </div>

        {!hasFiles ? (
          <div className="w-full max-w-5xl overflow-x-hidden px-4 sm:px-6">
            {/* Main Upload Card */}
            <div className="relative glass-droplet rounded-[3rem] shadow-3xl border border-white/20 overflow-hidden">
              {/* Gradient Background Accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/40 via-slate-900/20 to-purple-950/30"></div>
              
              {/* Upload Area */}
              <div className="relative p-6 sm:p-12">
                <div className="glass-droplet-inner rounded-[2.5rem] p-8 sm:p-20 text-center border border-white/30 shadow-2xl">
                  <Dropzone onFilesSelect={handleFilesSelect} mode={mode} />
                </div>
              </div>
              
              {/* Features Section */}
              <div className="relative glass-droplet-footer p-6 sm:p-8 border-t border-white/20">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-16 text-white">
                  <div className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">HIZLI</div>
                      <div className="text-xs text-white/80">Anında işlem</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">GÜVENLİ</div>
                      <div className="text-xs text-white/80">Gizlilik korumalı</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <div className="w-6 h-6 flex items-center justify-center text-xs font-bold">ÜC</div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">ÜCRETSİZ</div>
                      <div className="text-xs text-white/80">Sınırsız kullanım</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
              <div className="purple-themed-card rounded-2xl p-6 text-center group hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/25 transition-colors border border-white/30 shadow-xl">
                  <UploadCloud className="w-7 h-7 text-white" />
                </div>
                <div className="font-bold text-white">Dosya Seç</div>
                <div className="text-sm text-white/85 mt-1">Sürükleyin veya tıklayın</div>
              </div>
              
              <div className="purple-themed-card rounded-2xl p-6 text-center group hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/25 transition-colors border border-white/30 shadow-xl">
                  <SlidersHorizontal className="w-7 h-7 text-white" />
                </div>
                <div className="font-bold text-white">Biçim Seç</div>
                <div className="text-sm text-white/85 mt-1">Hedef formatı belirleyin</div>
              </div>
              
              <div className="purple-themed-card rounded-2xl p-6 text-center group hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/25 transition-colors border border-white/30 shadow-xl">
                  <Download className="w-7 h-7 text-white" />
                </div>
                <div className="font-bold text-white">İndir</div>
                <div className="text-sm text-white/85 mt-1">Anında indirin</div>
              </div>
            </div>
            
            {/* Features Information Section */}
            <div className="mt-16 glass-droplet glass-reflect-panel rounded-[3rem] shadow-3xl border border-white/20 overflow-hidden">
              <div className="p-12">
                <h3 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-8 sm:mb-12">Neden Bizi Tercih Etmelisiniz?</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  <div className="text-center group">
                    <div className="w-20 h-20 glass-droplet-icon rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl border border-white/30">
                      <span className="text-3xl font-bold text-white">300+</span>
                    </div>
                    <div className="font-semibold text-slate-900 text-lg">Desteklenen Formatlar</div>
                    <div className="text-sm text-slate-600 mt-2">Geniş format desteği ile tüm dosya türlerinizi dönüştürün</div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 glass-droplet-icon-green rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl border border-white/30">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <div className="font-semibold text-slate-900 text-lg">Hızlı ve Kolay</div>
                    <div className="text-sm text-slate-600 mt-2">Saniyeler içinde dosyalarınızı dönüştürün</div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 glass-droplet-icon-blue rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl border border-white/30">
                      <div className="w-10 h-10 border-4 border-white rounded-full"></div>
                    </div>
                    <div className="font-semibold text-slate-900 text-lg">Bulut Tabanlı</div>
                    <div className="text-sm text-slate-600 mt-2">Her yerden erişim, hiçbir kurulum gerekmez</div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 glass-droplet-icon-orange rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl border border-white/30">
                      <div className="w-8 h-8 bg-white rounded-sm"></div>
                    </div>
                    <div className="font-semibold text-slate-900 text-lg">Özelleştirilmiş Ayarlar</div>
                    <div className="text-sm text-slate-600 mt-2">Kalite, boyut ve format ayarlarını kişiselleştirin</div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 glass-droplet-icon-pink rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl border border-white/30">
                      <div className="w-10 h-10 flex items-center justify-center text-white font-bold">🔒</div>
                    </div>
                    <div className="font-semibold text-slate-900 text-lg">Güvenlik Garantisi</div>
                    <div className="text-sm text-slate-600 mt-2">Dosyalarınız şifrelenmiş ve güvende</div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 glass-droplet-icon-indigo rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl border border-white/30">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-gray-800 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="font-semibold text-slate-900 text-lg">Tüm Cihazlarda Destek</div>
                    <div className="text-sm text-slate-600 mt-2">Masaüstü, mobil ve tablet uyumlu</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl overflow-x-hidden px-4 sm:px-6">
            {/* Main Glassmorphism Container */}
            <div className="rounded-[24px] overflow-visible" style={{ backdropFilter: 'blur(35px) saturate(150%)', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid #8a2be2', boxShadow: '0 0 20px rgba(138, 43, 226, 0.3), 0 8px 32px rgba(138, 43, 226, 0.15)' }}>
              {/* Global Controls */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-6">
                {mode === 'compress' ? (
                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex items-center gap-3">
                      <Minimize2 className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-slate-700">Tüm Dosyalar İçin Kalite:</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-500 px-3 py-1.5 rounded-lg">
                      <span className="text-sm font-semibold text-white">{Math.round(globalQuality * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => applyGlobalQuality(Math.max(0.1, globalQuality - 0.1))}
                        disabled={globalQuality <= 0.1}
                        className="px-3 py-1.5 text-white rounded-lg font-medium text-xs transition-all disabled:cursor-not-allowed disabled:opacity-60"
                        style={{
                          backdropFilter: 'blur(25px)',
                          backgroundColor: globalQuality <= 0.1 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.5)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                          background: `linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), ${globalQuality <= 0.1 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.5)'}`
                        }}
                      >
                        -10%
                      </button>
                      <button
                        onClick={() => applyGlobalQuality(Math.min(1, globalQuality + 0.1))}
                        disabled={globalQuality >= 1}
                        className="px-3 py-1.5 text-white rounded-lg font-medium text-xs transition-all disabled:cursor-not-allowed disabled:opacity-60"
                        style={{
                          backdropFilter: 'blur(25px)',
                          backgroundColor: globalQuality >= 1 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(16, 185, 129, 0.5)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                          background: `linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), ${globalQuality >= 1 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(16, 185, 129, 0.5)'}`
                        }}
                      >
                        +10%
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 flex-1 relative">
                    <span className="text-sm font-medium text-slate-700">Tüm Dosyalar İçin Format:</span>
                    <button
                      onClick={() => setIsGlobalDropdownOpen(!isGlobalDropdownOpen)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all min-w-[160px] justify-between"
                      style={{
                        backdropFilter: 'blur(25px)',
                        backgroundColor: isGlobalDropdownOpen ? 'rgba(147, 51, 234, 0.15)' : !globalFormat ? 'rgba(251, 146, 60, 0.12)' : 'rgba(255, 255, 255, 0.08)',
                        border: `1px solid ${isGlobalDropdownOpen ? 'rgba(147, 51, 234, 0.3)' : !globalFormat ? 'rgba(251, 146, 60, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                        background: `linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), ${isGlobalDropdownOpen ? 'rgba(147, 51, 234, 0.15)' : !globalFormat ? 'rgba(251, 146, 60, 0.12)' : 'rgba(255, 255, 255, 0.08)'}`,
                        color: isGlobalDropdownOpen ? '#9333ea' : !globalFormat ? '#ea580c' : '#1e293b'
                      }}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className={!globalFormat ? 'text-gray-600' : 'text-slate-900'}>
                          {globalFormat ? globalFormat.split('/')[1]?.toUpperCase().replace('MPEG', 'MP3').replace('X-', '').replace('JPEG', 'JPG') : 'Format'}
                        </span>
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isGlobalDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isGlobalDropdownOpen && (
                      <>
                        <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={() => setIsGlobalDropdownOpen(false)} />
                        <div className="absolute top-full left-0 mt-3 w-screen max-w-[560px] text-white rounded-3xl overflow-visible animate-in fade-in zoom-in-95 duration-200" style={{ zIndex: 99999, backdropFilter: 'blur(25px)', backgroundColor: 'rgba(26, 26, 26, 0.85)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)', background: 'linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), rgba(26, 26, 26, 0.85)' }}>
                          <div className="p-5 border-b border-white/5 bg-black/20">
                            <div className="relative">
                              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                              <input
                                autoFocus
                                type="text"
                                placeholder="Format ara..."
                                className="w-full bg-transparent border-none py-3 pl-14 pr-5 text-sm outline-none placeholder-gray-500"
                                value={globalSearchQuery}
                                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="flex h-96">
                            <div className="w-[160px] border-r border-white/5 py-3 overflow-y-auto bg-black/40">
                              {[
                                { name: 'Görüntü', active: mode !== 'music' },
                                { name: 'Ses', active: mode === 'music' },
                              ].map((cat) => (
                                <button
                                  key={cat.name}
                                  onClick={() => setGlobalActiveCategory(cat.name)}
                                  disabled={!cat.active}
                                  className={`w-full text-left px-5 py-3 text-xs font-light uppercase tracking-widest transition-all ${!cat.active ? 'text-gray-700 cursor-not-allowed' : globalActiveCategory === cat.name ? 'text-white bg-white/10 border-l-2 border-purple-500' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                                >
                                  {cat.name}
                                </button>
                              ))}
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto bg-black/20">
                              <div className="grid grid-cols-3 gap-3">
                                {[
                                  ...(mode === 'music' ? [
                                    { label: 'MP3', value: 'audio/mpeg' as FileFormat },
                                    { label: 'WAV', value: 'audio/wav' as FileFormat },
                                    { label: 'OGG', value: 'audio/ogg' as FileFormat },
                                    { label: 'FLAC', value: 'audio/flac' as FileFormat },
                                    { label: 'AAC', value: 'audio/aac' as FileFormat },
                                    { label: 'M4A', value: 'audio/x-m4a' as FileFormat },
                                    { label: 'AIFF', value: 'audio/x-aiff' as FileFormat },
                                  ] : [
                                    { label: 'PNG', value: 'image/png' as FileFormat },
                                    { label: 'SVG', value: 'image/svg+xml' as FileFormat },
                                    { label: 'ICO', value: 'image/x-icon' as FileFormat },
                                    { label: 'JPG', value: 'image/jpg' as FileFormat },
                                    { label: 'WEBP', value: 'image/webp' as FileFormat },
                                    { label: 'JPEG', value: 'image/jpeg' as FileFormat },
                                    { label: 'DDS', value: 'image/vnd-ms.dds' as FileFormat },
                                    { label: 'GIF', value: 'image/gif' as FileFormat },
                                    { label: 'CUR', value: 'image/x-icon' as FileFormat },
                                    { label: 'BMP', value: 'image/bmp' as FileFormat },
                                    { label: 'HDR', value: 'image/vnd.radiance' as FileFormat },
                                    { label: 'PSD', value: 'image/vnd.adobe.photoshop' as FileFormat },
                                    { label: 'TIFF', value: 'image/tiff' as FileFormat },
                                    { label: 'TGA', value: 'image/x-tga' as FileFormat },
                                    { label: 'AVIF', value: 'image/avif' as FileFormat },
                                    { label: 'RGB', value: 'image/x-rgb' as FileFormat },
                                  ])
                                ].filter(f => f.label.toLowerCase().includes(globalSearchQuery.toLowerCase())).map((f) => (
                                  <button
                                    key={f.label}
                                    onClick={() => {
                                      applyGlobalFormat(f.value);
                                      setIsGlobalDropdownOpen(false);
                                    }}
                                    className="py-4 rounded-xl text-xs font-bold transition-all text-white"
                                    style={{
                                      backdropFilter: 'blur(25px)',
                                      backgroundColor: globalFormat === f.value ? 'rgba(147, 51, 234, 0.6)' : 'rgba(255, 255, 255, 0.08)',
                                      border: `1px solid ${globalFormat === f.value ? 'rgba(147, 51, 234, 0.8)' : 'rgba(255, 255, 255, 0.2)'}`,
                                      boxShadow: globalFormat === f.value ? '0 4px 16px rgba(147, 51, 234, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.15)',
                                      background: `linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), ${globalFormat === f.value ? 'rgba(147, 51, 234, 0.6)' : 'rgba(255, 255, 255, 0.08)'}`
                                    }}
                                  >
                                    {f.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                </div>
              </div>

              {/* Separator Line */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '0 24px' }}></div>

              {/* Files List Header with Counter */}
              <div className="p-6 pb-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-900">Dosya Listesi</h3>
                  <FileCounter currentCount={files.length} maxCount={10} />
                </div>
              </div>

              {/* Files List */}
              <div className="divide-y divide-white/10 px-6">
                {files.map((fileState) => (
                  <FileItem
                    key={fileState.id}
                    fileState={fileState}
                    mode={mode}
                    onRemove={removeFile}
                    onFormatChange={updateFormat}
                    onQualityChange={updateQuality}
                    onDownload={downloadFile}
                  />
                ))}
              </div>

              {/* Bottom Action Bar */}
              <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 border-t border-white/10">
                <div className="flex flex-col gap-4 w-full">
                  <label className={`flex items-center gap-3 font-bold cursor-pointer transition-all hover:scale-105 px-4 sm:px-6 py-4 sm:py-3 rounded-2xl ${
                    files.length >= 10 
                      ? 'text-gray-400 cursor-not-allowed opacity-60' 
                      : 'text-white hover:scale-105'
                  } w-full justify-center min-h-[56px] sm:min-h-[48px]`} style={{ 
                    backdropFilter: 'blur(25px)', 
                    backgroundColor: files.length >= 10 ? 'rgba(148, 163, 184, 0.5)' : 'rgba(147, 51, 234, 0.85)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)', 
                    boxShadow: files.length >= 10 ? '0 4px 16px rgba(0, 0, 0, 0.15)' : '0 8px 24px rgba(147, 51, 234, 0.3)', 
                    background: `linear-gradient(170deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), ${files.length >= 10 ? 'rgba(148, 163, 184, 0.5)' : 'rgba(147, 51, 234, 0.85)'}`, 
                    textShadow: files.length >= 10 ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.3)' 
                  }}>
                    <Plus className="w-5 h-5" />
                    DAHA FAZLA EKLE
                    <input
                      type="file"
                      multiple
                      accept={mode === 'music' ? 'audio/*' : 'image/*'}
                      className="hidden"
                      disabled={files.length >= 10}
                      onChange={(e) => e.target.files && handleFilesSelect(Array.from(e.target.files))}
                    />
                  </label>
                  <button
                    onClick={removeAllFiles}
                    className="flex items-center gap-3 text-white font-bold transition-all hover:scale-105 px-4 sm:px-6 py-4 sm:py-3 rounded-2xl w-full justify-center min-h-[56px] sm:min-h-[48px]"
                    style={{ backdropFilter: 'blur(25px)', backgroundColor: 'rgba(220, 38, 38, 0.85)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 8px 24px rgba(220, 38, 38, 0.3)', background: 'linear-gradient(170deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), rgba(220, 38, 38, 0.85)', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
                  >
                    <Trash2 className="w-5 h-5" />
                    TÜMÜNÜ SİL
                  </button>
                </div>

                <div className="flex flex-col gap-4 w-full">
                  {allCompleted && (
                    <button
                      onClick={() => files.forEach(f => !f.downloaded && downloadFile(f.id))}
                      disabled={allDownloaded}
                      className="px-6 sm:px-8 py-4 sm:py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-white disabled:cursor-not-allowed disabled:opacity-60 w-full min-h-[56px] sm:min-h-[48px]"
                      style={{
                        backdropFilter: 'blur(25px)',
                        backgroundColor: allDownloaded ? 'rgba(148, 163, 184, 0.3)' : 'rgba(147, 51, 234, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: allDownloaded ? '0 4px 16px rgba(0, 0, 0, 0.15)' : '0 8px 24px rgba(147, 51, 234, 0.3)',
                        background: `linear-gradient(170deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), ${allDownloaded ? 'rgba(148, 163, 184, 0.3)' : 'rgba(147, 51, 234, 0.85)'}`,
                        textShadow: allDownloaded ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <Download className="w-5 h-5" /> {allDownloaded ? 'TÜMÜ İNDİRİLDİ' : 'TÜMÜNÜ İNDİR'}
                    </button>
                  )}
                  {somePending && (
                    <button
                      onClick={() => {
                        console.log('Button clicked', { mode, isProcessing, somePending, filesLength: files.length, hasPendingFiles: files.some(f => f.status === 'pending') });
                        convertAll();
                      }}
                      disabled={isProcessing || (mode === 'compress' ? !files.some(f => f.status === 'pending') : !files.some(f => f.status === 'pending' && f.targetFormat))}
                      className="text-white px-6 sm:px-8 lg:px-10 py-4 sm:py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed w-full min-h-[56px] sm:min-h-[48px] active:scale-95"
                      style={{
                        backdropFilter: 'blur(25px)',
                        backgroundColor: (isProcessing || (mode === 'compress' ? !files.some(f => f.status === 'pending') : !files.some(f => f.status === 'pending' && f.targetFormat))) ? 'rgba(148, 163, 184, 0.7)' : 'rgba(147, 51, 234, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: (isProcessing || (mode === 'compress' ? !files.some(f => f.status === 'pending') : !files.some(f => f.status === 'pending' && f.targetFormat))) ? '0 4px 16px rgba(0, 0, 0, 0.15)' : '0 8px 24px rgba(147, 51, 234, 0.3)',
                        background: `linear-gradient(170deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), ${(isProcessing || (mode === 'compress' ? !files.some(f => f.status === 'pending') : !files.some(f => f.status === 'pending' && f.targetFormat))) ? 'rgba(148, 163, 184, 0.7)' : 'rgba(147, 51, 234, 0.85)'}`,
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                        opacity: (isProcessing || (mode === 'compress' ? !files.some(f => f.status === 'pending') : !files.some(f => f.status === 'pending' && f.targetFormat))) ? 0.8 : 1
                      }}
                    >
                      {isProcessing ? 'İŞLENİYOR...' : 'ŞİMDİ DÖNÜŞTÜR'}
                      {/* Debug info - remove in production */}
                      {process.env.NODE_ENV === 'development' && (
                        <span className="text-xs ml-2 opacity-75">
                          ({mode === 'compress' ? `${files.filter(f => f.status === 'pending').length} pending` : `${files.filter(f => f.status === 'pending' && f.targetFormat).length} ready`})
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      
      {/* Limit Toast Notification */}
      <LimitToast
        message={toastMessage}
        isVisible={showLimitToast}
        onClose={() => setShowLimitToast(false)}
      />
    </div>
  );
}
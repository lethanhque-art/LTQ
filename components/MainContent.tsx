import React, { useRef } from 'react';
import { Spinner } from './Spinner';

interface MainContentProps {
  originalImage: string | null;
  processedImage: string | null;
  isLoading: boolean;
  error: string | null;
  onImageUpload: (file: File) => void;
  animatedVideoUrl: string | null;
  onAnimatedVideoClose: () => void;
  isPostProcessing: boolean;
  postProcessingError: string | null;
  onAnimate360: () => void;
  onUpscaleToRes: (resolution: '4K' | '8K' | '16K') => void;
}

const UploadPlaceholder: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div 
    className="w-full h-full border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-center text-slate-400 cursor-pointer hover:border-blue-500 hover:text-blue-400 transition-colors"
    onClick={onClick}
    >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h1.586A2 2 0 0114 5.414l4.828 4.828a2 2 0 01.586 1.414V16a4 4 0 01-4 4H7z" /></svg>
    <p className="font-semibold">Click to upload an image</p>
    <p className="text-xs mt-1">PNG, JPG, WEBP, etc.</p>
  </div>
);

const ImageComparator: React.FC<{ original: string; processed: string }> = ({ original, processed }) => {
    const [sliderPosition, setSliderPosition] = React.useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            const percent = (x / rect.width) * 100;
            setSliderPosition(percent);
        }
    };
    
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
            const percent = (x / rect.width) * 100;
            setSliderPosition(percent);
        }
    };
    
    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove as any);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        window.addEventListener('mousemove', handleMouseMove as any);
        window.addEventListener('mouseup', handleMouseUp);
    };
    
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const touchEnd = () => {
            window.removeEventListener('touchmove', handleTouchMove as any);
            window.removeEventListener('touchend', touchEnd);
        }
        window.addEventListener('touchmove', handleTouchMove as any);
        window.addEventListener('touchend', touchEnd);
    };


    return (
        <div 
            ref={containerRef}
            className="relative w-full h-full select-none overflow-hidden rounded-lg group"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <img src={original} alt="Original" className="absolute inset-0 w-full h-full object-contain" />
            <div 
                className="absolute inset-0 w-full h-full overflow-hidden" 
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img src={processed} alt="Processed" className="absolute inset-0 w-full h-full object-contain" />
            </div>
            <div 
                className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 bg-white/80 rounded-full border-2 border-white flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:opacity-100 opacity-0 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
            </div>
        </div>
    );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void; disabled?: boolean; }> = ({ icon, label, onClick, disabled }) => (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-blue-600 transition-colors disabled:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white"
    >
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </button>
);


export const MainContent: React.FC<MainContentProps> = ({
  originalImage,
  processedImage,
  isLoading,
  error,
  onImageUpload,
  animatedVideoUrl,
  onAnimatedVideoClose,
  isPostProcessing,
  postProcessingError,
  onAnimate360,
  onUpscaleToRes,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlaceholderClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    // Reset the input value to allow re-uploading the same file
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'processed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const MainView: React.FC = () => {
    if (animatedVideoUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <video src={animatedVideoUrl} controls autoPlay loop className="max-w-full max-h-[85%] object-contain rounded-md" />
          <button onClick={onAnimatedVideoClose} className="bg-slate-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors">
            Back to Image
          </button>
        </div>
      );
    }

    if (isLoading) return <Spinner />;
    if (error) return <div className="text-red-400 text-center">{error}</div>;

    if (originalImage && processedImage) {
      return <ImageComparator original={originalImage} processed={processedImage} />;
    }

    if (originalImage) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
            <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain rounded-md" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/50 px-3 py-1 rounded-full text-xs">
                Ảnh gốc
            </div>
        </div>
      );
    }

    return <UploadPlaceholder onClick={handlePlaceholderClick} />;
  };

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 bg-slate-900 overflow-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="flex-1 bg-slate-800/50 rounded-lg flex items-center justify-center p-4 relative min-h-0">
          {isPostProcessing && <Spinner />}
          {postProcessingError && !isPostProcessing && <div className="absolute text-red-400 text-center z-20 bg-slate-900/80 p-4 rounded-lg">{postProcessingError}</div>}
          
          <MainView />
      </div>

      {processedImage && !animatedVideoUrl && (
        <div className="grid grid-cols-5 gap-4">
           <ActionButton 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a.75.75 0 01.75.75v1.512c4.113.243 7.25 3.23 7.25 6.738 0 3.32-2.508 6.22-5.75 6.737v-1.512a.75.75 0 01-1.5 0v-1.512c-4.113-.243-7.25-3.23-7.25-6.737 0-3.32 2.508 6.22 5.75-6.738V4.25A.75.75 0 0110 3.5z" /></svg>}
              label="Tạo ảnh động 360°"
              onClick={onAnimate360}
              disabled={isPostProcessing}
           />
           <ActionButton
              icon={<span className="font-bold text-sm">4K</span>}
              label="Nâng cấp 4K"
              onClick={() => onUpscaleToRes('4K')}
              disabled={isPostProcessing}
           />
           <ActionButton
              icon={<span className="font-bold text-sm">8K</span>}
              label="Nâng cấp 8K"
              onClick={() => onUpscaleToRes('8K')}
              disabled={isPostProcessing}
           />
           <ActionButton
              icon={<span className="font-bold text-sm">16K</span>}
              label="Nâng cấp 16K"
              onClick={() => onUpscaleToRes('16K')}
              disabled={isPostProcessing}
           />
           <ActionButton
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
              label="Tải xuống"
              onClick={handleDownload}
              disabled={isPostProcessing}
           />
        </div>
      )}
    </div>
  );
};
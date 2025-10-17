

import React, { useRef, useState, useEffect } from 'react';
import { Spinner } from './Spinner';
import * as types from '../types';

interface MainContentProps {
  originalImages: types.ImageFile[];
  processedImages: Record<string, string>;
  processingStatus: Record<string, types.ProcessingStatus>;
  isLoading: boolean;
  error: string | null;
  onImageUpload: (files: FileList) => void;
  animatedVideoUrl: string | null;
  onAnimatedVideoClose: () => void;
  isPostProcessing: boolean;
  postProcessingError: string | null;
  onAnimate360: () => void;
  onUpscaleToRes: (resolution: '4K' | '8K' | '16K') => void;
  onOpenWatermarkModal: () => void;
  isBatchMode: boolean;
  activeTool: string;
  portraitImages: types.PortraitImage[];
  facePlacements: types.FacePlacement[];
  onFacePlacementsChange: (placements: types.FacePlacement[]) => void;
}

const UploadPlaceholder: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div 
    className="w-full h-full border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-center text-slate-400 cursor-pointer hover:border-blue-500 hover:text-blue-400 transition-colors"
    onClick={onClick}
    >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h1.586A2 2 0 0114 5.414l4.828 4.828a2 2 0 01.586 1.414V16a4 4 0 01-4 4H7z" /></svg>
    <p className="font-semibold">Click to upload image(s)</p>
    <p className="text-xs mt-1">PNG, JPG, WEBP, etc. Select multiple files for batch mode.</p>
  </div>
);

const ImageComparator: React.FC<{ original: string; processed: string }> = ({ original, processed }) => { /* ... existing unchanged comparator component ... */ };

const InteractiveCanvas: React.FC<{
  mainImage: types.ImageFile;
  portraits: types.PortraitImage[];
  placements: types.FacePlacement[];
  onPlacementsChange: (placements: types.FacePlacement[]) => void;
}> = ({ mainImage, portraits, placements, onPlacementsChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const portraitId = e.dataTransfer.getData('text/plain');
        if (!portraitId || !containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newPlacement: types.FacePlacement = {
            id: crypto.randomUUID(),
            portraitId,
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
            width: 15, // default width 15%
            height: 15,
        };
        onPlacementsChange([...placements, newPlacement]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    
    // In a real app, this would have complex logic for drag/resize of placements
    // For this example, we'll just show the placed items.
    
    return (
        <div 
            ref={containerRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full h-full relative"
        >
            <img src={mainImage.base64} alt="Original" className="w-full h-full object-contain pointer-events-none" />
            {placements.map(p => {
                const portrait = portraits.find(pr => pr.id === p.portraitId);
                if (!portrait) return null;
                return (
                    <div 
                        key={p.id}
                        className="absolute border-2 border-dashed border-blue-400 bg-white/20 cursor-move"
                        style={{
                            left: `calc(${p.x}% - (${p.width}% / 2))`,
                            top: `calc(${p.y}% - (${p.height}% / 2))`,
                            width: `${p.width}%`,
                            height: `${p.height}%`,
                        }}
                    >
                       <img src={portrait.base64} className="w-full h-full object-cover opacity-80" alt="Placed Portrait" />
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-2 py-0.5 text-xs rounded-full">
                           {placements.indexOf(p) + 1}
                       </div>
                    </div>
                );
            })}
        </div>
    );
};


export const MainContent: React.FC<MainContentProps> = ({
  originalImages,
  processedImages,
  processingStatus,
  isLoading,
  error,
  onImageUpload,
  animatedVideoUrl,
  onAnimatedVideoClose,
  isPostProcessing,
  postProcessingError,
  onAnimate360,
  onUpscaleToRes,
  onOpenWatermarkModal,
  isBatchMode,
  activeTool,
  portraitImages,
  facePlacements,
  onFacePlacementsChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlaceholderClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) onImageUpload(event.target.files);
    if (event.target) event.target.value = '';
  };

  const handleDownload = (imageId: string) => {
    const url = processedImages[imageId];
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    const original = originalImages.find(img => img.id === imageId);
    link.download = `processed-${original?.file.name || 'image.png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadZip = async () => {
    // @ts-ignore
    if (typeof JSZip === 'undefined') {
        alert('Could not create ZIP file. JSZip library not found.');
        return;
    }
    // @ts-ignore
    const zip = new JSZip();
    const processedEntries = Object.entries(processedImages);
    if (processedEntries.length === 0) return;

    for (const [id, dataUrl] of processedEntries) {
        const original = originalImages.find(img => img.id === id);
        if (original && processingStatus[id] === 'done') {
            // Fix: Directly process the data URL instead of fetching it.
            // This is more efficient and avoids potential issues with fetch on data URLs.
            const base64Data = dataUrl.split(',')[1];
            zip.file(`processed_${original.file.name}`, base64Data, { base64: true });
        }
    }
    const zipContent = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipContent as Blob);
    link.download = 'processed_images.zip';
    link.click();
  };

  const MainView: React.FC = () => {
    if (isLoading && !isBatchMode) return <Spinner />; // Global spinner for single image
    if (error) return <div className="text-red-400 text-center">{error}</div>;

    if (isBatchMode) {
      return (
        <div className="w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto p-2">
          {originalImages.map(img => (
            <div key={img.id} className="relative aspect-square bg-slate-700/50 rounded-md overflow-hidden">
                <img src={processedImages[img.id] || img.base64} alt={img.file.name} className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    {processingStatus[img.id] === 'processing' && <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    {processingStatus[img.id] === 'done' && <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                    {processingStatus[img.id] === 'error' && <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
                </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Single Image Mode
    const originalImage = originalImages[0];
    if (!originalImage) return <UploadPlaceholder onClick={handlePlaceholderClick} />;
    
    const processedImage = processedImages[originalImage.id];

    if (animatedVideoUrl) { /* ... existing video view ... */ }
    
    if (activeTool === 'Phục chế ảnh cũ' && portraitImages.length > 0) {
        return <InteractiveCanvas mainImage={originalImage} portraits={portraitImages} placements={facePlacements} onPlacementsChange={onFacePlacementsChange} />
    }

    if (originalImage && processedImage) return <ImageComparator original={originalImage.base64} processed={processedImage} />;
    if (originalImage) return <img src={originalImage.base64} alt="Original" className="max-w-full max-h-full object-contain rounded-md" />;

    return <UploadPlaceholder onClick={handlePlaceholderClick} />;
  };

  const hasProcessedFiles = Object.values(processingStatus).some(s => s === 'done');

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 bg-slate-900 overflow-auto">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
      <div className="flex-1 bg-slate-800/50 rounded-lg flex items-center justify-center p-4 relative min-h-0">
          {isPostProcessing && <Spinner />}
          {postProcessingError && !isPostProcessing && <div className="absolute text-red-400 text-center z-20 bg-slate-900/80 p-4 rounded-lg">{postProcessingError}</div>}
          <MainView />
      </div>

      {!isBatchMode && processedImages[originalImages[0]?.id] && !animatedVideoUrl && (
        <div className="grid grid-cols-6 gap-4">
           {/* ... existing action buttons ... */}
           <button onClick={() => handleDownload(originalImages[0].id)}>Download</button>
        </div>
      )}
      {isBatchMode && hasProcessedFiles && (
        <div className="flex justify-center">
            <button
                onClick={handleDownloadZip}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-slate-800 disabled:opacity-60 text-white font-semibold"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                Tải tất cả (.zip)
            </button>
        </div>
      )}
    </div>
  );
};
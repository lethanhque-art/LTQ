


import React, { useRef, useState, useEffect } from 'react';
import { Spinner } from './Spinner';
import * as types from '../types';

interface MainContentProps {
  originalImages: types.ImageFile[];
  processedImages: Record<string, string>;
  processingStatus: Record<string, types.ProcessingStatus>;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
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
    onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const input = document.createElement('input');
            input.type = 'file';
            input.files = e.dataTransfer.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }}
    onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
    }}
    >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h1.586A2 2 0 0114 5.414l4.828 4.828a2 2 0 01.586 1.414V16a4 4 0 01-4 4H7z" /></svg>
    <p className="font-semibold">Click or drop image(s) here</p>
    <p className="text-xs mt-1">PNG, JPG, WEBP, etc. Select multiple files for batch mode.</p>
  </div>
);

const ImageComparator: React.FC<{ original: string; processed: string }> = ({ original, processed }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  
  const handleMove = (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let newX = clientX - rect.left;
      let percent = (newX / rect.width) * 100;
      percent = Math.max(0, Math.min(100, percent));
      setSliderPos(percent);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      isDragging.current = true;
      handleMove(e.clientX);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
      isDragging.current = true;
      handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e: MouseEvent) => { if (isDragging.current) handleMove(e.clientX); };
    const handleTouchEnd = () => { isDragging.current = false; };
    const handleTouchMove = (e: TouchEvent) => { if (isDragging.current) handleMove(e.touches[0].clientX); };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
      <div 
          ref={containerRef}
          className="relative w-full h-full select-none cursor-ew-resize overflow-hidden rounded-md"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
      >
          <img src={original} alt="Original" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
          <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}>
              <img src={processed} alt="Processed" className="absolute inset-0 w-full h-full object-contain" />
          </div>
          <div className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm pointer-events-none" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
             <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
             </div>
          </div>
      </div>
  );
};

const InteractiveCanvas: React.FC<{
  mainImage: types.ImageFile;
  portraits: types.PortraitImage[];
  placements: types.FacePlacement[];
  onPlacementsChange: (placements: types.FacePlacement[]) => void;
}> = ({ mainImage, portraits, placements, onPlacementsChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(null);
    const [interaction, setInteraction] = useState<{ type: 'move' | 'resize' | 'rotate'; placementId: string; startX: number; startY: number; } | null>(null);
    
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
            width: 15,
            height: 15,
            rotation: 0,
        };
        onPlacementsChange([...placements, newPlacement]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    
    const handleDelete = (idToDelete: string) => {
        onPlacementsChange(placements.filter(p => p.id !== idToDelete));
        setSelectedPlacementId(null);
    };
    
    const handleMouseDown = (e: React.MouseEvent, placementId: string, type: 'move' | 'resize' | 'rotate') => {
        e.stopPropagation();
        setSelectedPlacementId(placementId);
        setInteraction({ type, placementId, startX: e.clientX, startY: e.clientY });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!interaction || !containerRef.current) return;
            
            const rect = containerRef.current.getBoundingClientRect();
            const placement = placements.find(p => p.id === interaction.placementId);
            if (!placement) return;

            let newPlacements = [...placements];
            const index = newPlacements.findIndex(p => p.id === interaction.placementId);

            if (interaction.type === 'move') {
                const dx = (e.clientX - interaction.startX) / rect.width * 100;
                const dy = (e.clientY - interaction.startY) / rect.height * 100;
                newPlacements[index] = { ...placement, x: placement.x + dx, y: placement.y + dy };
            } else if (interaction.type === 'resize') {
                 const dx = (e.clientX - interaction.startX) / rect.width * 100;
                 const dy = (e.clientY - interaction.startY) / rect.height * 100;
                 // A simple resize logic, could be improved to maintain aspect ratio
                 newPlacements[index] = { ...placement, width: Math.max(5, placement.width + dx), height: Math.max(5, placement.height + dy) };
            } else if (interaction.type === 'rotate') {
                const centerX = rect.left + (placement.x / 100 * rect.width);
                const centerY = rect.top + (placement.y / 100 * rect.height);
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                newPlacements[index] = { ...placement, rotation: angle + 90 }; // +90 to align handle
            }
            
            onPlacementsChange(newPlacements);
            setInteraction({ ...interaction, startX: e.clientX, startY: e.clientY });
        };

        const handleMouseUp = () => setInteraction(null);

        if (interaction) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [interaction, placements, onPlacementsChange]);
    
    return (
        <div 
            ref={containerRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full h-full relative"
            onClick={() => setSelectedPlacementId(null)} // Deselect on container click
        >
            <img src={mainImage.base64} alt="Original" className="w-full h-full object-contain pointer-events-none" />
            {placements.map(p => {
                const portrait = portraits.find(pr => pr.id === p.portraitId);
                const isSelected = p.id === selectedPlacementId;
                if (!portrait) return null;
                return (
                    <div 
                        key={p.id}
                        className="absolute cursor-move"
                        style={{
                            left: `calc(${p.x}% - (${p.width}% / 2))`,
                            top: `calc(${p.y}% - (${p.height}% / 2))`,
                            width: `${p.width}%`,
                            height: `${p.height}%`,
                            transform: `rotate(${p.rotation}deg)`,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, p.id, 'move')}
                        onClick={(e) => { e.stopPropagation(); setSelectedPlacementId(p.id); }}
                    >
                       <div className={`w-full h-full transition-all ${isSelected ? 'outline outline-2 outline-blue-400 outline-offset-2' : ''}`}>
                            <img src={portrait.base64} className="w-full h-full object-cover opacity-80 pointer-events-none" alt="Placed Portrait" />
                       </div>
                       <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-2 py-0.5 text-xs rounded-full pointer-events-none">
                           {placements.indexOf(p) + 1}
                       </div>
                       {isSelected && (
                        <>
                            {/* Delete Button */}
                            <button onClick={() => handleDelete(p.id)} className="absolute -top-3 -left-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm z-10 hover:bg-red-600">&times;</button>
                            {/* Resize Handle */}
                            <div onMouseDown={(e) => handleMouseDown(e, p.id, 'resize')} className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize z-10"></div>
                            {/* Rotate Handle */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-1 h-6 bg-blue-500 z-10">
                                <div onMouseDown={(e) => handleMouseDown(e, p.id, 'rotate')} className="absolute -top-2 -left-1.5 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-alias z-10"></div>
                            </div>
                        </>
                       )}
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
  setError,
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
    if (event.target.files && event.target.files.length > 0) {
        onImageUpload(event.target.files);
    }
    if (event.target) {
        event.target.value = ''; // Allow re-uploading the same file
    }
  };
  
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      
      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
           const file = items[i].getAsFile();
           if(file) files.push(file);
        }
      }
      
      if(files.length > 0) {
          const dataTransfer = new DataTransfer();
          files.forEach(file => dataTransfer.items.add(file));
          onImageUpload(dataTransfer.files);
      }
    };
    
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageUpload]);

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
        setError('Could not create ZIP file. JSZip library not found.');
        return;
    }
    // @ts-ignore
    const zip = new JSZip();
    const processedEntries = Object.entries(processedImages);
    if (processedEntries.length === 0) return;

    for (const [id, dataUrl] of processedEntries) {
        const original = originalImages.find(img => img.id === id);
        if (original && processingStatus[id] === 'done') {
            const base64Data = (dataUrl as string).split(',')[1];
            zip.file(`processed_${original.file.name}`, base64Data, { base64: true });
        }
    }
    try {
        const zipContent = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipContent);
        link.download = 'processed_images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch(err) {
        setError("Failed to generate ZIP file.");
        console.error(err);
    }
  };

  const MainView: React.FC = () => {
    if (isLoading && !isBatchMode && Object.keys(processedImages).length === 0) return <Spinner />; // Global spinner for single image
    if (error && !isLoading) return <div className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg">{error}</div>;

    if (isBatchMode) {
      return (
        <div className="w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto p-2">
          {originalImages.map(img => (
            <div key={img.id} className="relative aspect-square bg-slate-700/50 rounded-md overflow-hidden group">
                <img src={processedImages[img.id] || img.base64} alt={img.file.name} className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity opacity-100 group-hover:opacity-100">
                    {processingStatus[img.id] === 'pending' && <div className="text-xs text-slate-300">Pending</div>}
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

    if (animatedVideoUrl) { 
        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <video src={animatedVideoUrl} controls autoPlay loop className="max-w-full max-h-[90%] rounded-lg" />
                <button onClick={onAnimatedVideoClose} className="mt-4 bg-slate-600 px-4 py-2 rounded-lg text-sm hover:bg-slate-700">Close Video</button>
            </div>
        )
    }
    
    if (activeTool === 'Phục chế ảnh cũ' && !processedImage) {
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
           <button onClick={() => onUpscaleToRes('4K')} disabled={isPostProcessing} className="bg-slate-700 hover:bg-slate-600 p-2 rounded-md transition disabled:opacity-50">Upscale to 4K</button>
           <button onClick={() => onUpscaleToRes('8K')} disabled={isPostProcessing} className="bg-slate-700 hover:bg-slate-600 p-2 rounded-md transition disabled:opacity-50">Upscale to 8K</button>
           <button onClick={onAnimate360} disabled={isPostProcessing} className="bg-slate-700 hover:bg-slate-600 p-2 rounded-md transition disabled:opacity-50">Animate 360°</button>
           <button onClick={onOpenWatermarkModal} disabled={isPostProcessing} className="bg-slate-700 hover:bg-slate-600 p-2 rounded-md transition disabled:opacity-50">Add Watermark</button>
           <button onClick={() => handleDownload(originalImages[0].id)} className="col-span-full mt-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md transition font-semibold">Download Image</button>
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
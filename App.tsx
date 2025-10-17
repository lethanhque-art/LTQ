

import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';

// Settings Panels
import { SettingsPanel } from './components/SettingsPanel';
import { EnhancementSettingsPanel } from './components/SharpenSettingsPanel'; // Repurposed from Sharpen
import { UpscaleSettingsPanel } from './components/UpscaleSettingsPanel';
import { IDPhotoSettingsPanel } from './components/IDPhotoSettingsPanel';
import { DocumentRestorationSettingsPanel } from './components/DocumentRestorationSettingsPanel';
import { WeddingPhotoSettingsPanel } from './components/WeddingPhotoSettingsPanel';
import { TrendPhotoSettingsPanel } from './components/TrendPhotoSettingsPanel';
import { ChangeBackgroundSettingsPanel } from './components/ChangeBackgroundSettingsPanel';
import { CleanBackgroundSettingsPanel } from './components/CleanBackgroundSettingsPanel';
import { CleanImageSettingsPanel } from './components/CleanImageSettingsPanel';
import { SkinSmoothingSettingsPanel } from './components/SkinSmoothingSettingsPanel';
import { StraightenFaceSettingsPanel } from './components/StraightenFaceSettingsPanel';
import { BWPhotoSettingsPanel } from './components/BWPhotoSettingsPanel';
import { PresetColorSettingsPanel } from './components/PresetColorSettingsPanel';
import { AutoColorSettingsPanel } from './components/AutoColorSettingsPanel';
import { PromptEditSettingsPanel } from './components/PromptEditSettingsPanel';
import { ImageFilterSettingsPanel } from './components/ImageFilterSettingsPanel';
import { WatermarkModal } from './components/WatermarkModal';


import { editImage, generateVideoFromImage } from './services/geminiService';
import * as types from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>('Phục chế ảnh cũ');

  // State for all tools
  const [restorationSettings, setRestorationSettings] = useState<types.RestorationSettings>(types.initialSettings);
  const [enhancementSettings, setEnhancementSettings] = useState<types.EnhancementSettings>(types.initialEnhancementSettings);
  const [upscaleSettings, setUpscaleSettings] = useState<types.UpscaleSettings>(types.initialUpscaleSettings);
  const [idPhotoSettings, setIDPhotoSettings] = useState<types.IDPhotoSettings>(types.initialIDPhotoSettings);
  const [docRestoreSettings, setDocRestoreSettings] = useState<types.DocumentRestorationSettings>(types.initialDocumentRestorationSettings);
  const [weddingPhotoSettings, setWeddingPhotoSettings] = useState<types.WeddingPhotoSettings>(types.initialWeddingPhotoSettings);
  const [trendPhotoSettings, setTrendPhotoSettings] = useState<types.TrendPhotoSettings>(types.initialTrendPhotoSettings);
  const [changeBgSettings, setChangeBgSettings] = useState<types.ChangeBackgroundSettings>(types.initialChangeBackgroundSettings);
  const [cleanBgSettings, setCleanBgSettings] = useState<types.CleanBackgroundSettings>(types.initialCleanBackgroundSettings);
  const [cleanImageSettings, setCleanImageSettings] = useState<types.CleanImageSettings>(types.initialCleanImageSettings);
  const [skinSmoothSettings, setSkinSmoothSettings] = useState<types.SkinSmoothingSettings>(types.initialSkinSmoothingSettings);
  const [straightenFaceSettings, setStraightenFaceSettings] = useState<types.StraightenFaceSettings>(types.initialStraightenFaceSettings);
  const [bwPhotoSettings, setBwPhotoSettings] = useState<types.BWPhotoSettings>(types.initialBWPhotoSettings);
  const [presetColorSettings, setPresetColorSettings] = useState<types.PresetColorSettings>(types.initialPresetColorSettings);
  const [autoColorSettings, setAutoColorSettings] = useState<types.AutoColorSettings>(types.initialAutoColorSettings);
  const [promptEditSettings, setPromptEditSettings] = useState<types.PromptEditSettings>(types.initialPromptEditSettings);
  const [imageFilterSettings, setImageFilterSettings] = useState<types.ImageFilterSettings>(types.initialImageFilterSettings);
  const [watermarkSettings, setWatermarkSettings] = useState<types.WatermarkSettings>(types.initialWatermarkSettings);

  // Common state for single and batch processing
  const [originalImages, setOriginalImages] = useState<types.ImageFile[]>([]);
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({});
  const [processingStatus, setProcessingStatus] = useState<Record<string, types.ProcessingStatus>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Face Swap State
  const [portraitImages, setPortraitImages] = useState<types.PortraitImage[]>([]);
  const [facePlacements, setFacePlacements] = useState<types.FacePlacement[]>([]);

  // Post-processing state (only for single image mode)
  const [animatedVideoUrl, setAnimatedVideoUrl] = useState<string | null>(null);
  const [isPostProcessing, setIsPostProcessing] = useState<boolean>(false);
  const [postProcessingError, setPostProcessingError] = useState<string | null>(null);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState<boolean>(false);
  
  const isBatchMode = originalImages.length > 1;

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleImageUpload = async (files: FileList) => {
    handleReset(false); // Reset processed images but keep settings
    try {
      const imageFilePromises = Array.from(files).map(async (file) => {
        const base64 = await fileToBase64(file);
        return { id: crypto.randomUUID(), file, base64 };
      });
      const loadedImages = await Promise.all(imageFilePromises);
      setOriginalImages(loadedImages);
      const initialStatus = loadedImages.reduce((acc, img) => ({...acc, [img.id]: 'pending' as types.ProcessingStatus}), {});
      setProcessingStatus(initialStatus);

    } catch (err) {
      setError('Failed to load one or more images.');
      console.error(err);
    }
  };

  const handleReset = (clearAll: boolean = true) => {
    setProcessedImages({});
    setProcessingStatus({});
    setIsLoading(false);
    setError(null);
    setAnimatedVideoUrl(null);
    setIsPostProcessing(false);
    setPostProcessingError(null);
    setIsWatermarkModalOpen(false);
    setPortraitImages([]);
    setFacePlacements([]);

    if (clearAll) {
      setOriginalImages([]);
      // Reset all settings
      setRestorationSettings(types.initialSettings);
      setEnhancementSettings(types.initialEnhancementSettings);
      setUpscaleSettings(types.initialUpscaleSettings);
      setIDPhotoSettings(types.initialIDPhotoSettings);
      setDocRestoreSettings(types.initialDocumentRestorationSettings);
      setWeddingPhotoSettings(types.initialWeddingPhotoSettings);
      setTrendPhotoSettings(types.initialTrendPhotoSettings);
      setChangeBgSettings(types.initialChangeBackgroundSettings);
      setCleanBgSettings(types.initialCleanBackgroundSettings);
      setCleanImageSettings(types.initialCleanImageSettings);
      setSkinSmoothSettings(types.initialSkinSmoothingSettings);
      setStraightenFaceSettings(types.initialStraightenFaceSettings);
      setBwPhotoSettings(types.initialBWPhotoSettings);
      setPresetColorSettings(types.initialPresetColorSettings);
      setAutoColorSettings(types.initialAutoColorSettings);
      setPromptEditSettings(types.initialPromptEditSettings);
      setImageFilterSettings(types.initialImageFilterSettings);
      setWatermarkSettings(types.initialWatermarkSettings);
    }
  };
  
  const handleToolChange = (toolName: string) => {
    setActiveTool(toolName);
    handleReset(true);
  };
  
  // --- GENERIC HANDLER for Single & Batch ---
  const handleGenericEdit = useCallback(async (promptGenerator: () => string) => {
      if (originalImages.length === 0) {
          setError('Please upload an image first.');
          return;
      }
      setIsLoading(true);
      setError(null);
      setProcessedImages({});
      
      const prompt = promptGenerator();
      
      for(const image of originalImages) {
        setProcessingStatus(prev => ({...prev, [image.id]: 'processing'}));
        try {
            const base64Data = image.base64.split(',')[1];
            const resultBase64 = await editImage(base64Data, image.file.type, prompt);
            setProcessedImages(prev => ({...prev, [image.id]: `data:image/png;base64,${resultBase64}`}));
            setProcessingStatus(prev => ({...prev, [image.id]: 'done'}));
        } catch (err) {
            console.error(`Error processing ${image.file.name}:`, err);
            setProcessingStatus(prev => ({...prev, [image.id]: 'error'}));
            setError(`Failed to process ${image.file.name}.`);
        }
      }

      setIsLoading(false);
  }, [originalImages]);

  // --- Face Swap Logic ---
  const generateCompositeAndRestore = async () => {
      if (originalImages.length !== 1 || portraitImages.length === 0 || facePlacements.length === 0) return;
      
      setIsLoading(true);
      setError(null);
      setProcessedImages({});
      const image = originalImages[0];
      setProcessingStatus({ [image.id]: 'processing' });

      try {
        const mainImage = new Image();
        mainImage.src = image.base64;
        await new Promise(r => mainImage.onload = r);

        const loadedPortraits = await Promise.all(portraitImages.map(p => {
          const img = new Image();
          img.src = p.base64;
          return new Promise<HTMLImageElement>(r => { img.onload = () => r(img) });
        }));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Canvas context not available");

        const margin = 50;
        const portraitHeight = 200;
        const totalHeight = mainImage.height + portraitHeight + margin * 2;
        const totalWidth = mainImage.width;
        
        canvas.width = totalWidth;
        canvas.height = totalHeight;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, totalWidth, totalHeight);
        
        // Draw main image and markers
        const mainImageY = portraitHeight + margin;
        ctx.drawImage(mainImage, 0, mainImageY);

        ctx.font = 'bold 32px Arial';
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 3;
        
        let promptParts: string[] = ["Restore this old, damaged photograph."];

        // Draw portraits and markers
        let currentX = margin;
        facePlacements.forEach((placement, index) => {
            const portraitIndex = portraitImages.findIndex(p => p.id === placement.portraitId);
            if (portraitIndex === -1) return;
            
            const portraitImg = loadedPortraits[portraitIndex];
            const aspectRatio = portraitImg.width / portraitImg.height;
            const portraitWidth = portraitHeight * aspectRatio;

            if (currentX + portraitWidth > totalWidth - margin) return; // safety check

            ctx.drawImage(portraitImg, currentX, margin / 2, portraitWidth, portraitHeight);
            const marker = (index + 1).toString();
            
            // Marker on portrait
            ctx.strokeText(marker, currentX + 10, margin / 2 + 30);
            ctx.fillText(marker, currentX + 10, margin / 2 + 30);
            
            // Marker on main image
            const targetX = placement.x / 100 * mainImage.width;
            const targetY = (placement.y / 100 * mainImage.height) + mainImageY;
            ctx.strokeText(marker, targetX, targetY);
            ctx.fillText(marker, targetX, targetY);

            currentX += portraitWidth + margin;
        });

        const compositeBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

        const faceSwapPrompt = `CRITICAL INSTRUCTION: You must perform face replacements as indicated by the numbered markers. The small, numbered portrait images are provided in the top margin of the input image. For each numbered marker on a face in the main photo area, you must replace that face with the face from the corresponding numbered portrait in the margin. The replacement must be seamless. Match the lighting, skin tone, grain, and overall vintage style of the original photograph. It is very important that you also intelligently adjust the apparent age of the person in the new face to match the context of the old photograph. Do not add any text or numbers to the final output image.`;
        
        const mainPrompt = generateRestorationPrompt();
        const finalPrompt = `${mainPrompt}. ${faceSwapPrompt}`;
        
        const resultBase64 = await editImage(compositeBase64, 'image/jpeg', finalPrompt);
        setProcessedImages({ [image.id]: `data:image/png;base64,${resultBase64}` });
        setProcessingStatus({ [image.id]: 'done' });
      } catch (err) {
        console.error("Face swap failed:", err);
        setError("An error occurred during face swap processing.");
        setProcessingStatus({ [image.id]: 'error' });
      } finally {
        setIsLoading(false);
      }
  }


  // --- PROMPT GENERATORS & HANDLERS ---
  
  const generateRestorationPrompt = () => {
    let promptParts: string[] = ["Restore this old, damaged photograph."];
    // (Implementation from before)
    return promptParts.join(' ');
  };
  const handleRestore = () => {
    if (!isBatchMode && facePlacements.length > 0) {
        generateCompositeAndRestore();
    } else {
        handleGenericEdit(generateRestorationPrompt);
    }
  };

  const generateEnhancementPrompt = () => { /* ... same as before ... */ return `Enhance this image with level ${enhancementSettings.level}.`; };
  const handleEnhance = () => handleGenericEdit(generateEnhancementPrompt);

  const generateUpscalePrompt = () => `Upscale this image, increasing its resolution by ${upscaleSettings.scale}x.`;
  const handleUpscale = () => handleGenericEdit(generateUpscalePrompt);

  const generateIDPhotoPrompt = () => `Edit this portrait to be a standard ID photo. Change the background to a solid ${idPhotoSettings.background === 'Xanh' ? 'blue' : 'white'} color. ${idPhotoSettings.standardizeClothing ? 'If the clothing is very casual, subtly change it to a more formal collared shirt or blouse.': ''}`;
  const handleIDPhoto = () => handleGenericEdit(generateIDPhotoPrompt);

  const generateDocRestorePrompt = () => `Restore this document. ${docRestoreSettings.enhanceText ? 'Enhance text clarity.' : ''} ${docRestoreSettings.removeStains ? 'Remove creases and stains.' : ''} ${docRestoreSettings.straighten ? 'Correct perspective.' : ''}`;
  const handleDocRestore = () => handleGenericEdit(generateDocRestorePrompt);

  const generateWeddingPhotoPrompt = () => `Transform this photo of a couple into a beautiful "${weddingPhotoSettings.style}" themed wedding photo.`;
  const handleWeddingPhoto = () => handleGenericEdit(generateWeddingPhotoPrompt);

  const generateTrendPhotoPrompt = () => `Recreate this photo in the style of the "${trendPhotoSettings.trend}" AI trend.`;
  const handleTrendPhoto = () => handleGenericEdit(generateTrendPhotoPrompt);

  const handleChangeBgPrompt = () => `Place the main subject(s) of this image on a new background described as: "${changeBgSettings.prompt}".`;
  const handleChangeBg = () => handleGenericEdit(handleChangeBgPrompt);

  const generateCleanBgPrompt = () => `Clean the background of this image. Remove distracting elements with a ${cleanBgSettings.level > 66 ? 'strong' : cleanBgSettings.level < 33 ? 'light' : 'medium'} level of cleaning.`;
  const handleCleanBg = () => handleGenericEdit(generateCleanBgPrompt);
  
  const generateCleanImagePrompt = () => `Clean this image. Remove digital noise and grain with a ${cleanImageSettings.level > 66 ? 'strong' : cleanImageSettings.level < 33 ? 'light' : 'medium'} level.`;
  const handleCleanImage = () => handleGenericEdit(generateCleanImagePrompt);

  const generateSkinSmoothPrompt = () => `Retouch the skin in this photo. Apply a ${skinSmoothSettings.level > 66 ? 'strong' : skinSmoothSettings.level < 33 ? 'light' : 'medium'} level of smoothing.`;
  const handleSkinSmooth = () => handleGenericEdit(generateSkinSmoothPrompt);

  const generateStraightenFacePrompt = () => `Rotate the image slightly so that the face is perfectly upright.`;
  const handleStraightenFace = () => handleGenericEdit(generateStraightenFacePrompt);

  const generateBWPhotoPrompt = () => `Convert this image to a high-quality black and white photograph in a "${bwPhotoSettings.style}" style.`;
  const handleBWPhoto = () => handleGenericEdit(generateBWPhotoPrompt);

  const generatePresetColorPrompt = () => `Apply a "${presetColorSettings.preset}" color grade to this image.`;
  const handlePresetColor = () => handleGenericEdit(generatePresetColorPrompt);

  const generateAutoColorPrompt = () => { /* ... same as before ... */ return `Automatically correct the colors in this image. ${autoColorSettings.fineTunePrompt}`; };
  const handleAutoColor = () => handleGenericEdit(generateAutoColorPrompt);

  const generatePromptEditPrompt = () => promptEditSettings.prompt;
  const handlePromptEdit = () => handleGenericEdit(generatePromptEditPrompt);

  const generateImageFilterPrompt = () => `Apply a "${imageFilterSettings.filter}" filter to this image.`;
  const handleImageFilter = () => handleGenericEdit(generateImageFilterPrompt);

  // Post-processing handlers (SINGLE IMAGE ONLY)
  const handleUpscaleToRes = useCallback(async (resolution: '4K' | '8K' | '16K') => {
      const imageId = originalImages[0]?.id;
      const processedImage = processedImages[imageId];
      if (!processedImage || isBatchMode) return;
      setIsPostProcessing(true); setPostProcessingError(null); setError(null);
      try {
          const prompt = `Upscale this image to a very high resolution, equivalent to ${resolution}.`;
          const [, base64Data] = processedImage.split(',');
          const mimeType = processedImage.match(/:(.*?);/)?.[1] || 'image/png';
          const resultBase64 = await editImage(base64Data, mimeType, prompt);
          setProcessedImages(prev => ({...prev, [imageId]: `data:image/png;base64,${resultBase64}`}));
      } catch (err) { setPostProcessingError(`Failed to upscale to ${resolution}.`); } finally { setIsPostProcessing(false); }
  }, [processedImages, originalImages, isBatchMode]);

  const handleAnimate360 = useCallback(async () => {
    // @ts-ignore
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      try {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      } catch (e) {
        // User closed the dialog without selecting a key
        console.log("API key selection cancelled.");
        return;
      }
    }
    const imageId = originalImages[0]?.id;
    const processedImage = processedImages[imageId];
    if (!processedImage || isBatchMode) return;
    setIsPostProcessing(true); setPostProcessingError(null); setError(null); setAnimatedVideoUrl(null);
    try {
        const prompt = `Create a short, smooth 3D parallax animation of the person in this photo.`;
        const [, base64Data] = processedImage.split(',');
        const mimeType = processedImage.match(/:(.*?);/)?.[1] || 'image/png';
        const videoUrl = await generateVideoFromImage(base64Data, mimeType, prompt);
        setAnimatedVideoUrl(videoUrl);
    } catch (err) { 
        console.error("Error generating 360 animation:", err);
        if (err instanceof Error && err.message.includes("Requested entity was not found.")) {
          setPostProcessingError('API Key error. Please select your key again.');
          // @ts-ignore
          if (window.aistudio) {
            // @ts-ignore
            window.aistudio.openSelectKey();
          }
        } else {
          setPostProcessingError('Failed to generate 360° animation.'); 
        }
    } finally { setIsPostProcessing(false); }
  }, [processedImages, originalImages, isBatchMode]);
  
  const handleApplyWatermark = useCallback(() => {
    const imageId = originalImages[0]?.id;
    const processedImage = processedImages[imageId];
    if (!processedImage || isBatchMode) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = processedImage;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setPostProcessingError('Could not get canvas context.');
            return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const settings = watermarkSettings;
        const fontSize = (canvas.width * settings.fontSize) / 100;
        const rgbaColor = settings.color === 'White' 
            ? `rgba(255, 255, 255, ${settings.opacity / 100})` 
            : `rgba(0, 0, 0, ${settings.opacity / 100})`;

        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = rgbaColor;
        // ... (rest of canvas logic is same)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let x, y;
        const margin = canvas.width * 0.02;

        switch (settings.position) {
            case 'Top Left': ctx.textAlign = 'left'; ctx.textBaseline = 'top'; x = margin; y = margin; break;
            case 'Top Right': ctx.textAlign = 'right'; ctx.textBaseline = 'top'; x = canvas.width - margin; y = margin; break;
            case 'Bottom Left': ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; x = margin; y = canvas.height - margin; break;
            case 'Center': x = canvas.width / 2; y = canvas.height / 2; break;
            case 'Bottom Right': default: ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; x = canvas.width - margin; y = canvas.height - margin; break;
        }

        ctx.fillText(settings.text, x, y);
        setProcessedImages(prev => ({...prev, [imageId]: canvas.toDataURL('image/png')}));
        setIsWatermarkModalOpen(false);
    };

    img.onerror = () => setPostProcessingError('Failed to load image for watermarking.');
  }, [processedImages, originalImages, isBatchMode, watermarkSettings]);


  const renderActiveTool = () => {
    const mainContentProps = { 
        originalImages, 
        processedImages, 
        processingStatus,
        isLoading, 
        error, 
        onImageUpload: handleImageUpload, 
        animatedVideoUrl, 
        onAnimatedVideoClose: () => setAnimatedVideoUrl(null), 
        isPostProcessing, 
        postProcessingError, 
        onAnimate360: handleAnimate360, 
        onUpscaleToRes: handleUpscaleToRes, 
        onOpenWatermarkModal: () => setIsWatermarkModalOpen(true),
        isBatchMode,
        activeTool,
        portraitImages,
        facePlacements,
        onFacePlacementsChange: setFacePlacements,
    };
    const commonSettingsProps = { onReset: () => handleReset(true), isProcessing: isLoading, hasImage: originalImages.length > 0, isBatchMode };

    switch (activeTool) {
      case 'Phục chế ảnh cũ': return (<><MainContent {...mainContentProps} /><SettingsPanel settings={restorationSettings} onSettingsChange={setRestorationSettings} onRestore={handleRestore} {...commonSettingsProps} portraitImages={portraitImages} onPortraitImagesChange={setPortraitImages} /></>);
      case 'Super Enhancement': return (<><MainContent {...mainContentProps} /><EnhancementSettingsPanel settings={enhancementSettings} onSettingsChange={setEnhancementSettings} onEnhance={handleEnhance} {...commonSettingsProps} /></>);
      case 'Upscale ảnh': return (<><MainContent {...mainContentProps} /><UpscaleSettingsPanel settings={upscaleSettings} onSettingsChange={setUpscaleSettings} onUpscale={handleUpscale} {...commonSettingsProps} /></>);
      case 'Chỉnh sửa ảnh thẻ': return (<><MainContent {...mainContentProps} /><IDPhotoSettingsPanel settings={idPhotoSettings} onSettingsChange={setIDPhotoSettings} onProcess={handleIDPhoto} {...commonSettingsProps} /></>);
      case 'Phục chế giấy tờ': return (<><MainContent {...mainContentProps} /><DocumentRestorationSettingsPanel settings={docRestoreSettings} onSettingsChange={setDocRestoreSettings} onProcess={handleDocRestore} {...commonSettingsProps} /></>);
      case 'Ảnh cưới AI': return (<><MainContent {...mainContentProps} /><WeddingPhotoSettingsPanel settings={weddingPhotoSettings} onSettingsChange={setWeddingPhotoSettings} onProcess={handleWeddingPhoto} {...commonSettingsProps} /></>);
      case 'Tạo ảnh Trend': return (<><MainContent {...mainContentProps} /><TrendPhotoSettingsPanel settings={trendPhotoSettings} onSettingsChange={setTrendPhotoSettings} onProcess={handleTrendPhoto} {...commonSettingsProps} /></>);
      case 'Thay nền': return (<><MainContent {...mainContentProps} /><ChangeBackgroundSettingsPanel settings={changeBgSettings} onSettingsChange={setChangeBgSettings} onProcess={handleChangeBg} {...commonSettingsProps} /></>);
      case 'Làm sạch nền': return (<><MainContent {...mainContentProps} /><CleanBackgroundSettingsPanel settings={cleanBgSettings} onSettingsChange={setCleanBgSettings} onProcess={handleCleanBg} {...commonSettingsProps} /></>);
      case 'Làm sạch ảnh': return (<><MainContent {...mainContentProps} /><CleanImageSettingsPanel settings={cleanImageSettings} onSettingsChange={setCleanImageSettings} onProcess={handleCleanImage} {...commonSettingsProps} /></>);
      case 'Làm mịn da': return (<><MainContent {...mainContentProps} /><SkinSmoothingSettingsPanel settings={skinSmoothSettings} onSettingsChange={setSkinSmoothSettings} onProcess={handleSkinSmooth} {...commonSettingsProps} /></>);
      case 'Xoay thẳng mặt': return (<><MainContent {...mainContentProps} /><StraightenFaceSettingsPanel onProcess={handleStraightenFace} {...commonSettingsProps} /></>);
      case 'Ảnh đen trắng': return (<><MainContent {...mainContentProps} /><BWPhotoSettingsPanel settings={bwPhotoSettings} onSettingsChange={setBwPhotoSettings} onProcess={handleBWPhoto} {...commonSettingsProps} /></>);
      case 'Màu Preset': return (<><MainContent {...mainContentProps} /><PresetColorSettingsPanel settings={presetColorSettings} onSettingsChange={setPresetColorSettings} onProcess={handlePresetColor} {...commonSettingsProps} /></>);
      case 'Tự động chỉnh màu': return (<><MainContent {...mainContentProps} /><AutoColorSettingsPanel settings={autoColorSettings} onSettingsChange={setAutoColorSettings} onProcess={handleAutoColor} {...commonSettingsProps} /></>);
      case 'Bộ lọc ảnh': return (<><MainContent {...mainContentProps} /><ImageFilterSettingsPanel settings={imageFilterSettings} onSettingsChange={setImageFilterSettings} onProcess={handleImageFilter} {...commonSettingsProps} /></>);
      case 'Chỉnh sửa theo Prompt': return (<><MainContent {...mainContentProps} /><PromptEditSettingsPanel settings={promptEditSettings} onSettingsChange={setPromptEditSettings} onProcess={handlePromptEdit} {...commonSettingsProps} /></>);
      default: return <div className="p-8 text-center w-full">Coming Soon: {activeTool}</div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 text-slate-300 font-sans">
      <Sidebar activeTool={activeTool} onToolChange={handleToolChange} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50 flex-shrink-0">
          <h1 className="text-xl font-bold text-white">TOOL CHỈNH ẢNH PRO</h1>
          <div className="flex items-center gap-4">
             <span className="text-sm">Device</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm11.293 4.293a1 1 0 011.414 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L8 12.586l6.293-6.293z" clipRule="evenodd" /></svg>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          {renderActiveTool()}
        </div>
      </main>
      <WatermarkModal 
        show={isWatermarkModalOpen}
        settings={watermarkSettings}
        onSettingsChange={setWatermarkSettings}
        onApply={handleApplyWatermark}
        onCancel={() => setIsWatermarkModalOpen(false)}
      />
    </div>
  );
};

export default App;
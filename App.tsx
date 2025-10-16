
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
  const [skinSmoothSettings, setSkinSmoothSettings] = useState<types.SkinSmoothingSettings>(types.initialSkinSmoothingSettings);
  const [straightenFaceSettings, setStraightenFaceSettings] = useState<types.StraightenFaceSettings>(types.initialStraightenFaceSettings);
  const [bwPhotoSettings, setBwPhotoSettings] = useState<types.BWPhotoSettings>(types.initialBWPhotoSettings);
  const [presetColorSettings, setPresetColorSettings] = useState<types.PresetColorSettings>(types.initialPresetColorSettings);
  const [autoColorSettings, setAutoColorSettings] = useState<types.AutoColorSettings>(types.initialAutoColorSettings);
  const [promptEditSettings, setPromptEditSettings] = useState<types.PromptEditSettings>(types.initialPromptEditSettings);
  const [imageFilterSettings, setImageFilterSettings] = useState<types.ImageFilterSettings>(types.initialImageFilterSettings);
  const [watermarkSettings, setWatermarkSettings] = useState<types.WatermarkSettings>(types.initialWatermarkSettings);


  // Common state
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [animatedVideoUrl, setAnimatedVideoUrl] = useState<string | null>(null);
  const [isPostProcessing, setIsPostProcessing] = useState<boolean>(false);
  const [postProcessingError, setPostProcessingError] = useState<string | null>(null);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState<boolean>(false);


  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleImageUpload = async (file: File) => {
    try {
      const base64String = await fileToBase64(file);
      setOriginalImage(base64String);
      setOriginalMimeType(file.type);
      handleReset(false);
    } catch (err) {
      setError('Failed to load image.');
      console.error(err);
    }
  };

  const handleReset = (clearOriginal: boolean = true) => {
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
    setSkinSmoothSettings(types.initialSkinSmoothingSettings);
    setStraightenFaceSettings(types.initialStraightenFaceSettings);
    setBwPhotoSettings(types.initialBWPhotoSettings);
    setPresetColorSettings(types.initialPresetColorSettings);
    setAutoColorSettings(types.initialAutoColorSettings);
    setPromptEditSettings(types.initialPromptEditSettings);
    setImageFilterSettings(types.initialImageFilterSettings);
    setWatermarkSettings(types.initialWatermarkSettings);

    if (clearOriginal) {
      setOriginalImage(null);
      setOriginalMimeType(null);
    }
    setProcessedImage(null);
    setIsLoading(false);
    setError(null);
    setAnimatedVideoUrl(null);
    setIsPostProcessing(false);
    setPostProcessingError(null);
    setIsWatermarkModalOpen(false);
  };
  
  const handleToolChange = (toolName: string) => {
    setActiveTool(toolName);
    handleReset(true);
  };
  
  // --- GENERIC HANDLER ---
  const handleGenericEdit = useCallback(async (promptGenerator: () => string) => {
      if (!originalImage || !originalMimeType) {
          setError('Please upload an image first.');
          return;
      }
      setIsLoading(true);
      setError(null);
      setProcessedImage(null);
      try {
          const prompt = promptGenerator();
          const base64Data = originalImage.split(',')[1];
          const resultBase64 = await editImage(base64Data, originalMimeType, prompt);
          setProcessedImage(`data:image/png;base64,${resultBase64}`);
      } catch (err) {
          console.error(err);
          setError('An error occurred during processing. Please try again.');
      } finally {
          setIsLoading(false);
      }
  }, [originalImage, originalMimeType]);

  // --- PROMPT GENERATORS & HANDLERS ---
  
  const generateRestorationPrompt = () => {
    let promptParts: string[] = ["Restore this old, damaged photograph..."];
    // (Implementation from before)
    return promptParts.join(' ');
  };
  const handleRestore = () => handleGenericEdit(generateRestorationPrompt);

  const generateEnhancementPrompt = () => {
    const promptParts = [
        `Perform a super enhancement on this image to improve its quality significantly. Apply a ${enhancementSettings.level > 66 ? 'strong' : enhancementSettings.level < 33 ? 'light' : 'medium'} level of enhancement.`,
        `Unblur any motion or focus issues, remove digital noise and grain, and restore fine details, especially in faces and textures, to make the image incredibly sharp and clear.`,
        `The final result should be of professional quality.`
    ];
    if (enhancementSettings.removeWatermark) {
        promptParts.push("Also, identify and completely remove any watermarks, seamlessly filling in the background.");
    }
    return promptParts.join(' ');
  };
  const handleEnhance = () => handleGenericEdit(generateEnhancementPrompt);

  const generateUpscalePrompt = () => `Upscale this image, increasing its resolution by ${upscaleSettings.scale}x. Maintain as much detail as possible from the original image.`;
  const handleUpscale = () => handleGenericEdit(generateUpscalePrompt);

  const generateIDPhotoPrompt = () => `Edit this portrait to be a standard ID photo. Change the background to a solid ${idPhotoSettings.background === 'Xanh' ? 'blue' : 'white'} color. ${idPhotoSettings.standardizeClothing ? 'If the clothing is very casual, subtly change it to a more formal collared shirt or blouse.': ''} Ensure the person is centered and facing forward.`;
  const handleIDPhoto = () => handleGenericEdit(generateIDPhotoPrompt);

  const generateDocRestorePrompt = () => `Restore this document. ${docRestoreSettings.enhanceText ? 'Enhance text clarity and make it sharp and readable.' : ''} ${docRestoreSettings.removeStains ? 'Remove creases, stains, and yellowing.' : ''} ${docRestoreSettings.straighten ? 'Correct any perspective distortion and make the document appear flat.' : ''}`;
  const handleDocRestore = () => handleGenericEdit(generateDocRestorePrompt);

  const generateWeddingPhotoPrompt = () => `Transform this photo of a couple into a beautiful wedding photo. Place them in a scene that matches a "${weddingPhotoSettings.style}" theme. The final image should be romantic and high-quality.`;
  const handleWeddingPhoto = () => handleGenericEdit(generateWeddingPhotoPrompt);

  const generateTrendPhotoPrompt = () => `Recreate this photo in the style of the "${trendPhotoSettings.trend}" AI trend. The result should be artistic and capture the essence of that specific trend.`;
  const handleTrendPhoto = () => handleGenericEdit(generateTrendPhotoPrompt);

  const handleChangeBgPrompt = () => `Accurately identify the main subject(s) in this image, create a clean cutout, and place them on a new background described as: "${changeBgSettings.prompt}". Ensure the lighting and perspective on the subjects match the new background.`;
  const handleChangeBg = () => handleGenericEdit(handleChangeBgPrompt);

  const generateCleanBgPrompt = () => `Clean the background of this image. Identify and remove any distracting elements, objects, or people from the background. The final result should have the main subject on a clean, unobtrusive background. Apply a ${cleanBgSettings.level > 66 ? 'strong' : cleanBgSettings.level < 33 ? 'light' : 'medium'} level of cleaning.`;
  const handleCleanBg = () => handleGenericEdit(generateCleanBgPrompt);
  
  const generateSkinSmoothPrompt = () => `Retouch the skin of the person in this photo. Smooth out blemishes and wrinkles while maintaining a natural skin texture. Apply a ${skinSmoothSettings.level > 66 ? 'strong' : skinSmoothSettings.level < 33 ? 'light' : 'medium'} level of smoothing.`;
  const handleSkinSmooth = () => handleGenericEdit(generateSkinSmoothPrompt);

  const generateStraightenFacePrompt = () => `Analyze the orientation of the face in this photo and rotate the image slightly so that the face is perfectly upright and straight.`;
  const handleStraightenFace = () => handleGenericEdit(generateStraightenFacePrompt);

  const generateBWPhotoPrompt = () => `Convert this image to a high-quality black and white photograph. Apply a "${bwPhotoSettings.style}" style.`;
  const handleBWPhoto = () => handleGenericEdit(generateBWPhotoPrompt);

  const generatePresetColorPrompt = () => `Apply a color grade to this image that matches the style of a "${presetColorSettings.preset}" preset. This should involve adjusting colors, saturation, contrast, and tones to create that specific aesthetic.`;
  const handlePresetColor = () => handleGenericEdit(generatePresetColorPrompt);

  const generateAutoColorPrompt = () => {
    let prompt = `Automatically analyze and correct the colors in this image. Adjust the white balance, exposure, contrast, and saturation to make the photo look balanced, vibrant, and natural.`;
    if (autoColorSettings.fineTunePrompt) {
        prompt += ` Additionally, apply the following fine-tuning: "${autoColorSettings.fineTunePrompt}".`;
    }
    return prompt;
  };
  const handleAutoColor = () => handleGenericEdit(generateAutoColorPrompt);

  const generatePromptEditPrompt = () => promptEditSettings.prompt;
  const handlePromptEdit = () => handleGenericEdit(generatePromptEditPrompt);

  const generateImageFilterPrompt = () => `Apply a "${imageFilterSettings.filter}" filter to this image.`;
  const handleImageFilter = () => handleGenericEdit(generateImageFilterPrompt);

  // Post-processing handlers
  const handleUpscaleToRes = useCallback(async (resolution: '4K' | '8K' | '16K') => {
      if (!processedImage) return;
      setIsPostProcessing(true); setPostProcessingError(null); setError(null);
      try {
          const prompt = `Upscale this image to a very high resolution, equivalent to ${resolution}.`;
          const [, base64Data] = processedImage.split(',');
          const mimeType = processedImage.match(/:(.*?);/)?.[1] || 'image/png';
          const resultBase64 = await editImage(base64Data, mimeType, prompt);
          setProcessedImage(`data:image/png;base64,${resultBase64}`);
      } catch (err) { setPostProcessingError(`Failed to upscale to ${resolution}.`); } finally { setIsPostProcessing(false); }
  }, [processedImage]);

  const handleAnimate360 = useCallback(async () => {
    if (!processedImage) return;
    setIsPostProcessing(true); setPostProcessingError(null); setError(null); setAnimatedVideoUrl(null);
    try {
        const prompt = `Create a short, smooth 3D parallax animation of the person in this photo.`;
        const [, base64Data] = processedImage.split(',');
        const mimeType = processedImage.match(/:(.*?);/)?.[1] || 'image/png';
        const videoUrl = await generateVideoFromImage(base64Data, mimeType, prompt);
        setAnimatedVideoUrl(videoUrl);
    } catch (err) { setPostProcessingError('Failed to generate 360° animation.'); } finally { setIsPostProcessing(false); }
  }, [processedImage]);
  
  const handleApplyWatermark = useCallback(() => {
    if (!processedImage) return;

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
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let x, y;
        const margin = canvas.width * 0.02;

        switch (settings.position) {
            case 'Top Left':
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                x = margin;
                y = margin;
                break;
            case 'Top Right':
                ctx.textAlign = 'right';
                ctx.textBaseline = 'top';
                x = canvas.width - margin;
                y = margin;
                break;
            case 'Bottom Left':
                ctx.textAlign = 'left';
                ctx.textBaseline = 'bottom';
                x = margin;
                y = canvas.height - margin;
                break;
            case 'Center':
                x = canvas.width / 2;
                y = canvas.height / 2;
                break;
            case 'Bottom Right':
            default:
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                x = canvas.width - margin;
                y = canvas.height - margin;
                break;
        }

        ctx.fillText(settings.text, x, y);
        setProcessedImage(canvas.toDataURL('image/png'));
        setIsWatermarkModalOpen(false);
    };

    img.onerror = () => {
        setPostProcessingError('Failed to load image for watermarking.');
    };
  }, [processedImage, watermarkSettings]);


  const renderActiveTool = () => {
    const mainContentProps = { originalImage, processedImage, isLoading, error, onImageUpload: handleImageUpload, animatedVideoUrl, onAnimatedVideoClose: () => setAnimatedVideoUrl(null), isPostProcessing, postProcessingError, onAnimate360: handleAnimate360, onUpscaleToRes: handleUpscaleToRes, onOpenWatermarkModal: () => setIsWatermarkModalOpen(true) };
    const commonSettingsProps = { onReset: () => handleReset(true), isProcessing: isLoading, hasImage: !!originalImage };

    switch (activeTool) {
      case 'Phục chế ảnh cũ': return (<><MainContent {...mainContentProps} /><SettingsPanel settings={restorationSettings} onSettingsChange={setRestorationSettings} onRestore={handleRestore} {...commonSettingsProps} /></>);
      case 'Super Enhancement': return (<><MainContent {...mainContentProps} /><EnhancementSettingsPanel settings={enhancementSettings} onSettingsChange={setEnhancementSettings} onEnhance={handleEnhance} {...commonSettingsProps} /></>);
      case 'Upscale ảnh': return (<><MainContent {...mainContentProps} /><UpscaleSettingsPanel settings={upscaleSettings} onSettingsChange={setUpscaleSettings} onUpscale={handleUpscale} {...commonSettingsProps} /></>);
      case 'Chỉnh sửa ảnh thẻ': return (<><MainContent {...mainContentProps} /><IDPhotoSettingsPanel settings={idPhotoSettings} onSettingsChange={setIDPhotoSettings} onProcess={handleIDPhoto} {...commonSettingsProps} /></>);
      case 'Phục chế giấy tờ': return (<><MainContent {...mainContentProps} /><DocumentRestorationSettingsPanel settings={docRestoreSettings} onSettingsChange={setDocRestoreSettings} onProcess={handleDocRestore} {...commonSettingsProps} /></>);
      case 'Ảnh cưới AI': return (<><MainContent {...mainContentProps} /><WeddingPhotoSettingsPanel settings={weddingPhotoSettings} onSettingsChange={setWeddingPhotoSettings} onProcess={handleWeddingPhoto} {...commonSettingsProps} /></>);
      case 'Tạo ảnh Trend': return (<><MainContent {...mainContentProps} /><TrendPhotoSettingsPanel settings={trendPhotoSettings} onSettingsChange={setTrendPhotoSettings} onProcess={handleTrendPhoto} {...commonSettingsProps} /></>);
      case 'Thay nền': return (<><MainContent {...mainContentProps} /><ChangeBackgroundSettingsPanel settings={changeBgSettings} onSettingsChange={setChangeBgSettings} onProcess={handleChangeBg} {...commonSettingsProps} /></>);
      case 'Làm sạch nền': return (<><MainContent {...mainContentProps} /><CleanBackgroundSettingsPanel settings={cleanBgSettings} onSettingsChange={setCleanBgSettings} onProcess={handleCleanBg} {...commonSettingsProps} /></>);
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

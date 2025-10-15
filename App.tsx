
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { SettingsPanel } from './components/SettingsPanel';
import { editImage } from './services/geminiService';
import { type SharpenSettings, initialSharpenSettings } from './types';

const App: React.FC = () => {
  const [settings, setSettings] = useState<SharpenSettings>(initialSharpenSettings);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      setRestoredImage(null);
      setError(null);
    } catch (err) {
      setError('Failed to load image.');
      console.error(err);
    }
  };
  
  const handleReset = () => {
    setSettings(initialSharpenSettings);
    setOriginalImage(null);
    setRestoredImage(null);
    setIsLoading(false);
    setError(null);
  };

  const generatePrompt = (currentSettings: SharpenSettings): string => {
    let promptParts: string[] = [
      "Sharpen this blurry image, significantly improving its clarity, focus, and detail.",
    ];

    switch (currentSettings.level) {
      case 'Mạnh':
        promptParts.push("Apply a strong sharpening effect to bring out maximum detail.");
        break;
      case 'Vừa':
        promptParts.push("Apply a balanced, medium-level sharpening effect for a clear and natural result.");
        break;
      case 'Nhẹ':
        promptParts.push("Apply a light sharpening effect to subtly improve focus.");
        break;
    }
    
    switch (currentSettings.imageType) {
        case 'Chân dung':
            promptParts.push("This is a portrait photo. Focus on sharpening facial features like eyes and hair, while keeping skin texture natural.");
            break;
        case 'Phong cảnh':
            promptParts.push("This is a landscape photo. Enhance details across the entire scene, from the foreground to the background, to create a crisp and deep image.");
            break;
        case 'Sản phẩm':
            promptParts.push("This is a product photo. Sharpen the edges and textures of the product to make it stand out clearly.");
            break;
        case 'Tổng thể':
            promptParts.push("Apply a general-purpose sharpening suitable for a variety of subjects.");
            break;
    }

    if (currentSettings.options.enhanceDetails) {
      promptParts.push("Enhance fine details and textures meticulously.");
    }
    if (currentSettings.options.reduceNoise) {
        promptParts.push("While sharpening, also apply noise reduction to clean up any grain or digital noise, but prioritize sharpness.");
    }
    if (currentSettings.options.fixBlur) {
      promptParts.push("Attempt to correct for slight motion blur or camera shake.");
    }
    if (currentSettings.options.naturalLook) {
      promptParts.push("The final result must look natural. Avoid over-sharpening, halos, or artificial-looking artifacts.");
    }
    if (currentSettings.fineTunePrompt) {
        promptParts.push(`Additionally, apply the following specific instructions: "${currentSettings.fineTunePrompt}".`);
    }

    return promptParts.join(' ');
  };

  const handleRestore = useCallback(async () => {
    if (!originalImage || !originalMimeType) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRestoredImage(null);

    try {
      const prompt = generatePrompt(settings);
      const base64Data = originalImage.split(',')[1];
      
      const resultBase64 = await editImage(base64Data, originalMimeType, prompt);
      setRestoredImage(`data:image/png;base64,${resultBase64}`);

    } catch (err) {
      console.error(err);
      setError('An error occurred during restoration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, originalMimeType, settings]);

  return (
    <div className="flex h-screen w-full bg-slate-900 text-slate-300 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50 flex-shrink-0">
          <h1 className="text-xl font-bold text-white">TOOL CHỈNH ẢNH PRO</h1>
          <div className="flex items-center gap-4">
             <span className="text-sm">Device</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm11.293 4.293a1 1 0 011.414 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L8 12.586l6.293-6.293z" clipRule="evenodd" /></svg>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <MainContent
            originalImage={originalImage}
            restoredImage={restoredImage}
            isLoading={isLoading}
            error={error}
            onImageUpload={handleImageUpload}
          />
          <SettingsPanel 
            settings={settings}
            onSettingsChange={setSettings}
            onRestore={handleRestore}
            onReset={handleReset}
            isProcessing={isLoading}
            hasImage={!!originalImage}
          />
        </div>
      </main>
    </div>
  );
};

export default App;

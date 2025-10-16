// --- Existing Types ---

export interface RestorationSettings {
  level: 'Nhẹ' | 'Vừa' | 'Mạnh';
  background: 'Giữ nguyên';
  gender: 'Nam' | 'Nữ' | 'Khác' | 'Tự động';
  age: number;
  fineTunePrompt: string;
  options: {
    restoreColor: boolean;
    redrawHair: boolean;
    isAsian: boolean;
    redrawClothing: boolean;
    sharpenBackground: boolean;
    adhereToFace: boolean;
    redrawDetails: boolean;
    removeYellowing: boolean;
  };
}

export const initialSettings: RestorationSettings = {
  level: 'Mạnh',
  background: 'Giữ nguyên',
  gender: 'Tự động',
  age: 40,
  fineTunePrompt: '',
  options: {
    restoreColor: true,
    redrawHair: true,
    isAsian: true,
    redrawClothing: true,
    sharpenBackground: true,
    adhereToFace: true,
    redrawDetails: true,
    removeYellowing: true,
  },
};

export interface EnhancementSettings {
  level: number;
  removeWatermark: boolean;
}

export const initialEnhancementSettings: EnhancementSettings = {
  level: 50,
  removeWatermark: false,
};

export interface UpscaleSettings {
  scale: 2 | 4 | 8 | 16;
}

export const initialUpscaleSettings: UpscaleSettings = {
  scale: 2,
};

// --- New Types ---

export interface IDPhotoSettings {
  background: 'Xanh' | 'Trắng';
  standardizeClothing: boolean;
}

export const initialIDPhotoSettings: IDPhotoSettings = {
  background: 'Xanh',
  standardizeClothing: true,
};

export interface DocumentRestorationSettings {
  enhanceText: boolean;
  removeStains: boolean;
  straighten: boolean;
}

export const initialDocumentRestorationSettings: DocumentRestorationSettings = {
  enhanceText: true,
  removeStains: true,
  straighten: true,
};

export interface WeddingPhotoSettings {
  style: 'Cổ điển' | 'Bãi biển' | 'Rừng';
}

export const initialWeddingPhotoSettings: WeddingPhotoSettings = {
  style: 'Cổ điển',
};

export interface TrendPhotoSettings {
  trend: '90s Yearbook' | 'Cyberpunk' | 'Fantasy Avatar';
}

export const initialTrendPhotoSettings: TrendPhotoSettings = {
  trend: '90s Yearbook',
};

export interface ChangeBackgroundSettings {
  prompt: string;
}

export const initialChangeBackgroundSettings: ChangeBackgroundSettings = {
  prompt: 'a beautiful beach at sunset',
};

export interface CleanBackgroundSettings {
  level: number;
}

export const initialCleanBackgroundSettings: CleanBackgroundSettings = {
  level: 50,
};

export interface SkinSmoothingSettings {
  level: number;
}

export const initialSkinSmoothingSettings: SkinSmoothingSettings = {
  level: 50,
};

export interface StraightenFaceSettings {}

export const initialStraightenFaceSettings: StraightenFaceSettings = {};

export interface BWPhotoSettings {
  style: 'Classic' | 'High Contrast' | 'Sepia Tone';
}

export const initialBWPhotoSettings: BWPhotoSettings = {
  style: 'Classic',
};

export interface PresetColorSettings {
  preset: 'Vibrant Summer' | 'Moody Autumn' | 'Vintage Film' | 'Cyberpunk Neon';
}

export const initialPresetColorSettings: PresetColorSettings = {
  preset: 'Vibrant Summer',
};

export interface AutoColorSettings {
  fineTunePrompt: string;
}

export const initialAutoColorSettings: AutoColorSettings = {
  fineTunePrompt: '',
};

export interface PromptEditSettings {
  prompt: string;
}

export const initialPromptEditSettings: PromptEditSettings = {
  prompt: 'make the sky look like a starry night',
};

export interface ImageFilterSettings {
  filter: 'Sepia' | 'Grayscale' | 'Invert' | 'Posterize';
}

export const initialImageFilterSettings: ImageFilterSettings = {
  filter: 'Sepia',
};

// --- Watermark Types ---

export interface WatermarkSettings {
  text: string;
  position: 'Top Left' | 'Top Right' | 'Bottom Left' | 'Bottom Right' | 'Center';
  opacity: number;
  fontSize: number;
  color: 'White' | 'Black';
}

export const initialWatermarkSettings: WatermarkSettings = {
  text: 'Your Watermark',
  position: 'Bottom Right',
  opacity: 50,
  fontSize: 5,
  color: 'White',
};
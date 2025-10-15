
export interface SharpenSettings {
  level: 'Nhẹ' | 'Vừa' | 'Mạnh';
  imageType: 'Chân dung' | 'Phong cảnh' | 'Sản phẩm' | 'Tổng thể';
  fineTunePrompt: string;
  options: {
    enhanceDetails: boolean;
    reduceNoise: boolean;
    fixBlur: boolean;
    naturalLook: boolean;
  };
}

export const initialSharpenSettings: SharpenSettings = {
  level: 'Vừa',
  imageType: 'Tổng thể',
  fineTunePrompt: '',
  options: {
    enhanceDetails: true,
    reduceNoise: false,
    fixBlur: false,
    naturalLook: true,
  },
};



import React from 'react';
import { type RestorationSettings, type PortraitImage } from '../types';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm text-slate-300">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className={`block w-10 h-6 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-slate-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
    </div>
  </label>
);

const PortraitUploader: React.FC<{
  portraits: PortraitImage[];
  onPortraitsChange: (portraits: PortraitImage[]) => void;
}> = ({ portraits, onPortraitsChange }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const fileToBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    const newPortraits: PortraitImage[] = [];
    // Fix: Directly iterate over the FileList, as it is iterable.
    // This avoids potential issues with `Array.from` on FileList in some environments.
    for (const file of e.target.files) {
      const base64 = await fileToBase64(file);
      newPortraits.push({ id: crypto.randomUUID(), base64 });
    }
    onPortraitsChange([...portraits, ...newPortraits]);
  };

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>, portraitId: string) => {
    e.dataTransfer.setData('text/plain', portraitId);
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-2">Ghép mặt (kéo ảnh chân dung vào ảnh gốc)</h3>
      <div className="p-2 border border-dashed border-slate-600 rounded-md">
        <div className="grid grid-cols-3 gap-2 mb-2">
          {portraits.map(p => (
            <img 
              key={p.id}
              src={p.base64}
              alt="Portrait"
              draggable
              onDragStart={(e) => handleDragStart(e, p.id)}
              className="w-full h-auto object-cover rounded aspect-square cursor-grab"
            />
          ))}
        </div>
        <label className="w-full text-center text-xs py-2 block bg-slate-700 hover:bg-slate-600 rounded-md cursor-pointer">
          Tải ảnh chân dung
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
    </div>
  );
};

interface SettingsPanelProps {
  settings: RestorationSettings;
  onSettingsChange: (settings: RestorationSettings) => void;
  onRestore: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasImage: boolean;
  isBatchMode: boolean;
  portraitImages: PortraitImage[];
  onPortraitImagesChange: (portraits: PortraitImage[]) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  onSettingsChange, 
  onRestore, 
  onReset, 
  isProcessing, 
  hasImage,
  isBatchMode,
  portraitImages,
  onPortraitImagesChange,
}) => {
    
    const handleOptionChange = (option: keyof RestorationSettings['options'], value: boolean) => {
        onSettingsChange({
            ...settings,
            options: {
                ...settings.options,
                [option]: value,
            },
        });
    };

  const optionToggles: { key: keyof RestorationSettings['options']; label: string }[] = [
    { key: 'restoreColor', label: 'Khôi phục màu sắc' },
    { key: 'redrawHair', label: 'Vẽ lại tóc chi tiết' },
    { key: 'isAsian', label: 'Người châu Á (tóc đen)' },
    { key: 'redrawClothing', label: 'Vẽ lại trang phục' },
    { key: 'sharpenBackground', label: 'Làm rõ nét hậu cảnh' },
    { key: 'adhereToFace', label: 'Bám theo chi tiết khuôn mặt gốc' },
    { key: 'redrawDetails', label: 'Phục hồi tranh và vẽ lại chi tiết' },
    { key: 'removeYellowing', label: 'Khử ố vàng và phai màu' },
  ];

  return (
    <aside className="w-80 bg-slate-800/50 border-l border-slate-700/50 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Phục chế ảnh cũ</h2>
        <p className="text-xs text-slate-400 mt-1">Khắc phục các vết xước, rách, và phai màu. Cải thiện chi tiết và làm cho ảnh trông như mới.</p>
      </div>
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-slate-300 mb-1">Mức độ phục chế</label>
          <select id="level" value={settings.level} onChange={e => onSettingsChange({...settings, level: e.target.value as RestorationSettings['level']})} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500">
            <option>Nhẹ</option>
            <option>Vừa</option>
            <option>Mạnh</option>
          </select>
        </div>
        <div>
          <label htmlFor="background" className="block text-sm font-medium text-slate-300 mb-1">Phóng nền</label>
          <select id="background" value={settings.background} onChange={e => onSettingsChange({...settings, background: e.target.value as RestorationSettings['background']})} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500">
            <option>Giữ nguyên</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-slate-300 mb-1">Giới tính</label>
            <select id="gender" value={settings.gender} onChange={e => onSettingsChange({...settings, gender: e.target.value as RestorationSettings['gender']})} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500">
              <option>Tự động</option>
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>
          </div>
          {settings.gender !== 'Tự động' && (
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-slate-300 mb-1">Độ tuổi</label>
              <input type="number" id="age" value={settings.age} onChange={e => onSettingsChange({...settings, age: parseInt(e.target.value, 10) || 0})} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500" />
            </div>
          )}
        </div>
         <div>
          <label htmlFor="fineTune" className="block text-sm font-medium text-slate-300 mb-1">Tinh chỉnh ảnh</label>
          <textarea
            id="fineTune"
            rows={3}
            value={settings.fineTunePrompt}
            onChange={e => onSettingsChange({ ...settings, fineTunePrompt: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder='Mô tả thêm các thay đổi bạn muốn, ví dụ: "làm cho da sáng hơn một chút".'
          />
        </div>

        {!isBatchMode && hasImage && (
            <div className="pt-4 border-t border-slate-700/50">
              <PortraitUploader portraits={portraitImages} onPortraitsChange={onPortraitImagesChange} />
            </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-2">Tùy chọn thêm</h3>
          <div className="space-y-3">
            {optionToggles.map(opt => (
                <ToggleSwitch 
                    key={opt.key}
                    label={opt.label}
                    checked={settings.options[opt.key]}
                    onChange={(checked) => handleOptionChange(opt.key, checked)}
                />
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <button
            onClick={onRestore}
            disabled={isProcessing || !hasImage}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {isProcessing ? 'Đang xử lý...' : (isBatchMode ? 'Phục chế hàng loạt' : 'Phục chế ảnh')}
        </button>
        <button 
            onClick={onReset}
            disabled={isProcessing}
            className="w-full bg-slate-600 text-slate-200 font-semibold py-2.5 px-4 rounded-md text-sm transition-colors hover:bg-slate-700 disabled:bg-slate-500 disabled:cursor-not-allowed">
            Bắt đầu lại
        </button>
      </div>
    </aside>
  );
};
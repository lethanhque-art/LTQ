
import React from 'react';
import { type SharpenSettings } from '../types';

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

interface SettingsPanelProps {
  settings: SharpenSettings;
  onSettingsChange: (settings: SharpenSettings) => void;
  onRestore: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, onRestore, onReset, isProcessing, hasImage }) => {
    
    const handleOptionChange = (option: keyof SharpenSettings['options'], value: boolean) => {
        onSettingsChange({
            ...settings,
            options: {
                ...settings.options,
                [option]: value,
            },
        });
    };

  const optionToggles: { key: keyof SharpenSettings['options']; label: string }[] = [
    { key: 'enhanceDetails', label: 'Tăng cường chi tiết nhỏ' },
    { key: 'reduceNoise', label: 'Giảm nhiễu (noise)' },
    { key: 'fixBlur', label: 'Khử mờ do chuyển động' },
    { key: 'naturalLook', label: 'Giữ vẻ tự nhiên' },
  ];

  return (
    <aside className="w-80 bg-slate-800/50 border-l border-slate-700/50 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Làm nét ảnh</h2>
        <p className="text-xs text-slate-400 mt-1">Tăng cường độ sắc nét và chi tiết cho các bức ảnh bị mờ, out nét.</p>
      </div>
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-slate-300 mb-1">Mức độ làm nét</label>
          <select id="level" value={settings.level} onChange={e => onSettingsChange({...settings, level: e.target.value as SharpenSettings['level']})} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500">
            <option>Nhẹ</option>
            <option>Vừa</option>
            <option>Mạnh</option>
          </select>
        </div>
        <div>
          <label htmlFor="imageType" className="block text-sm font-medium text-slate-300 mb-1">Loại ảnh</label>
          <select id="imageType" value={settings.imageType} onChange={e => onSettingsChange({...settings, imageType: e.target.value as SharpenSettings['imageType']})} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500">
            <option>Tổng thể</option>
            <option>Chân dung</option>
            <option>Phong cảnh</option>
            <option>Sản phẩm</option>
          </select>
        </div>
         <div>
          <label htmlFor="fineTune" className="block text-sm font-medium text-slate-300 mb-1">Tinh chỉnh ảnh</label>
          <textarea
            id="fineTune"
            rows={3}
            value={settings.fineTunePrompt}
            onChange={e => onSettingsChange({ ...settings, fineTunePrompt: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder='Mô tả thêm các thay đổi bạn muốn, ví dụ: "tập trung làm nét khuôn mặt".'
          />
        </div>
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
            {isProcessing ? 'Đang xử lý...' : 'Làm nét ảnh'}
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

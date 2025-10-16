
import React from 'react';
import { type WatermarkSettings } from '../types';

interface WatermarkModalProps {
  show: boolean;
  settings: WatermarkSettings;
  onSettingsChange: (settings: WatermarkSettings) => void;
  onApply: () => void;
  onCancel: () => void;
}

export const WatermarkModal: React.FC<WatermarkModalProps> = ({ show, settings, onSettingsChange, onApply, onCancel }) => {
  if (!show) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onSettingsChange({ ...settings, [name]: value });
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onSettingsChange({ ...settings, [name]: parseInt(value, 10) });
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="watermark-modal-title"
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-6 border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="watermark-modal-title" className="text-xl font-bold text-white">Đóng dấu Watermark</h2>

        <div>
          <label htmlFor="text" className="block text-sm font-medium text-slate-300 mb-1">Nội dung</label>
          <textarea
            id="text"
            name="text"
            rows={2}
            value={settings.text}
            onChange={handleInputChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập nội dung watermark"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-slate-300 mb-1">Vị trí</label>
            <select 
              id="position"
              name="position"
              value={settings.position} 
              onChange={handleInputChange} 
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Bottom Right</option>
              <option>Bottom Left</option>
              <option>Top Right</option>
              <option>Top Left</option>
              <option>Center</option>
            </select>
          </div>
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-slate-300 mb-1">Màu sắc</label>
            <select 
              id="color"
              name="color"
              value={settings.color} 
              onChange={handleInputChange} 
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option>White</option>
              <option>Black</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="opacity" className="block text-sm font-medium text-slate-300 mb-2">
            Độ mờ: <span className="font-bold text-blue-400">{settings.opacity}%</span>
          </label>
          <input
            id="opacity"
            name="opacity"
            type="range"
            min="0"
            max="100"
            value={settings.opacity}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="fontSize" className="block text-sm font-medium text-slate-300 mb-2">
            Kích thước chữ: <span className="font-bold text-blue-400">{settings.fontSize}%</span>
          </label>
          <input
            id="fontSize"
            name="fontSize"
            type="range"
            min="1"
            max="20"
            value={settings.fontSize}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
           <p className="text-xs text-slate-400 mt-1">Tỷ lệ theo chiều rộng ảnh.</p>
        </div>


        <div className="flex justify-end gap-3 pt-4">
          <button 
            onClick={onCancel}
            className="bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-md text-sm transition-colors hover:bg-slate-700"
          >
            Hủy
          </button>
          <button
            onClick={onApply}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors hover:bg-blue-700"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

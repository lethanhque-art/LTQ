import React from 'react';
import { type TrendPhotoSettings } from '../types';

interface TrendPhotoSettingsPanelProps {
  settings: TrendPhotoSettings;
  onSettingsChange: (settings: TrendPhotoSettings) => void;
  onProcess: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export const TrendPhotoSettingsPanel: React.FC<TrendPhotoSettingsPanelProps> = ({ settings, onSettingsChange, onProcess, onReset, isProcessing, hasImage }) => {
  return (
    <aside className="w-80 bg-slate-800/50 border-l border-slate-700/50 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Tạo ảnh Trend</h2>
        <p className="text-xs text-slate-400 mt-1">Biến ảnh của bạn theo các xu hướng AI hot nhất trên mạng xã hội.</p>
      </div>
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <label htmlFor="trend" className="block text-sm font-medium text-slate-300 mb-1">Chọn Trend</label>
          <select id="trend" value={settings.trend} onChange={e => onSettingsChange({...settings, trend: e.target.value as TrendPhotoSettings['trend']})} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500">
            <option>90s Yearbook</option>
            <option>Cyberpunk</option>
            <option>Fantasy Avatar</option>
          </select>
        </div>
      </div>
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <button
          onClick={onProcess}
          disabled={isProcessing || !hasImage}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? 'Đang xử lý...' : 'Tạo ảnh Trend'}
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

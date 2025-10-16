
import React from 'react';
import { type UpscaleSettings } from '../types';

interface UpscaleSettingsPanelProps {
  settings: UpscaleSettings;
  onSettingsChange: (settings: UpscaleSettings) => void;
  onUpscale: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export const UpscaleSettingsPanel: React.FC<UpscaleSettingsPanelProps> = ({ settings, onSettingsChange, onUpscale, onReset, isProcessing, hasImage }) => {
  return (
    <aside className="w-80 bg-slate-800/50 border-l border-slate-700/50 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Upscale ảnh</h2>
        <p className="text-xs text-slate-400 mt-1">Tăng độ phân giải của hình ảnh lên 2x hoặc 4x so với kích thước gốc.</p>
      </div>
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tỷ lệ phóng đại
          </label>
          <div className="flex gap-2">
            {( [2, 4] as const ).map(scale => (
                 <button 
                    key={scale}
                    onClick={() => onSettingsChange({ ...settings, scale })}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${settings.scale === scale ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                 >
                    {scale}x
                 </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <button
          onClick={onUpscale}
          disabled={isProcessing || !hasImage}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? 'Đang xử lý...' : 'Upscale'}
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

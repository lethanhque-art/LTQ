import React from 'react';
import { type CleanBackgroundSettings } from '../types';

interface CleanBackgroundSettingsPanelProps {
  settings: CleanBackgroundSettings;
  onSettingsChange: (settings: CleanBackgroundSettings) => void;
  onProcess: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export const CleanBackgroundSettingsPanel: React.FC<CleanBackgroundSettingsPanelProps> = ({ settings, onSettingsChange, onProcess, onReset, isProcessing, hasImage }) => {
  return (
    <aside className="w-80 bg-slate-800/50 border-l border-slate-700/50 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Làm sạch nền</h2>
        <p className="text-xs text-slate-400 mt-1">Tự động xóa các vật thể hoặc người không mong muốn khỏi hậu cảnh.</p>
      </div>
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-slate-300 mb-2">
            Mức độ làm sạch: <span className="font-bold text-blue-400">{settings.level}</span>
          </label>
          <input
            id="level"
            type="range"
            min="1"
            max="100"
            value={settings.level}
            onChange={e => onSettingsChange({ ...settings, level: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <button
          onClick={onProcess}
          disabled={isProcessing || !hasImage}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? 'Đang xử lý...' : 'Làm sạch nền'}
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

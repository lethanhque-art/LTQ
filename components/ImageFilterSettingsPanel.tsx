
import React from 'react';
import { type ImageFilterSettings } from '../types';

interface ImageFilterSettingsPanelProps {
  settings: ImageFilterSettings;
  onSettingsChange: (settings: ImageFilterSettings) => void;
  onProcess: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export const ImageFilterSettingsPanel: React.FC<ImageFilterSettingsPanelProps> = ({ settings, onSettingsChange, onProcess, onReset, isProcessing, hasImage }) => {
  const filters: ImageFilterSettings['filter'][] = ['Sepia', 'Grayscale', 'Invert', 'Posterize'];

  return (
    <aside className="w-80 bg-slate-800/50 border-l border-slate-700/50 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Bộ lọc ảnh</h2>
        <p className="text-xs text-slate-400 mt-1">Áp dụng các bộ lọc nghệ thuật cơ bản để thay đổi giao diện ảnh của bạn.</p>
      </div>
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <label htmlFor="filter" className="block text-sm font-medium text-slate-300 mb-1">Chọn bộ lọc</label>
          <select
            id="filter"
            value={settings.filter}
            onChange={e => onSettingsChange({ ...settings, filter: e.target.value as ImageFilterSettings['filter'] })}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
          >
            {filters.map(filter => (
              <option key={filter} value={filter}>{filter}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <button
          onClick={onProcess}
          disabled={isProcessing || !hasImage}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? 'Đang xử lý...' : 'Áp dụng bộ lọc'}
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

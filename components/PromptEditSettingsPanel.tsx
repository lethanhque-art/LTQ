import React from 'react';
import { type PromptEditSettings } from '../types';

interface PromptEditSettingsPanelProps {
  settings: PromptEditSettings;
  onSettingsChange: (settings: PromptEditSettings) => void;
  onProcess: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export const PromptEditSettingsPanel: React.FC<PromptEditSettingsPanelProps> = ({ settings, onSettingsChange, onProcess, onReset, isProcessing, hasImage }) => {
  return (
    <aside className="w-80 bg-slate-800/50 border-l border-slate-700/50 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Chỉnh sửa theo Prompt</h2>
        <p className="text-xs text-slate-400 mt-1">Mô tả bất kỳ thay đổi nào bạn muốn. Càng chi tiết, kết quả càng chính xác.</p>
      </div>
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-1">Yêu cầu của bạn</label>
          <textarea
            id="prompt"
            rows={8}
            value={settings.prompt}
            onChange={e => onSettingsChange({ ...settings, prompt: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder='Ví dụ: "thay đổi màu áo thành màu đỏ", "thêm một chiếc mũ cao bồi cho người trong ảnh", "làm cho ảnh trông giống một bức tranh sơn dầu"...'
          />
        </div>
      </div>
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <button
          onClick={onProcess}
          disabled={isProcessing || !hasImage}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? 'Đang xử lý...' : 'Thực hiện'}
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

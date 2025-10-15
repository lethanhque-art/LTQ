import React from 'react';
import { type IDPhotoSettings } from '../types';

const ToggleSwitch: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm text-slate-300">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className={`block w-10 h-6 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-slate-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
    </div>
  </label>
);

interface IDPhotoSettingsPanelProps {
  settings: IDPhotoSettings;
  onSettingsChange: (settings: IDPhotoSettings) => void;
  onProcess: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export const IDPhotoSettingsPanel: React.FC<IDPhotoSettingsPanelProps> = ({ settings, onSettingsChange, onProcess, onReset, isProcessing, hasImage }) => {
  return (
    <aside className="w-80 bg-slate-800/50 border-l border-slate-700/50 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Chỉnh sửa ảnh thẻ</h2>
        <p className="text-xs text-slate-400 mt-1">Tạo ảnh thẻ chuyên nghiệp từ ảnh chân dung của bạn.</p>
      </div>
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <label htmlFor="background" className="block text-sm font-medium text-slate-300 mb-1">Màu nền</label>
          <select id="background" value={settings.background} onChange={e => onSettingsChange({...settings, background: e.target.value as IDPhotoSettings['background']})} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500">
            <option>Xanh</option>
            <option>Trắng</option>
          </select>
        </div>
        <ToggleSwitch
          label="Chuẩn hóa trang phục"
          checked={settings.standardizeClothing}
          onChange={(checked) => onSettingsChange({ ...settings, standardizeClothing: checked })}
        />
        <p className="text-xs text-slate-400 -mt-2">AI sẽ thử thay trang phục thường ngày thành áo sơ mi.</p>
      </div>
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <button
          onClick={onProcess}
          disabled={isProcessing || !hasImage}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? 'Đang xử lý...' : 'Tạo ảnh thẻ'}
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

import React from 'react';
import { type DocumentRestorationSettings } from '../types';

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

interface DocumentRestorationSettingsPanelProps {
  settings: DocumentRestorationSettings;
  onSettingsChange: (settings: DocumentRestorationSettings) => void;
  onProcess: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export const DocumentRestorationSettingsPanel: React.FC<DocumentRestorationSettingsPanelProps> = ({ settings, onSettingsChange, onProcess, onReset, isProcessing, hasImage }) => {
  return (
    <aside className="w-80 bg-slate-800/50 border-l border-slate-700/50 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Phục chế giấy tờ</h2>
        <p className="text-xs text-slate-400 mt-1">Làm rõ nét chữ, xóa vết bẩn, và làm phẳng các loại giấy tờ, tài liệu.</p>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <ToggleSwitch
          label="Làm rõ nét chữ"
          checked={settings.enhanceText}
          onChange={(checked) => onSettingsChange({ ...settings, enhanceText: checked })}
        />
        <ToggleSwitch
          label="Xóa vết bẩn, nếp gấp"
          checked={settings.removeStains}
          onChange={(checked) => onSettingsChange({ ...settings, removeStains: checked })}
        />
        <ToggleSwitch
          label="Làm phẳng giấy tờ"
          checked={settings.straighten}
          onChange={(checked) => onSettingsChange({ ...settings, straighten: checked })}
        />
      </div>
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <button
          onClick={onProcess}
          disabled={isProcessing || !hasImage}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? 'Đang xử lý...' : 'Phục chế giấy tờ'}
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

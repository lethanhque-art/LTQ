import React from 'react';
import { type UpscaleSettings } from '../types';
import { UPSCALE_METHODS } from '../constants/upscaleMethods';

interface UpscaleSettingsPanelProps {
  settings: UpscaleSettings;
  onSettingsChange: (settings: UpscaleSettings) => void;
  onUpscale: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

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


export const UpscaleSettingsPanel: React.FC<UpscaleSettingsPanelProps> = ({ settings, onSettingsChange, onUpscale, onReset, isProcessing, hasImage }) => {
  return (
    <aside className="w-80 bg-slate-800/50 border-l border-slate-700/50 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Super Enhancement & Upscale</h2>
        <p className="text-xs text-slate-400 mt-1">Increase resolution and restore details to make your images sharper.</p>
      </div>
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <label htmlFor="upscale-method" className="block text-sm font-medium text-slate-300 mb-2">Select Upscale Method</label>
          <select 
            id="upscale-method" 
            value={settings.upscaleMethod} 
            onChange={e => onSettingsChange({...settings, upscaleMethod: e.target.value})} 
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
          >
            {UPSCALE_METHODS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
        
        <div className="pt-4 border-t border-slate-700/50">
          <ToggleSwitch
            label="Xóa Watermark"
            checked={settings.removeWatermark}
            onChange={(checked) => onSettingsChange({ ...settings, removeWatermark: checked })}
          />
        </div>
      </div>
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <button
          onClick={onUpscale}
          disabled={isProcessing || !hasImage}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? 'Processing...' : 'Enhance & Upscale'}
        </button>
        <button
          onClick={onReset}
          disabled={isProcessing}
          className="w-full bg-slate-600 text-slate-200 font-semibold py-2.5 px-4 rounded-md text-sm transition-colors hover:bg-slate-700 disabled:bg-slate-500 disabled:cursor-not-allowed">
          Reset
        </button>
      </div>
    </aside>
  );
};

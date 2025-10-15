import React from 'react';

interface AutoColorSettingsPanelProps {
  onProcess: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export const AutoColorSettingsPanel: React.FC<AutoColorSettingsPanelProps> = ({ onProcess, onReset, isProcessing, hasImage }) => {
  return (
    <aside className="w-80 bg-slate-800/50 border-l border-slate-700/50 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Tự động chỉnh màu</h2>
        <p className="text-xs text-slate-400 mt-1">Tự động cân bằng màu sắc, độ sáng và độ tương phản để ảnh trông đẹp nhất.</p>
      </div>
      <div className="flex-1 p-4 flex items-center justify-center text-center">
        <p className="text-sm text-slate-400">Nhấn nút bên dưới để AI tự động phân tích và chỉnh màu cho ảnh của bạn.</p>
      </div>
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <button
          onClick={onProcess}
          disabled={isProcessing || !hasImage}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? 'Đang xử lý...' : 'Chỉnh màu tự động'}
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

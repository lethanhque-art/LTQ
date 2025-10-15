
import React from 'react';

const menuItems = [
  { name: 'Chỉnh sửa ảnh thẻ', icon: 'id-card' },
  { name: 'Phục chế ảnh cũ', icon: 'restore' },
  { name: 'Phục chế giấy tờ', icon: 'document' },
  { name: 'Ảnh cưới AI', icon: 'heart' },
  { name: 'Tạo ảnh Trend', icon: 'trend' },
  { name: 'Thay nền', icon: 'background' },
  { name: 'Làm sạch nền', icon: 'clean' },
  { name: 'Làm nét ảnh', icon: 'sharpen', active: true },
  { name: 'Làm mịn da', icon: 'smooth' },
  { name: 'Xoay thẳng mặt', icon: 'rotate' },
  { name: 'Ảnh đen trắng', icon: 'bw' },
  { name: 'Màu Preset', icon: 'filter' },
  { name: 'Tự động chỉnh màu', icon: 'auto-color' },
  { name: 'Chỉnh sửa theo Prompt', icon: 'text' },
];

const Icon = ({ name }: { name: string }) => {
  const icons: { [key: string]: React.ReactNode } = {
    restore: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>,
    'id-card': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 2l7.997 3.884A2 2 0 0119 7.851V16a2 2 0 01-2 2H3a2 2 0 01-2-2V7.851a2 2 0 011.003-1.967zM12 12a2 2 0 100-4 2 2 0 000 4z" /><path d="M4 13.5a4 4 0 018 0v.5H4v-.5z" /></svg>,
    document: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>,
    heart: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>,
    trend: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>,
    background: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>,
    clean: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L8 5.482a1 1 0 01-.944.659l-2.37.094c-1.64.065-2.29 2.13-1.09 3.22l1.78 1.636a1 1 0 01-.33 1.702l-1.99 1.05c-1.46.77-1.02 2.92.57 3.42l2.36.72a1 1 0 01.76.994l.32 2.45c.23 1.71 2.52 1.71 2.75 0l.32-2.45a1 1 0 01.76-.994l2.36-.72c1.59-.49 2.02-2.65.57-3.42l-1.99-1.05a1 1 0 01-.33-1.702l1.78-1.636c1.2-1.1 1.55-3.15-.09-3.22l-2.37-.094a1 1 0 01-.944-.659L11.49 3.17z" clipRule="evenodd" /></svg>,
    sharpen: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>,
    smooth: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5z" /></svg>,
    rotate: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>,
    bw: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 2a8 8 0 100 16V2z" /></svg>,
    filter: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>,
    'auto-color': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h14a1 1 0 011 1v4.293zM5 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>,
    text: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm1.5 5.5a.5.5 0 01.5-.5H8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" clipRule="evenodd" /></svg>,
  };
  return icons[name] || null;
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-800/50 border-r border-slate-700/50 flex-shrink-0 p-4 overflow-y-auto">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              item.active
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Icon name={item.icon} />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

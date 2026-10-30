import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, RotateCcw, Info, Maximize2 } from 'lucide-react';

interface TextbookReferenceModalProps {
  onClose: () => void;
}

export const TextbookReferenceModal: React.FC<TextbookReferenceModalProps> = ({ onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-6xl max-h-[94vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Interactive Controls */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Bảng Tuần Hoàn Sách Giáo Khoa (Khổ Ngang Chuẩn)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Khổ nằm ngang dễ theo dõi
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ảnh gốc SGK Hóa học GDPT 2018 (IUPAC) • Kết nối tri thức với cuộc sống
              </p>
            </div>
          </div>

          {/* Interactive Zoom and Rotate Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700/80 gap-1">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                title="Phóng to (+25%)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-bold text-cyan-300 px-1 min-w-[36px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                title="Thu nhỏ (-25%)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-slate-700 mx-0.5" />
              <button
                type="button"
                onClick={handleRotate}
                className="p-1.5 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition cursor-pointer"
                title="Xoay 90 độ"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                title="Đặt lại góc nhìn ban đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Content Container with Smooth Scroll & Pan */}
        <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-6 bg-slate-950 flex items-center justify-center select-none">
          <div 
            className="transition-transform duration-200 ease-out flex items-center justify-center max-w-full"
            style={{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            <img 
              src="/assets/aistudio/image_textbook_horizontal.png" 
              onError={(e) => {
                // Fallback to original path if needed
                (e.target as HTMLImageElement).src = '/assets/aistudio/image_46f3580e.png';
              }}
              alt="Bảng tuần hoàn các nguyên tố hóa học SGK (Khổ ngang)" 
              className="w-auto h-auto max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800 select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Footer Note with Legend and IUPAC Attribution */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-300 font-semibold">Quy ước màu SGK:</span>
            <span className="inline-flex items-center gap-1 text-cyan-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Kim loại
            </span>
            <span className="inline-flex items-center gap-1 text-rose-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Phi kim
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Khí hiếm
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 hidden md:inline">
              Nguồn: IUPAC & SGK Hóa học Kết nối tri thức (GDPT 2018)
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer transition active:scale-95"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { BroadCategory, ElementCategory, DisplayMode } from '../types/element';
import { BROAD_CATEGORIES } from '../data/elementsData';
import { 
  Search, Thermometer, Sparkles, SlidersHorizontal, 
  HelpCircle, Eye, GitCompare, RefreshCw, Gamepad2, CheckSquare, Square,
  GraduationCap, BookOpen, Star, RotateCcw
} from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredCategory: BroadCategory | 'all' | ElementCategory;
  setFilteredCategory: (c: BroadCategory | 'all' | ElementCategory) => void;
  filteredState: 'all' | 'solid' | 'liquid' | 'gas';
  setFilteredState: (s: 'all' | 'solid' | 'liquid' | 'gas') => void;
  displayMode: DisplayMode;
  setDisplayMode: (m: DisplayMode) => void;
  isTempMode: boolean;
  setIsTempMode: (val: boolean) => void;
  temperatureK: number;
  setTemperatureK: (temp: number) => void;
  isCompareMode: boolean;
  setIsCompareMode: (val: boolean) => void;
  compareSelectedCount: number;
  isTHCSMode: boolean;
  setIsTHCSMode: (val: boolean) => void;
  onOpenTHCSLearning: () => void;
  onOpenGame: () => void;
  onOpenCompare: () => void;
  onOpenTextbookImage: () => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  filteredCategory,
  setFilteredCategory,
  filteredState,
  setFilteredState,
  displayMode,
  setDisplayMode,
  isTempMode,
  setIsTempMode,
  temperatureK,
  setTemperatureK,
  isCompareMode,
  setIsCompareMode,
  compareSelectedCount,
  isTHCSMode,
  setIsTHCSMode,
  onOpenTHCSLearning,
  onOpenGame,
  onOpenCompare,
  onOpenTextbookImage,
  onResetFilters,
}) => {
  const tempCelsius = (temperatureK - 273.15).toFixed(0);

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    filteredCategory !== 'all' || 
    filteredState !== 'all' || 
    isTempMode;

  return (
    <div className="w-full bg-slate-900/95 border-b border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 shadow-md text-slate-200">
      <div className="max-w-[1500px] mx-auto space-y-2.5">
        
        {/* ROW 1: Search + Category Filters + Action Suite (Cleanly spaced and wrapped) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Left: Search input + Clear / Reset */}
          <div className="flex items-center gap-2 flex-1 min-w-[220px] max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kí hiệu (Fe), tên (Sắt/Iron), số Z (26)..."
                className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-sm px-1 cursor-pointer"
                  title="Xóa tìm kiếm"
                >
                  ×
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 border border-slate-700 transition cursor-pointer flex-shrink-0"
                title="Đặt lại toàn bộ bộ lọc"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Center: 3 Textbook Broad Categories */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFilteredCategory('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filteredCategory === 'all'
                  ? 'bg-slate-200 text-slate-950 shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Tất cả
            </button>

            {BROAD_CATEGORIES.map((cat) => {
              const isActive = filteredCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilteredCategory(isActive ? 'all' : cat.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? `${cat.bgClass} ring-2 ring-white/30 shadow-md`
                      : 'bg-slate-800/70 text-slate-300 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: cat.color }} 
                  />
                  <span>{cat.nameVi}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Key Educational & Comparative Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* THCS Focus Mode Switch */}
            <button
              type="button"
              onClick={() => setIsTHCSMode(!isTHCSMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer shadow-sm ${
                isTHCSMode
                  ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/40 font-extrabold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Chế độ học KHTN THCS: Làm nổi bật 20 nguyên tố đầu và các kim loại thông dụng môn Hóa"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{isTHCSMode ? '★ Tiêu điểm THCS: Bật' : 'Chế độ THCS'}</span>
            </button>

            {/* Compare Selector Toggle */}
            <button
              type="button"
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                isCompareMode
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 ring-2 ring-cyan-400/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Bật/tắt chế độ tích chọn trực tiếp các nguyên tố trên bảng để so sánh"
            >
              {isCompareMode ? (
                <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>Chọn so sánh</span>
              {compareSelectedCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px]">
                  {compareSelectedCount}
                </span>
              )}
            </button>

            {/* Compare Table Modal trigger */}
            <button
              type="button"
              onClick={onOpenCompare}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
              title="Mở bảng so sánh chuyên sâu các nguyên tố"
            >
              <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Bảng so sánh</span>
            </button>

            {/* SGK Original Reference Image */}
            <button
              type="button"
              onClick={onOpenTextbookImage}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
              title="Xem ảnh chụp trang Bảng tuần hoàn trong Sách giáo khoa"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Bảng SGK</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Display Mode Selector + State Filter + Temperature Simulation */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/70 text-xs">
          
          {/* Group A: Display Mode on Cells */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap hidden sm:inline">
              Hiển thị ô:
            </span>
            <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setDisplayMode('standard')}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                  displayMode === 'standard'
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Khối lượng nguyên tử được làm tròn theo sách giáo khoa THCS"
              >
                Khối lượng SGK
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('mass')}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                  displayMode === 'mass'
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Khối lượng nguyên tử chính xác theo chuẩn IUPAC"
              >
                Khối lượng chuẩn
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('shells')}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                  displayMode === 'shells'
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Số electron trên từng lớp [K, L, M, N...]"
              >
                Lớp Electron
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('valency')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                  displayMode === 'valency'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'text-amber-300 hover:text-amber-100 bg-amber-950/40 border border-amber-500/30'
                }`}
                title="Hóa trị phổ biến theo chương trình KHTN 7-9 THCS"
              >
                ★ Hóa trị THCS
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('particles')}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                  displayMode === 'particles'
                    ? 'bg-rose-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Số hạt proton (p) và neutron (n) trong hạt nhân"
              >
                Hạt (p, n)
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('electronegativity')}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                  displayMode === 'electronegativity'
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Độ âm điện theo thang Pauling"
              >
                Độ âm điện
              </button>
            </div>
          </div>

          {/* Group B & C: State of Matter & Temperature Slider */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* State of matter filter */}
            <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 px-1.5 whitespace-nowrap hidden md:inline">
                Trạng thái:
              </span>
              <button
                type="button"
                onClick={() => setFilteredState('all')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  filteredState === 'all' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setFilteredState('solid')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  filteredState === 'solid' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-400/80 hover:text-emerald-300'
                }`}
              >
                Rắn
              </button>
              <button
                type="button"
                onClick={() => setFilteredState('liquid')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  filteredState === 'liquid' ? 'bg-blue-600 text-white font-bold' : 'text-blue-400/80 hover:text-blue-300'
                }`}
              >
                Lỏng
              </button>
              <button
                type="button"
                onClick={() => setFilteredState('gas')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  filteredState === 'gas' ? 'bg-rose-600 text-white font-bold' : 'text-rose-400/80 hover:text-rose-300'
                }`}
              >
                Khí
              </button>
            </div>

            {/* Temperature simulation slider */}
            <div className="inline-flex items-center gap-1.5 bg-slate-950 p-1 px-2.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setIsTempMode(!isTempMode)}
                className={`flex items-center gap-1 text-[11px] font-bold transition cursor-pointer ${
                  isTempMode ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mô phỏng thay đổi trạng thái theo nhiệt độ"
              >
                <Thermometer className="w-3.5 h-3.5" />
                <span>{isTempMode ? 'Nhiệt độ' : 'Thước nhiệt độ'}</span>
              </button>

              {isTempMode && (
                <div className="flex items-center gap-2 ml-1 pl-2 border-l border-slate-800">
                  <input
                    type="range"
                    min="0"
                    max="6000"
                    step="50"
                    value={temperatureK}
                    onChange={(e) => setTemperatureK(parseInt(e.target.value))}
                    className="w-20 sm:w-28 accent-amber-400 cursor-pointer"
                  />
                  <span className="font-mono text-[11px] text-amber-300 font-bold whitespace-nowrap">
                    {temperatureK} K ({tempCelsius}°C)
                  </span>
                  <button
                    type="button"
                    onClick={() => setTemperatureK(298)}
                    className="text-[10px] text-slate-400 hover:text-white px-1 underline cursor-pointer"
                    title="Đặt về nhiệt độ phòng 25°C"
                  >
                    25°C
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

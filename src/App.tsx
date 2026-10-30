import React, { useState, useMemo } from 'react';
import { getAllElements, getElementByNumber } from './data/elementsData';
import { ElementData, BroadCategory, ElementCategory, DisplayMode } from './types/element';
import { PeriodicTable } from './components/PeriodicTable';
import { FilterBar } from './components/FilterBar';
import { ElementModal } from './components/ElementModal';
import { CompareModal } from './components/CompareModal';
import { ChemistryGameModal } from './components/ChemistryGameModal';
import { TextbookReferenceModal } from './components/TextbookReferenceModal';
import { THCSLearningModal } from './components/THCSLearningModal';
import { 
  Atom, Sparkles, Shuffle, BookOpen, Layers, Info, CheckCircle2, 
  GitCompare, X, Gamepad2, Volume2, GraduationCap, Star, Eye
} from 'lucide-react';
import { speakElementName } from './utils/audio';

export default function App() {
  const allElements = useMemo(() => getAllElements(), []);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCategory, setFilteredCategory] = useState<BroadCategory | 'all' | ElementCategory>('all');
  const [filteredState, setFilteredState] = useState<'all' | 'solid' | 'liquid' | 'gas'>('all');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('standard');
  const [isTempMode, setIsTempMode] = useState<boolean>(false);
  const [temperatureK, setTemperatureK] = useState<number>(298); // 25°C room temp
  const [highlightedPeriod, setHighlightedPeriod] = useState<number | null>(null);
  const [highlightedGroup, setHighlightedGroup] = useState<number | null>(null);

  // Secondary School (THCS) Mode Focus
  const [isTHCSMode, setIsTHCSMode] = useState<boolean>(true); // Enabled by default for THCS students!

  // Multi-element comparison state (empty by default so floating dock only appears when user selects)
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [compareSelectedNums, setCompareSelectedNums] = useState<number[]>([]);

  // Modals & Active elements
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [hoveredElement, setHoveredElement] = useState<ElementData | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);
  const [gameModalOpen, setGameModalOpen] = useState<boolean>(false);
  const [textbookModalOpen, setTextbookModalOpen] = useState<boolean>(false);
  const [thcsLearningOpen, setTHCSLearningOpen] = useState<boolean>(false);

  // Toggle element in multi-element comparison tray
  const handleToggleCompare = (element: ElementData) => {
    if (compareSelectedNums.includes(element.number)) {
      if (compareSelectedNums.length <= 1) {
        setCompareSelectedNums([]);
      } else {
        setCompareSelectedNums(compareSelectedNums.filter((n) => n !== element.number));
      }
    } else {
      if (compareSelectedNums.length >= 6) {
        alert('Bạn có thể chọn tối đa 6 nguyên tố cùng lúc để so sánh!');
        return;
      }
      setCompareSelectedNums([...compareSelectedNums, element.number]);
    }
  };

  // Open modal for a specific atomic number
  const handleSelectElementByNumber = (num: number) => {
    const el = getElementByNumber(num);
    setSelectedElement(el);
  };

  // Random element discovery
  const handleRandomElement = () => {
    const randNum = Math.floor(Math.random() * 118) + 1;
    handleSelectElementByNumber(randNum);
  };

  // Trigger compare from element modal
  const handleCompareWith = (element: ElementData) => {
    if (!compareSelectedNums.includes(element.number)) {
      setCompareSelectedNums([...compareSelectedNums, element.number]);
    }
    setSelectedElement(null);
    setCompareModalOpen(true);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilteredCategory('all');
    setFilteredState('all');
    setIsTempMode(false);
    setTemperatureK(298);
    setHighlightedPeriod(null);
    setHighlightedGroup(null);
  };

  // Map numbers to elements for compare modal
  const compareElements = useMemo(() => {
    return compareSelectedNums
      .map((num) => allElements.find((e) => e.number === num))
      .filter((e): e is ElementData => e !== undefined);
  }, [compareSelectedNums, allElements]);

  // Active element preview (hovered or selected)
  const previewElement = hoveredElement || selectedElement || allElements[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white pb-28 sm:pb-32">
      
      {/* Unified Top Sticky Container (Header + Toolbar) - Locked together so toolbar is NEVER covered by content */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        {/* Top Main Navigation / Header */}
        <header className="px-3 sm:px-6 py-2 flex items-center justify-between gap-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white flex-shrink-0">
              <Atom className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-white tracking-wide truncate">
                  BẢNG TUẦN HOÀN HOÁ HỌC ĐỘNG
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
                  GDPT 2018 • IUPAC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                Mô hình nguyên tử 3D electron chính xác & Ứng dụng thực tế sinh động KHTN THCS
              </p>
            </div>
          </div>

          {/* Header Actions Suite: Learning Hub, Game, Random Discovery */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* THCS Learning Hub */}
            <button
              type="button"
              onClick={() => setTHCSLearningOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition active:scale-95 cursor-pointer"
              title="Cẩm nang KHTN 7-9: 20 nguyên tố đầu, quy tắc lớp electron, hóa trị và bài tập ôn thi"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Góc Học Tập KHTN 7-9</span>
              <span className="sm:hidden">Học KHTN</span>
            </button>

            {/* Game button */}
            <button
              type="button"
              onClick={() => setGameModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-900/40 transition active:scale-95 cursor-pointer"
              title="Trò chơi Ô chữ & Câu đố Hóa học theo mức độ"
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">Trò chơi Hóa học</span>
              <span className="sm:hidden">Trò chơi</span>
            </button>

            {/* Random discovery */}
            <button
              type="button"
              onClick={handleRandomElement}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-sm transition active:scale-95 cursor-pointer flex-shrink-0"
              title="Khám phá ngẫu nhiên một nguyên tố"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Khám phá ngẫu nhiên</span>
            </button>
          </div>
        </header>

        {/* Filter and Control Bar (Glued to header in single sticky context, impossible to collide) */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredCategory={filteredCategory}
          setFilteredCategory={setFilteredCategory}
          filteredState={filteredState}
          setFilteredState={setFilteredState}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          isTempMode={isTempMode}
          setIsTempMode={setIsTempMode}
          temperatureK={temperatureK}
          setTemperatureK={setTemperatureK}
          isCompareMode={isCompareMode}
          setIsCompareMode={setIsCompareMode}
          compareSelectedCount={compareSelectedNums.length}
          isTHCSMode={isTHCSMode}
          setIsTHCSMode={setIsTHCSMode}
          onOpenTHCSLearning={() => setTHCSLearningOpen(true)}
          onOpenGame={() => setGameModalOpen(true)}
          onOpenCompare={() => setCompareModalOpen(true)}
          onOpenTextbookImage={() => setTextbookModalOpen(true)}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* THCS Focus Mode Educational Helper Banner (Organized responsive row) */}
      {isTHCSMode && (
        <div className="px-3 sm:px-6 py-2 bg-gradient-to-r from-emerald-950/80 via-teal-950/50 to-slate-900 border-b border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-sm flex-shrink-0">
              <Star className="w-3 h-3 fill-slate-950" />
              <span>TIÊU ĐIỂM KHTN THCS</span>
            </span>
            <span className="text-emerald-200 font-medium">
              Đang làm nổi bật <strong className="text-white font-bold">20 nguyên tố đầu (Z = 1 → 20)</strong> và các kim loại thông dụng (Fe, Cu, Al, Zn, Ag, Au...). Các nguyên tố phóng xạ nhân tạo được làm mờ để các em dễ học.
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setDisplayMode(displayMode === 'valency' ? 'standard' : 'valency')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{displayMode === 'valency' ? '✓ Đang hiện Hóa trị' : 'Hiện Hóa trị trên ô'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTHCSMode(false)}
              className="text-slate-400 hover:text-slate-200 text-[11px] px-1.5 py-0.5 rounded hover:bg-slate-800 transition cursor-pointer"
              title="Tắt chế độ tiêu điểm THCS để xem bảng đầy đủ"
            >
              Tắt tiêu điểm
            </button>
          </div>
        </div>
      )}

      {/* Quick Legend & Sample Tile Guide Bar */}
      <div className="px-3 sm:px-6 py-1.5 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Sample Tile Legend Guide */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-semibold text-[11px] hidden sm:inline">
            Quy ước ô:
          </span>
          <div className="inline-flex items-center gap-1.5 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
            <span className="text-cyan-400 font-bold" title="Số hiệu nguyên tử Z (số proton, electron)">2 (Số Z)</span>
            <span className="text-slate-600">|</span>
            <span className="text-white font-black text-xs font-sans" title="Kí hiệu hoá học">He</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-sans" title="Tên IUPAC">helium</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-300" title="Khối lượng nguyên tử">4 (M)</span>
          </div>
        </div>

        {/* Quick Hint */}
        <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span className="truncate">
            {isCompareMode 
              ? 'Chế độ so sánh: Nhấp chọn các nguyên tố trên bảng để xem bảng so sánh đa nguyên tố!' 
              : 'Nhấp chuột vào bất kì ô nguyên tố nào để mở mô hình 3D nguyên tử & ảnh ứng dụng thực tế sinh động!'}
          </span>
        </div>
      </div>

      {/* Main Periodic Table View */}
      <main className="flex-1 p-2 sm:p-4 overflow-y-auto">
        <PeriodicTable
          elements={allElements}
          selectedElement={selectedElement}
          filteredCategory={filteredCategory}
          filteredState={filteredState}
          searchQuery={searchQuery}
          displayMode={displayMode}
          currentTemperatureK={isTempMode ? temperatureK : undefined}
          highlightedPeriod={highlightedPeriod}
          highlightedGroup={highlightedGroup}
          isCompareMode={isCompareMode}
          isTHCSMode={isTHCSMode}
          compareSelectedNums={compareSelectedNums}
          onSelectElement={(el) => setSelectedElement(el)}
          onToggleCompareElement={handleToggleCompare}
          onHoverElement={(el) => setHoveredElement(el)}
        />
      </main>

      {/* Floating Multi-Element Comparison Dock (Positioned cleanly above footer) */}
      {compareSelectedNums.length > 0 && (
        <aside 
          aria-label="Khay so sánh nguyên tố" 
          className="fixed bottom-16 sm:bottom-14 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-3xl pointer-events-none"
        >
          <div className="p-2.5 sm:p-3 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-cyan-500/50 shadow-2xl flex flex-wrap items-center justify-between gap-2.5 pointer-events-auto">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 flex-shrink-0">
                <GitCompare className="w-4 h-4 text-cyan-400" />
                Đã chọn ({compareSelectedNums.length}/6):
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {compareSelectedNums.map((num) => {
                  const el = allElements.find((e) => e.number === num);
                  if (!el) return null;

                  return (
                    <span
                      key={num}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <span>{el.symbol}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({el.name})</span>
                      <button
                        type="button"
                        onClick={() => handleToggleCompare(el)}
                        className="text-slate-400 hover:text-rose-400 ml-0.5 cursor-pointer"
                        title="Xóa khỏi danh sách"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setCompareModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition active:scale-95 cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Xem Bảng So Sánh</span>
              </button>

              <button
                type="button"
                onClick={() => setCompareSelectedNums([])}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer text-xs"
                title="Xóa tất cả lựa chọn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Sticky Bottom Quick-Info Inspection Bar (Truncated and responsive, no text clipping) */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md px-3 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs text-slate-300 z-20 shadow-lg">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center font-bold flex-shrink-0">
            <span className="text-[9px] text-cyan-400 leading-none">{previewElement.number}</span>
            <span className="text-sm leading-none text-white">{previewElement.symbol}</span>
          </div>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-1.5 flex-wrap truncate">
              <strong className="text-white text-sm whitespace-nowrap">{previewElement.name}</strong>
              <button
                type="button"
                onClick={() => speakElementName(previewElement.name)}
                className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition cursor-pointer flex-shrink-0"
                title={`Nghe phát âm IUPAC: ${previewElement.name}`}
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              {previewElement.ipaPronunciation && (
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 border border-purple-800/50 px-1 py-0.2 rounded hidden md:inline">
                  {previewElement.ipaPronunciation}
                </span>
              )}
              <span className="text-slate-400 text-xs hidden lg:inline">
                {previewElement.vietnameseTraditionalName ? `(tên cũ: ${previewElement.vietnameseTraditionalName})` : `(${previewElement.vietnameseName})`}
              </span>
              {previewElement.vietnamesePhonetics && (
                <span className="text-[11px] text-emerald-400 font-sans hidden sm:inline">
                  • Đọc: <em>{previewElement.vietnamesePhonetics}</em>
                </span>
              )}
              {previewElement.valency && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30 whitespace-nowrap">
                  Hóa trị: {previewElement.valency}
                </span>
              )}
              <span className="text-slate-500 hidden xl:inline">•</span>
              <span className="text-slate-300 hidden xl:inline">Nhóm {previewElement.groupRoman}, Chu kì {previewElement.period}</span>
              <span className="text-slate-500 hidden xl:inline">•</span>
              <span className="text-cyan-300 font-mono hidden xl:inline">[{previewElement.electronsPerShell.join(', ')}]</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Ứng dụng: {previewElement.applications[0]?.title || previewElement.summaryVi}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSelectedElement(previewElement)}
          className="whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex-shrink-0 transition active:scale-95 cursor-pointer shadow-md shadow-cyan-600/30"
        >
          <span className="hidden sm:inline">Mô hình 3D & Chi tiết</span>
          <span className="sm:hidden">Chi tiết 3D</span> ({previewElement.symbol})
        </button>
      </footer>

      {/* Modals */}
      {selectedElement && (
        <ElementModal
          element={selectedElement}
          isCompareSelected={compareSelectedNums.includes(selectedElement.number)}
          onToggleCompare={() => handleToggleCompare(selectedElement)}
          onClose={() => setSelectedElement(null)}
          onSelectElement={handleSelectElementByNumber}
          onCompareWith={handleCompareWith}
        />
      )}

      {compareModalOpen && (
        <CompareModal
          initialElements={compareElements}
          onClose={() => setCompareModalOpen(false)}
          onSelectElement={(el) => setSelectedElement(el)}
        />
      )}

      {gameModalOpen && (
        <ChemistryGameModal
          onClose={() => setGameModalOpen(false)}
          onSelectElement={(el) => setSelectedElement(el)}
        />
      )}

      {textbookModalOpen && (
        <TextbookReferenceModal
          onClose={() => setTextbookModalOpen(false)}
        />
      )}

      {thcsLearningOpen && (
        <THCSLearningModal
          onClose={() => setTHCSLearningOpen(false)}
          onSelectElement={(el) => setSelectedElement(el)}
        />
      )}
    </div>
  );
}

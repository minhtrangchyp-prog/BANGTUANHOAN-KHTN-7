import React from 'react';
import { ElementData, BroadCategory, ElementCategory, DisplayMode } from '../types/element';
import { ElementCell } from './ElementCell';

interface PeriodicTableProps {
  elements: ElementData[];
  selectedElement: ElementData | null;
  filteredCategory: BroadCategory | 'all' | ElementCategory;
  filteredState: 'all' | 'solid' | 'liquid' | 'gas';
  searchQuery: string;
  displayMode: DisplayMode;
  currentTemperatureK?: number;
  highlightedPeriod?: number | null;
  highlightedGroup?: number | null;
  isCompareMode?: boolean;
  isTHCSMode?: boolean;
  compareSelectedNums?: number[];
  onSelectElement: (element: ElementData) => void;
  onToggleCompareElement?: (element: ElementData) => void;
  onHoverElement?: (element: ElementData | null) => void;
}

const GROUPS_HEADER = [
  { roman: 'IA', num: 1 },
  { roman: 'IIA', num: 2 },
  { roman: 'IIIB', num: 3 },
  { roman: 'IVB', num: 4 },
  { roman: 'VB', num: 5 },
  { roman: 'VIB', num: 6 },
  { roman: 'VIIB', num: 7 },
  { roman: 'VIIIB', num: 8 },
  { roman: 'VIIIB', num: 9 },
  { roman: 'VIIIB', num: 10 },
  { roman: 'IB', num: 11 },
  { roman: 'IIB', num: 12 },
  { roman: 'IIIA', num: 13 },
  { roman: 'IVA', num: 14 },
  { roman: 'VA', num: 15 },
  { roman: 'VIA', num: 16 },
  { roman: 'VIIA', num: 17 },
  { roman: 'VIIIA', num: 18 },
];

export const PeriodicTable: React.FC<PeriodicTableProps> = ({
  elements,
  selectedElement,
  filteredCategory,
  filteredState,
  searchQuery,
  displayMode,
  currentTemperatureK,
  highlightedPeriod,
  highlightedGroup,
  isCompareMode = false,
  isTHCSMode = false,
  compareSelectedNums = [],
  onSelectElement,
  onToggleCompareElement,
  onHoverElement,
}) => {
  // Element lookup map by atomic number
  const elementMap = new Map<number, ElementData>();
  elements.forEach((el) => elementMap.set(el.number, el));

  // Determine whether an element matches current filter & search
  const isElementMatched = (el: ElementData): boolean => {
    // Search query match (symbol, name, vietnameseName, or number)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchSymbol = el.symbol.toLowerCase().includes(q);
      const matchName = el.name.toLowerCase().includes(q);
      const matchViName = el.vietnameseName.toLowerCase().includes(q);
      const matchNum = el.number.toString() === q;
      if (!matchSymbol && !matchName && !matchViName && !matchNum) {
        return false;
      }
    }

    // Category filter
    if (filteredCategory !== 'all') {
      if (
        filteredCategory === 'metal' ||
        filteredCategory === 'nonmetal' ||
        filteredCategory === 'noble-gas'
      ) {
        if (el.broadCategory !== filteredCategory) return false;
      } else {
        if (el.category !== filteredCategory) return false;
      }
    }

    // State of matter filter
    if (filteredState !== 'all') {
      if (currentTemperatureK !== undefined) {
        let tempState: 'solid' | 'liquid' | 'gas' = 'solid';
        if (el.meltingPointKelvin && currentTemperatureK < el.meltingPointKelvin) {
          tempState = 'solid';
        } else if (el.boilingPointKelvin && currentTemperatureK >= el.boilingPointKelvin) {
          tempState = 'gas';
        } else if (el.meltingPointKelvin && el.boilingPointKelvin) {
          tempState = 'liquid';
        }
        if (tempState !== filteredState) return false;
      } else {
        if (el.standardState !== filteredState) return false;
      }
    }

    // Highlighted period / group
    if (highlightedPeriod && el.period !== highlightedPeriod) return false;
    if (highlightedGroup && el.group !== highlightedGroup) return false;

    return true;
  };

  // Helper to render an element cell
  const renderCell = (num: number) => {
    const el = elementMap.get(num);
    if (!el) return null;
    const isMatched = isElementMatched(el);
    const isSelected = selectedElement?.number === el.number;
    const isCompareSelected = compareSelectedNums.includes(el.number);

    return (
      <ElementCell
        key={el.number}
        element={el}
        isSelected={isSelected}
        isDimmed={!isMatched}
        isCompareSelected={isCompareSelected}
        isCompareMode={isCompareMode}
        isTHCSMode={isTHCSMode}
        displayMode={displayMode}
        currentTemperatureK={currentTemperatureK}
        onClick={onSelectElement}
        onToggleCompare={onToggleCompareElement}
        onHover={onHoverElement}
      />
    );
  };

  // Lanthanides: 57 to 71
  const lanthanideNumbers = Array.from({ length: 15 }, (_, i) => 57 + i);
  // Actinides: 89 to 103
  const actinideNumbers = Array.from({ length: 15 }, (_, i) => 89 + i);

  return (
    <div className="w-full overflow-x-auto pb-6 select-none">
      <div className="min-w-[1050px] max-w-[1440px] mx-auto px-2">
        {/* Main 18-column Periodic Grid */}
        <div className="grid grid-cols-[38px_repeat(18,_minmax(52px,_1fr))] gap-1.5">
          {/* Header Row: Corner + Groups 1 to 18 (IA - VIIIA) */}
          <div className="flex flex-col items-center justify-center text-[10px] text-slate-400 font-semibold">
            <span>Nhóm</span>
            <span className="text-[9px] text-slate-500">Chu kì</span>
          </div>

          {GROUPS_HEADER.map((grp) => (
            <div
              key={grp.num}
              className={`flex flex-col items-center justify-center p-1 rounded-md text-center transition ${
                highlightedGroup === grp.num
                  ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[11px] font-bold font-mono">{grp.roman}</span>
              <span className="text-[9px] text-slate-500 font-mono">({grp.num})</span>
            </div>
          ))}

          {/* PERIOD 1 */}
          <div className="flex items-center justify-center font-bold text-slate-400 text-sm font-mono">
            1
          </div>
          {renderCell(1)}
          {/* Empty columns 2 to 17 */}
          <div className="col-span-16 grid grid-cols-16 items-center justify-center text-center">
            {/* Can host title banner or subtle watermark */}
            <div className="col-span-16 flex items-center justify-center text-xs text-slate-600 font-medium tracking-widest uppercase">
              BẢNG TUẦN HOÀN CÁC NGUYÊN TỐ HOÁ HỌC • CHƯƠNG TRÌNH GDPT 2018
            </div>
          </div>
          {renderCell(2)}

          {/* PERIOD 2 */}
          <div className="flex items-center justify-center font-bold text-slate-400 text-sm font-mono">
            2
          </div>
          {renderCell(3)}
          {renderCell(4)}
          {/* Empty columns 3 to 12 */}
          <div className="col-span-10" />
          {renderCell(5)}
          {renderCell(6)}
          {renderCell(7)}
          {renderCell(8)}
          {renderCell(9)}
          {renderCell(10)}

          {/* PERIOD 3 */}
          <div className="flex items-center justify-center font-bold text-slate-400 text-sm font-mono">
            3
          </div>
          {renderCell(11)}
          {renderCell(12)}
          {/* Empty columns 3 to 12 */}
          <div className="col-span-10" />
          {renderCell(13)}
          {renderCell(14)}
          {renderCell(15)}
          {renderCell(16)}
          {renderCell(17)}
          {renderCell(18)}

          {/* PERIOD 4 */}
          <div className="flex items-center justify-center font-bold text-slate-400 text-sm font-mono">
            4
          </div>
          {Array.from({ length: 18 }, (_, i) => 19 + i).map((num) => renderCell(num))}

          {/* PERIOD 5 */}
          <div className="flex items-center justify-center font-bold text-slate-400 text-sm font-mono">
            5
          </div>
          {Array.from({ length: 18 }, (_, i) => 37 + i).map((num) => renderCell(num))}

          {/* PERIOD 6 */}
          <div className="flex items-center justify-center font-bold text-slate-400 text-sm font-mono">
            6
          </div>
          {renderCell(55)}
          {renderCell(56)}
          {/* Lanthanide Marker Box */}
          <div className="w-full aspect-square min-w-[50px] min-h-[50px] p-1 rounded-lg border border-teal-500/40 bg-teal-950/30 flex flex-col justify-center items-center text-center">
            <span className="text-[10px] font-mono font-bold text-teal-300">57-71</span>
            <span className="text-[10px] font-bold text-teal-200">La-Lu</span>
            <span className="text-[8px] text-teal-400/80">Lanthanide</span>
          </div>
          {Array.from({ length: 15 }, (_, i) => 72 + i).map((num) => renderCell(num))}

          {/* PERIOD 7 */}
          <div className="flex items-center justify-center font-bold text-slate-400 text-sm font-mono">
            7
          </div>
          {renderCell(87)}
          {renderCell(88)}
          {/* Actinide Marker Box */}
          <div className="w-full aspect-square min-w-[50px] min-h-[50px] p-1 rounded-lg border border-emerald-500/40 bg-emerald-950/30 flex flex-col justify-center items-center text-center">
            <span className="text-[10px] font-mono font-bold text-emerald-300">89-103</span>
            <span className="text-[10px] font-bold text-emerald-200">Ac-Lr</span>
            <span className="text-[8px] text-emerald-400/80">Actinide</span>
          </div>
          {Array.from({ length: 15 }, (_, i) => 104 + i).map((num) => renderCell(num))}
        </div>

        {/* Separator / Spacer for Lanthanides & Actinides */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-xs text-slate-400 font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            Các nguyên tố phân lớp f (Họ Lantan và Họ Actini)
          </span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Lanthanide & Actinide Rows */}
        <div className="grid grid-cols-[38px_repeat(18,_minmax(52px,_1fr))] gap-1.5">
          {/* Lanthanide Row */}
          <div className="col-span-1" />
          <div className="col-span-2 flex items-center justify-end pr-2 text-xs font-semibold text-teal-300">
            (*) Lanthanide
          </div>
          <div className="col-span-15 grid grid-cols-15 gap-1.5">
            {lanthanideNumbers.map((num) => renderCell(num))}
          </div>

          {/* Actinide Row */}
          <div className="col-span-1" />
          <div className="col-span-2 flex items-center justify-end pr-2 text-xs font-semibold text-emerald-300">
            (**) Actinide
          </div>
          <div className="col-span-15 grid grid-cols-15 gap-1.5">
            {actinideNumbers.map((num) => renderCell(num))}
          </div>
        </div>
      </div>
    </div>
  );
};

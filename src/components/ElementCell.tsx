import React from 'react';
import { ElementData, BroadCategory, DisplayMode } from '../types/element';

interface ElementCellProps {
  element: ElementData;
  isSelected?: boolean;
  isDimmed?: boolean;
  isCompareSelected?: boolean;
  isCompareMode?: boolean;
  isTHCSMode?: boolean;
  displayMode?: DisplayMode;
  currentTemperatureK?: number;
  onClick: (element: ElementData) => void;
  onToggleCompare?: (element: ElementData) => void;
  onHover?: (element: ElementData | null) => void;
}

export const ElementCell: React.FC<ElementCellProps> = ({
  element,
  isSelected,
  isDimmed,
  isCompareSelected,
  isCompareMode,
  isTHCSMode = false,
  displayMode = 'standard',
  currentTemperatureK,
  onClick,
  onToggleCompare,
  onHover,
}) => {
  // Broad category color scheme based on Vietnamese textbook attached image
  const categoryStyles: Record<BroadCategory, { bg: string; border: string; text: string; glow: string }> = {
    metal: {
      bg: 'bg-cyan-900/35 hover:bg-cyan-700/50',
      border: 'border-cyan-500/40 hover:border-cyan-400',
      text: 'text-cyan-200',
      glow: 'shadow-cyan-500/20',
    },
    nonmetal: {
      bg: 'bg-rose-900/35 hover:bg-rose-700/50',
      border: 'border-rose-500/40 hover:border-rose-400',
      text: 'text-rose-200',
      glow: 'shadow-rose-500/20',
    },
    'noble-gas': {
      bg: 'bg-amber-900/35 hover:bg-amber-700/50',
      border: 'border-amber-500/40 hover:border-amber-400',
      text: 'text-amber-200',
      glow: 'shadow-amber-500/20',
    },
  };

  const style = categoryStyles[element.broadCategory];

  // Dynamic state at current temperature
  let stateAtTemp = element.standardState;
  if (currentTemperatureK !== undefined) {
    if (element.meltingPointKelvin && currentTemperatureK < element.meltingPointKelvin) {
      stateAtTemp = 'solid';
    } else if (
      element.boilingPointKelvin &&
      currentTemperatureK >= element.boilingPointKelvin
    ) {
      stateAtTemp = 'gas';
    } else if (
      element.meltingPointKelvin &&
      element.boilingPointKelvin &&
      currentTemperatureK >= element.meltingPointKelvin &&
      currentTemperatureK < element.boilingPointKelvin
    ) {
      stateAtTemp = 'liquid';
    }
  }

  // Display sub-value depending on user display preference
  const renderSubValue = () => {
    switch (displayMode) {
      case 'mass':
        return <span className="text-[9px] font-mono text-slate-300 truncate">{element.atomicMass}</span>;
      case 'shells':
        return <span className="text-[9px] font-mono text-cyan-300 font-bold truncate">{element.electronsPerShell.join('-')}</span>;
      case 'electronegativity':
        return <span className="text-[9px] font-mono text-amber-300 truncate">{element.electronegativity ?? '-'}</span>;
      case 'valency':
        return (
          <span className="text-[9px] font-mono font-bold text-amber-300 truncate" title={`Hóa trị: ${element.valency}`}>
            HT: {element.valency?.split(' ')[0] || element.valency}
          </span>
        );
      case 'particles': {
        const p = element.number;
        const n = element.number === 17 ? 18 : Math.max(0, Math.round(element.roundedMass - p));
        return (
          <span className="text-[8px] font-mono font-bold leading-tight truncate" title={`Hạt nhân: ${p} proton, ${n} neutron`}>
            <span className="text-rose-400">{p}p</span>·<span className="text-slate-300">{n}n</span>
          </span>
        );
      }
      case 'standard':
      default:
        return <span className="text-[9px] font-mono text-slate-300 truncate">{element.roundedMass}</span>;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompareMode && onToggleCompare) {
      onToggleCompare(element);
    } else {
      onClick(element);
    }
  };

  // Middle school focus dimming
  const shouldDim = isDimmed || (isTHCSMode && !element.isTHCSEssential);

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => onHover && onHover(element)}
      onMouseLeave={() => onHover && onHover(null)}
      title={`${element.number}. ${element.name} (${element.symbol}) • Đọc là: ${element.vietnamesePhonetics || element.name} • NTK: ${element.roundedMass} amu • Hóa trị: ${element.valency || '?'}`}
      className={`relative w-full aspect-square min-w-[50px] min-h-[50px] p-1 rounded-xl border transition-all duration-150 flex flex-col justify-between items-center text-center cursor-pointer select-none group ${
        style.bg
      } ${style.border} ${
        isCompareSelected
          ? 'ring-2 ring-amber-400 bg-amber-500/30 scale-105 z-20 shadow-xl'
          : isSelected 
          ? 'ring-2 ring-white scale-105 z-20 shadow-xl' 
          : shouldDim 
          ? 'opacity-20 grayscale-[70%] scale-95' 
          : 'hover:scale-105 hover:z-10 shadow-sm'
      }`}
    >
      {/* Compare selection indicator badge */}
      {isCompareSelected && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md z-30">
          ✓
        </span>
      )}

      {/* Top row: Z number + THCS Star + State Indicator */}
      <div className="w-full flex items-center justify-between px-0.5 leading-none">
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono font-bold text-slate-300">
            {element.number}
          </span>
          {element.number <= 20 && (
            <span className="text-[8px] text-amber-400 leading-none" title="20 nguyên tố đầu tiên cốt lõi KHTN 7">
              ★
            </span>
          )}
        </div>
        
        {/* State of matter badge dot */}
        {currentTemperatureK !== undefined ? (
          <span 
            className={`w-1.5 h-1.5 rounded-full ${
              stateAtTemp === 'gas' 
                ? 'bg-rose-400' 
                : stateAtTemp === 'liquid' 
                ? 'bg-blue-400' 
                : 'bg-emerald-400'
            }`}
            title={`Trạng thái: ${stateAtTemp === 'gas' ? 'Khí' : stateAtTemp === 'liquid' ? 'Lỏng' : 'Rắn'}`}
          />
        ) : (
          <span className="text-[8px] font-mono text-slate-400">
            {element.groupRoman}
          </span>
        )}
      </div>

      {/* Main Symbol */}
      <span className={`text-base sm:text-lg font-black tracking-tight leading-none ${style.text}`}>
        {element.symbol}
      </span>

      {/* Element Name */}
      <span className="text-[8px] font-medium text-slate-200/90 truncate max-w-full leading-tight">
        {element.name}
      </span>

      {/* Bottom: Mass or Shells */}
      <div className="w-full text-center leading-none">
        {renderSubValue()}
      </div>
    </button>
  );
};

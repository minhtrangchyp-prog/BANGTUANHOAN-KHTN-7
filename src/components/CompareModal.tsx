import React, { useState, useMemo } from 'react';
import { ElementData } from '../types/element';
import { getAllElements, getElementParticleDetails } from '../data/elementsData';
import { speakElementName } from '../utils/audio';
import { ApplicationVisual } from './ApplicationVisual';
import { 
  X, Plus, Trash2, ArrowRightLeft, Sparkles, Layers, 
  HelpCircle, CheckCircle2, AlertCircle, BarChart3, 
  ChevronRight, ArrowRight, ShieldCheck, Zap, Volume2
} from 'lucide-react';

interface CompareModalProps {
  initialElements?: ElementData[];
  onClose: () => void;
  onSelectElement: (element: ElementData) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  initialElements = [],
  onClose,
  onSelectElement,
}) => {
  const allElements = useMemo(() => getAllElements(), []);

  // Selected element list (support 2 to 6 elements)
  const [selectedNums, setSelectedNums] = useState<number[]>(() => {
    if (initialElements.length >= 2) {
      return initialElements.map((e) => e.number);
    }
    if (initialElements.length === 1) {
      // Add a complementary element
      const firstNum = initialElements[0].number;
      const secondNum = firstNum === 11 ? 17 : firstNum === 26 ? 29 : firstNum === 1 ? 8 : 11;
      return [firstNum, secondNum];
    }
    // Default: Sodium (11) and Chlorine (17)
    return [11, 17];
  });

  const [addSelectorVal, setAddSelectorVal] = useState<number>(26); // Default Fe

  // Map to full element data
  const selectedElements = useMemo(() => {
    return selectedNums
      .map((num) => allElements.find((e) => e.number === num))
      .filter((e): e is ElementData => e !== undefined);
  }, [selectedNums, allElements]);

  // Add an element to comparison
  const handleAddElement = (num: number) => {
    if (selectedNums.includes(num)) return;
    if (selectedNums.length >= 6) {
      alert('Bạn có thể so sánh tối đa 6 nguyên tố cùng lúc để đảm bảo giao diện hiển thị rõ ràng nhất!');
      return;
    }
    setSelectedNums([...selectedNums, num]);
  };

  // Remove element from comparison
  const handleRemoveElement = (num: number) => {
    if (selectedNums.length <= 2) {
      alert('Cần ít nhất 2 nguyên tố để so sánh!');
      return;
    }
    setSelectedNums(selectedNums.filter((n) => n !== num));
  };

  // Quick preset sets for students
  const applyPreset = (nums: number[]) => {
    setSelectedNums(nums);
  };

  // Analysis of similarities and differences
  const comparisonAnalysis = useMemo(() => {
    if (selectedElements.length < 2) return null;

    // Check same period
    const periods = new Set(selectedElements.map((e) => e.period));
    const samePeriod = periods.size === 1 ? Array.from(periods)[0] : null;

    // Check same group
    const groups = new Set(selectedElements.map((e) => e.group));
    const sameGroup = groups.size === 1 ? Array.from(groups)[0] : null;

    // Check same broad category
    const categories = new Set(selectedElements.map((e) => e.broadCategory));
    const sameCategory = categories.size === 1 ? Array.from(categories)[0] : null;

    // Atomic radius min and max
    const radiusList = selectedElements
      .filter((e) => e.atomicRadiusPm !== null)
      .map((e) => ({ name: e.name, symbol: e.symbol, radius: e.atomicRadiusPm! }));
    const maxRadius = radiusList.length ? radiusList.reduce((prev, curr) => (curr.radius > prev.radius ? curr : prev)) : null;
    const minRadius = radiusList.length ? radiusList.reduce((prev, curr) => (curr.radius < prev.radius ? curr : prev)) : null;

    // Electronegativity min and max
    const electroList = selectedElements
      .filter((e) => e.electronegativity !== null)
      .map((e) => ({ name: e.name, symbol: e.symbol, electro: e.electronegativity! }));
    const maxElectro = electroList.length ? electroList.reduce((prev, curr) => (curr.electro > prev.electro ? curr : prev)) : null;
    const minElectro = electroList.length ? electroList.reduce((prev, curr) => (curr.electro < prev.electro ? curr : prev)) : null;

    return {
      samePeriod,
      sameGroup,
      sameCategory,
      maxRadius,
      minRadius,
      maxElectro,
      minElectro,
    };
  }, [selectedElements]);

  const getCategoryClass = (broad: string) => {
    if (broad === 'metal') return 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40';
    if (broad === 'nonmetal') return 'text-rose-300 border-rose-500/40 bg-rose-950/40';
    return 'text-amber-300 border-amber-500/40 bg-amber-950/40';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-6xl max-h-[94vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-xl text-white tracking-wide flex items-center gap-2">
                <span>Bảng So Sánh Chi Tiết Đa Nguyên Tố</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-mono">
                  {selectedElements.length} nguyên tố
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Phân tích đối chiếu: Số hiệu, Khối lượng, Cấu hình electron, Độ âm điện, Bán kính nguyên tử & Ứng dụng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar: Presets & Add Element */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Gợi ý so sánh:
            </span>
            <button
              onClick={() => applyPreset([11, 17])}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer"
            >
              Na vs Cl (Tạo muối ăn NaCl)
            </button>
            <button
              onClick={() => applyPreset([3, 11, 19])}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer"
            >
              Li - Na - K (Kim loại kiềm IA)
            </button>
            <button
              onClick={() => applyPreset([9, 17, 35, 53])}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 transition cursor-pointer"
            >
              F - Cl - Br - I (Halogen VIIA)
            </button>
            <button
              onClick={() => applyPreset([26, 29, 47, 79])}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition cursor-pointer"
            >
              Fe - Cu - Ag - Au (Kim loại tiêu biểu)
            </button>
            <button
              onClick={() => applyPreset([6, 14])}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition cursor-pointer"
            >
              C vs Si (Nhóm IVA)
            </button>
          </div>

          {/* Add more element select */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Thêm nguyên tố:</span>
            <select
              value={addSelectorVal}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setAddSelectorVal(val);
                handleAddElement(val);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-medium focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="" disabled>+ Chọn nguyên tố...</option>
              {allElements
                .filter((el) => !selectedNums.includes(el.number))
                .map((el) => (
                  <option key={el.number} value={el.number}>
                    {el.number}. {el.symbol} - {el.name} ({el.vietnameseName})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. KEY SIMILARITIES & DIFFERENCES CALLOUT */}
          {comparisonAnalysis && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-amber-950/40 border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Tổng hợp Phân tích Tương đồng & Khác biệt chính:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Similarities */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider block">
                    ✓ Điểm tương đồng:
                  </span>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {comparisonAnalysis.samePeriod && (
                      <li>
                        Cùng thuộc <strong className="text-white">Chu kì {comparisonAnalysis.samePeriod}</strong> (đều có {comparisonAnalysis.samePeriod} lớp electron).
                      </li>
                    )}
                    {comparisonAnalysis.sameGroup && (
                      <li>
                        Cùng thuộc <strong className="text-white">Nhóm {comparisonAnalysis.sameGroup}</strong> (có cấu hình electron lớp ngoài cùng tương tự, tính chất hóa học đồng đẳng).
                      </li>
                    )}
                    {comparisonAnalysis.sameCategory ? (
                      <li>
                        Cùng thuộc phân loại <strong className="text-white">{comparisonAnalysis.sameCategory === 'metal' ? 'Kim loại' : comparisonAnalysis.sameCategory === 'nonmetal' ? 'Phi kim' : 'Khí hiếm'}</strong>.
                      </li>
                    ) : (
                      <li>Gồm các nguyên tố thuộc nhiều phân nhóm khác nhau để so sánh đối kháng.</li>
                    )}
                  </ul>
                </div>

                {/* Differences */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">
                    ⚡ Điểm khác biệt nổi bật:
                  </span>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {comparisonAnalysis.maxRadius && comparisonAnalysis.minRadius && (
                      <li>
                        <strong>Bán kính nguyên tử:</strong> <strong className="text-cyan-300">{comparisonAnalysis.maxRadius.symbol}</strong> lớn nhất ({comparisonAnalysis.maxRadius.radius} pm) &gt; <strong className="text-rose-300">{comparisonAnalysis.minRadius.symbol}</strong> bé nhất ({comparisonAnalysis.minRadius.radius} pm).
                      </li>
                    )}
                    {comparisonAnalysis.maxElectro && comparisonAnalysis.minElectro && (
                      <li>
                        <strong>Độ âm điện (hút e):</strong> <strong className="text-rose-400">{comparisonAnalysis.maxElectro.symbol}</strong> hút e mạnh nhất ({comparisonAnalysis.maxElectro.electro}) vs <strong className="text-cyan-400">{comparisonAnalysis.minElectro.symbol}</strong> yếu nhất ({comparisonAnalysis.minElectro.electro}).
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2. VISUAL CHARTS COMPARISON (Atomic Radii & Electronegativity) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visual Atomic Radius Circles */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Kích thước tương đối Bán kính nguyên tử (pm)
                </span>
                <span className="text-[11px] text-slate-400">1 pm = 10⁻¹² m</span>
              </div>
              <div className="flex items-end justify-around gap-2 pt-6 pb-2 min-h-[140px] border-b border-slate-800/60">
                {selectedElements.map((el) => {
                  const r = el.atomicRadiusPm || 50;
                  // Scale circle size between 30px and 90px
                  const pixelSize = Math.max(30, Math.min(95, (r / 260) * 85));

                  return (
                    <div key={el.number} className="flex flex-col items-center gap-2">
                      <div 
                        className="rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border border-cyan-300/60 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-110"
                        style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
                        title={`${el.name} (${el.symbol}): Bán kính ${r} pm`}
                      >
                        {el.symbol}
                      </div>
                      <span className="text-[11px] font-mono font-bold text-cyan-300">
                        {el.atomicRadiusPm ? `${el.atomicRadiusPm} pm` : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual Electronegativity Bar Comparison */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Thang đo Độ âm điện Pauling (Khả năng hút e)
                </span>
                <span className="text-[11px] text-slate-400">Thang 0.7 - 4.0</span>
              </div>
              <div className="space-y-2.5 pt-2">
                {selectedElements.map((el) => {
                  const en = el.electronegativity || 0;
                  const percent = Math.min(100, (en / 4.0) * 100);

                  return (
                    <div key={el.number} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">
                          {el.symbol} ({el.vietnameseName}):
                        </span>
                        <span className="font-mono font-bold text-amber-400">
                          {el.electronegativity ?? 'Không xác định'}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. MULTI-COLUMN COMPARISON TABLE */}
          <div className="rounded-xl border border-slate-800 overflow-x-auto bg-slate-950/60 shadow-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-300">
                  <th className="py-3 px-4 min-w-[170px] font-bold sticky left-0 bg-slate-900 z-10 border-r border-slate-800">
                    Thuộc tính so sánh
                  </th>
                  {selectedElements.map((el) => (
                    <th key={el.number} className="py-3 px-4 min-w-[200px] text-center">
                      <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 relative ${getCategoryClass(el.broadCategory)}`}>
                        {selectedElements.length > 2 && (
                          <button
                            onClick={() => handleRemoveElement(el.number)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-slate-900/80 hover:bg-rose-500 text-slate-400 hover:text-white transition cursor-pointer"
                            title="Xóa nguyên tố khỏi bảng so sánh"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="text-[10px] text-slate-300 font-mono">Z = {el.number}</span>
                        <strong className="text-2xl font-black">{el.symbol}</strong>
                        
                        {/* IUPAC Name + Audio Pronounce Button */}
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-white">{el.name}</span>
                          <button
                            onClick={() => speakElementName(el.name)}
                            className="p-1 rounded bg-slate-800 hover:bg-cyan-600/30 text-cyan-300 transition cursor-pointer"
                            title={`Nghe phát âm ${el.name} chuẩn IUPAC`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {el.ipaPronunciation && (
                          <span className="text-[10px] font-mono text-cyan-300/80 bg-slate-900/60 px-1.5 py-0.2 rounded">
                            {el.ipaPronunciation}
                          </span>
                        )}

                        {el.vietnameseTraditionalName && el.vietnameseTraditionalName !== el.name && (
                          <span className="text-[10px] text-slate-400 italic">
                            (tên cũ: {el.vietnameseTraditionalName})
                          </span>
                        )}

                        <button
                          onClick={() => {
                            onSelectElement(el);
                            onClose();
                          }}
                          className="mt-1 text-[10px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition cursor-pointer"
                        >
                          Xem mô hình 3D →
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {/* Row 1: Số hiệu nguyên tử */}
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    Số hiệu nguyên tử (Z)
                  </td>
                  {selectedElements.map((el) => (
                    <td key={el.number} className="py-3 px-4 text-center font-mono font-bold text-sm text-cyan-400">
                      {el.number}
                    </td>
                  ))}
                </tr>

                {/* Row 2: Khối lượng nguyên tử */}
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    Khối lượng nguyên tử
                  </td>
                  {selectedElements.map((el) => (
                    <td key={el.number} className="py-3 px-4 text-center font-mono text-slate-200">
                      <div className="font-bold text-sm">{el.atomicMass}</div>
                      <div className="text-[10px] text-slate-400">Làm tròn SGK: <strong>{el.roundedMass}</strong></div>
                    </td>
                  ))}
                </tr>

                {/* Row 2.5: Cấu tạo hạt nhân & Vỏ (p, n, e) */}
                <tr className="hover:bg-slate-900/50 bg-slate-950/30">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    <div>Cấu tạo hạt (p, n, e)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Hạt nhân & Vỏ</div>
                  </td>
                  {selectedElements.map((el) => {
                    const pInfo = getElementParticleDetails(el);
                    return (
                      <td key={el.number} className="py-3 px-4 text-center font-mono">
                        <div className="inline-flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-bold shadow-sm">
                          <span className="text-rose-400" title={`Số proton: ${pInfo.protons}`}>{pInfo.protons}p⁺</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-300" title={`Số neutron: ${pInfo.neutrons}`}>{pInfo.neutrons}n⁰</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-cyan-400" title={`Số electron: ${pInfo.electrons}`}>{pInfo.electrons}e⁻</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Số khối A = {pInfo.massNumber}
                          {pInfo.isChlorineSpecial && <span className="text-amber-300 ml-1">(³⁵Cl)</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Row 3: Phân loại SGK */}
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    Phân loại & Phân nhóm
                  </td>
                  {selectedElements.map((el) => (
                    <td key={el.number} className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getCategoryClass(el.broadCategory)}`}>
                        {el.categoryNameVi}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">Khối: <strong>{el.block}</strong></div>
                    </td>
                  ))}
                </tr>

                {/* Row 4: Vị trí BTH */}
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    Vị trí (Chu kì & Nhóm)
                  </td>
                  {selectedElements.map((el) => (
                    <td key={el.number} className="py-3 px-4 text-center font-mono text-slate-200">
                      <div>Chu kì <strong>{el.period}</strong></div>
                      <div>Nhóm <strong>{el.groupRoman}</strong> ({el.group})</div>
                    </td>
                  ))}
                </tr>

                {/* Row 5: Cấu hình electron */}
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    Cấu hình Electron
                  </td>
                  {selectedElements.map((el) => (
                    <td key={el.number} className="py-3 px-4 text-center font-mono">
                      <div className="font-bold text-amber-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 mb-1">
                        {el.condensedElectronConfiguration}
                      </div>
                      <div className="text-[10px] text-slate-400 break-words">
                        {el.electronConfiguration}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row 6: Phân bố electron trên từng lớp */}
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    Số e⁻ từng lớp (K, L, M, N...)
                  </td>
                  {selectedElements.map((el) => (
                    <td key={el.number} className="py-3 px-4 text-center font-mono text-cyan-300">
                      <div className="font-bold">[{el.electronsPerShell.join(', ')}]</div>
                      <div className="text-[10px] text-slate-400">({el.electronsPerShell.length} lớp vỏ)</div>
                    </td>
                  ))}
                </tr>

                {/* Row 7: Số e lớp ngoài cùng */}
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    Số e⁻ lớp ngoài cùng
                  </td>
                  {selectedElements.map((el) => (
                    <td key={el.number} className="py-3 px-4 text-center font-mono font-bold text-base text-emerald-400">
                      {el.electronsPerShell[el.electronsPerShell.length - 1]} e⁻
                    </td>
                  ))}
                </tr>

                {/* Row 8: Độ âm điện */}
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    Độ âm điện (Pauling)
                  </td>
                  {selectedElements.map((el) => (
                    <td key={el.number} className="py-3 px-4 text-center font-mono font-bold text-sm text-amber-400">
                      {el.electronegativity ?? 'Chưa rõ'}
                    </td>
                  ))}
                </tr>

                {/* Row 9: Bán kính nguyên tử */}
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    Bán kính nguyên tử (pm)
                  </td>
                  {selectedElements.map((el) => (
                    <td key={el.number} className="py-3 px-4 text-center font-mono font-bold text-sm text-cyan-300">
                      {el.atomicRadiusPm ? `${el.atomicRadiusPm} pm` : 'Chưa đo'}
                    </td>
                  ))}
                </tr>

                {/* Row 10: Trạng thái & Khối lượng riêng */}
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    Trạng thái (25°C) & KLR
                  </td>
                  {selectedElements.map((el) => (
                    <td key={el.number} className="py-3 px-4 text-center text-slate-200">
                      <div className="font-semibold capitalize text-emerald-400">
                        {el.standardState === 'solid' ? 'Rắn' : el.standardState === 'liquid' ? 'Lỏng' : 'Khí'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {el.densityGPerCm3 ? `${el.densityGPerCm3} g/cm³` : '-'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row 11: Nhiệt độ nóng chảy & sôi */}
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    Nóng chảy / Sôi (°C)
                  </td>
                  {selectedElements.map((el) => (
                    <td key={el.number} className="py-3 px-4 text-center font-mono text-[11px] text-slate-200">
                      <div>Nóng chảy: <strong>{el.meltingPointKelvin ? `${(el.meltingPointKelvin - 273.15).toFixed(0)} °C` : '-'}</strong></div>
                      <div>Sôi: <strong>{el.boilingPointKelvin ? `${(el.boilingPointKelvin - 273.15).toFixed(0)} °C` : '-'}</strong></div>
                    </td>
                  ))}
                </tr>

                {/* Row 12: Ứng dụng thực tế */}
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800 align-top">
                    Ứng dụng thực tế & Hình ảnh / Hình động
                  </td>
                  {selectedElements.map((el) => (
                    <td key={el.number} className="py-3 px-4 align-top min-w-[220px]">
                      <div className="space-y-3">
                        {el.applications[0] && (
                          <ApplicationVisual
                            application={el.applications[0]}
                            element={el}
                            index={0}
                          />
                        )}
                        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                          <strong className="text-white text-xs block leading-tight">
                            • {el.applications[0]?.title}
                          </strong>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {el.applications[0]?.description}
                          </p>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Nhấn vào tên bất kì nguyên tố nào để xem mô hình nguyên tử 3D và lớp electron</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition cursor-pointer"
          >
            Đóng bảng so sánh
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ElementData } from '../types/element';
import { getElementParticleDetails } from '../data/elementsData';
import { ThreeBohrAtom } from './ThreeBohrAtom';
import { speakElementName } from '../utils/audio';
import { ApplicationVisual } from './ApplicationVisual';
import { 
  X, ChevronLeft, ChevronRight, Atom, Rocket, Zap, Sprout, Activity, 
  CloudRain, Waves, BatteryCharging, HeartPulse, Plane, Telescope, 
  ScanLine, FlaskConical, ShieldAlert, Gem, ShieldCheck, Cpu, 
  PackageCheck, Snowflake, HeartHandshake, Flame, Shield, Smile, 
  UtensilsCrossed, Sparkles, Scan, Soup, Lightbulb, Leaf, Laptop, 
  Utensils, SunMedium, Building, Bone, Disc, Bath, Droplet, 
  Wrench, Wine, Building2, Shell, Construction, Compass, Landmark, 
  Music, Home, ShieldPlus, Sparkle, Crown, Sun, Thermometer, Clock, 
  Layers, Info, ArrowRight, Share2, BookOpen, Volume2, VolumeX
} from 'lucide-react';

interface ElementModalProps {
  element: ElementData | null;
  isCompareSelected?: boolean;
  onToggleCompare?: () => void;
  onClose: () => void;
  onSelectElement: (num: number) => void;
  onCompareWith?: (element: ElementData) => void;
}

// Icon mapper for applications
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Rocket, Zap, Sprout, Activity, CloudRain, Waves, BatteryCharging,
  HeartPulse, Plane, Telescope, ScanLine, FlaskConical, ShieldAlert,
  Gem, ShieldCheck, Cpu, PackageCheck, Snowflake, HeartHandshake,
  Flame, Shield, Smile, UtensilsCrossed, Sparkles, Scan, Soup,
  Lightbulb, Leaf, Laptop, Utensils, SunMedium, Building, Bone,
  Disc, Bath, Droplet, Wrench, Wine, Building2, Shell, Construction,
  Compass, Landmark, Music, Home, ShieldPlus, Sparkle, Crown, Sun,
  Thermometer, Clock, Layers, Atom
};

const SHELL_LETTERS = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
const MAX_SHELL_CAPACITY = [2, 8, 18, 32, 50, 72, 98]; // 2n² rule

export const ElementModal: React.FC<ElementModalProps> = ({
  element,
  isCompareSelected,
  onToggleCompare,
  onClose,
  onSelectElement,
  onCompareWith,
}) => {
  const [activeTab, setActiveTab] = useState<'model' | 'applications' | 'properties'>('model');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  if (!element) return null;

  const handlePronounce = () => {
    setIsSpeaking(true);
    speakElementName(element.name, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const prevElementNum = element.number > 1 ? element.number - 1 : 118;
  const nextElementNum = element.number < 118 ? element.number + 1 : 1;

  // Category badge colors
  const categoryBadgeColors = {
    metal: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    nonmetal: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    'noble-gas': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  }[element.broadCategory];

  const categoryNameVi = {
    metal: 'Kim loại',
    nonmetal: 'Phi kim',
    'noble-gas': 'Khí hiếm',
  }[element.broadCategory];

  // Convert Kelvin to Celsius
  const kToC = (k: number | null) => (k !== null ? `${(k - 273.15).toFixed(1)} °C` : 'Chưa rõ');

  // Outer shell electrons & particle breakdown (p, n, e)
  const outerElectrons = element.electronsPerShell[element.electronsPerShell.length - 1];
  const particles = getElementParticleDetails(element);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (shrink-0 prevents flexbox compression by content) */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900/95 shrink-0 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            {/* Element Symbol Card */}
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex flex-col items-center justify-center border shadow-md shrink-0 ${categoryBadgeColors}`}>
              <span className="text-[10px] font-mono leading-none text-slate-300 font-bold self-start pl-1 pt-0.5">
                {element.number}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {element.symbol}
              </span>
              <span className="text-[9px] text-slate-300 font-medium leading-none pb-0.5">
                {element.roundedMass}
              </span>
            </div>

            {/* Names & Classifications with Audio */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide truncate">
                  {element.name}
                </h2>

                {/* Audio Pronunciation Button */}
                <button
                  type="button"
                  onClick={handlePronounce}
                  className={`p-1 px-2 rounded-lg border transition flex items-center gap-1 cursor-pointer shrink-0 ${
                    isSpeaking
                      ? 'bg-cyan-500 text-white border-cyan-400 ring-2 ring-cyan-400/50 scale-105 animate-pulse'
                      : 'bg-slate-800 hover:bg-cyan-600/30 text-cyan-300 border-slate-700 hover:border-cyan-500/50'
                  }`}
                  title="Nghe phát âm tiếng Anh chuẩn IUPAC"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">Phát âm</span>
                </button>

                {/* THCS Vietnamese Phonetic Reading (SGK KHTN 7) */}
                {element.vietnamesePhonetics && (
                  <span className="text-[11px] font-medium text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 shrink-0">
                    <span>Đọc:</span>
                    <strong>{element.vietnamesePhonetics}</strong>
                  </span>
                )}

                {/* Valency Badge for THCS */}
                {element.valency && (
                  <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm shrink-0">
                    Hóa trị: {element.valency}
                  </span>
                )}

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${categoryBadgeColors}`}>
                  {categoryNameVi}
                </span>

                {element.isTHCSEssential && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 hidden sm:inline">
                    ⭐ KHTN 7-9
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>Chu kì: <strong className="text-slate-200">{element.period}</strong></span>
                <span>•</span>
                <span>Nhóm: <strong className="text-slate-200">{element.groupRoman}</strong> ({element.group})</span>
                <span>•</span>
                <span>Khối: <strong className="text-amber-300 font-mono">{element.block}</strong></span>
                {element.vietnameseTraditionalName && element.vietnameseTraditionalName !== element.name && (
                  <span className="text-slate-400 italic hidden md:inline">
                    • Tên cũ: {element.vietnameseTraditionalName}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Navigation, Compare & Close */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            {onToggleCompare && (
              <button
                type="button"
                onClick={onToggleCompare}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition cursor-pointer ${
                  isCompareSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Thêm hoặc xóa khỏi bảng so sánh"
              >
                <span>{isCompareSelected ? '✓ Đã chọn so sánh' : '+ So sánh'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelectElement(prevElementNum)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Nguyên tố trước đó (Z - 1)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onSelectElement(nextElementNum)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Nguyên tố kế tiếp (Z + 1)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-100 border border-rose-500/30 transition cursor-pointer ml-0.5"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (shrink-0 and sticky so it is NEVER covered by scrollable contents) */}
        <div className="px-3 sm:px-6 bg-slate-900 border-b border-slate-800 flex gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm shrink-0 sticky top-0 z-20 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('model')}
            className={`py-2.5 font-semibold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'model'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Atom className="w-4 h-4" />
            <span>Mô hình nguyên tử 3D & Cấu tạo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`py-2.5 font-semibold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'applications'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>Ứng dụng thực tế sinh động ({element.applications.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('properties')}
            className={`py-2.5 font-semibold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'properties'
                ? 'border-indigo-400 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Tính chất lí - hóa & Lịch sử</span>
          </button>
        </div>

        {/* Tab Contents - Scrollable with min-h-0 to avoid flex overflow bugs */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 space-y-5">
          {/* TAB 1: 3D ATOM MODEL & SHELLS */}
          {activeTab === 'model' && (
            <div className="space-y-5">
              {/* Three.js Interactive 3D Model */}
              <div className="w-full">
                <ThreeBohrAtom element={element} />
              </div>

              {/* Electron Configuration Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Configuration card */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                      Cấu hình Electron đầy đủ
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                      Quy tắc Klechkowski
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-cyan-300 text-sm sm:text-base font-semibold overflow-x-auto">
                    {element.electronConfiguration}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Cấu hình electron rút gọn:</span>
                    <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {element.condensedElectronConfiguration}
                    </span>
                  </div>
                </div>

                {/* Nucleus & Electrons Overview (Exact p, n, e breakdown) */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                      Cấu tạo hạt nhân & Vỏ nguyên tử (Hạt p, n, e)
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Trung hòa điện: số p = số e
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                      <span className="text-[11px] text-rose-300 block font-medium">Số Proton (p)</span>
                      <strong className="text-xl text-rose-400 font-bold font-mono">{particles.protons}</strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">Điện tích: +{particles.protons}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-700/30 border border-slate-700">
                      <span className="text-[11px] text-slate-300 block font-medium">Số Neutron (n)</span>
                      <strong className="text-xl text-slate-200 font-bold font-mono">{particles.neutrons}</strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                        {particles.isChlorineSpecial 
                          ? '³⁵Cl: 35 - 17 = 18' 
                          : `A - Z = ${particles.massNumber} - ${particles.protons}`}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <span className="text-[11px] text-cyan-300 block font-medium">Số Electron (e)</span>
                      <strong className="text-xl text-cyan-400 font-bold font-mono">{particles.electrons}</strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                        {element.electronsPerShell.length} lớp vỏ (Σ={element.electronsPerShell.reduce((a, b) => a + b, 0)})
                      </span>
                    </div>
                  </div>

                  {particles.isChlorineSpecial && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
                      ℹ️ <strong>Lưu ý đồng vị Clo:</strong> Trong tự nhiên, Clo có 2 đồng vị bền: <strong>³⁵Cl</strong> (75.8%, 18 neutron) và <strong>³⁷Cl</strong> (24.2%, 20 neutron). Nguyên tử khối trung bình là 35.45 amu (quy ước làm tròn tính toán SGK là 35.5). Mô hình nguyên tử thể hiện đồng vị bền ³⁵Cl với 18 neutron.
                    </div>
                  )}

                  {particles.isHydrogenZeroNeutron && (
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-200 leading-relaxed">
                      ℹ️ <strong>Lưu ý nguyên tử Hydrogen:</strong> Đồng vị Protium (¹H, chiếm &gt;99.98% trong tự nhiên) chỉ gồm <strong>1 proton duy nhất</strong> ở hạt nhân và <strong>0 neutron</strong> (N = 1 - 1 = 0).
                    </div>
                  )}

                  <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg flex items-center justify-between border border-slate-800">
                    <span>Số electron lớp ngoài cùng:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {outerElectrons} e⁻
                    </span>
                  </div>
                </div>
              </div>

              {/* Electron Shells Detail Table (Strict rule check: 2n²) */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Chi tiết các lớp electron theo đúng quy tắc lượng tử (K, L, M, N...)</span>
                  </h4>
                  <span className="text-xs text-slate-400">
                    Sức chứa tối đa lớp n: <code className="text-cyan-300 font-mono">2n²</code>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="py-2 px-3">Lớp (Tên gọi)</th>
                        <th className="py-2 px-3">Số lượng tử chính (n)</th>
                        <th className="py-2 px-3">Số e⁻ hiện có</th>
                        <th className="py-2 px-3">Số e⁻ tối đa (2n²)</th>
                        <th className="py-2 px-3">Mức độ bão hòa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      {element.electronsPerShell.map((count, idx) => {
                        const maxCap = MAX_SHELL_CAPACITY[idx] || 2 * Math.pow(idx + 1, 2);
                        const isOuter = idx === element.electronsPerShell.length - 1;
                        const percent = Math.min(100, Math.round((count / maxCap) * 100));

                        return (
                          <tr key={idx} className={isOuter ? 'bg-amber-500/5' : ''}>
                            <td className="py-2.5 px-3 font-semibold text-slate-200 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-300 text-[11px]">
                                {SHELL_LETTERS[idx]}
                              </span>
                              <span>Lớp {SHELL_LETTERS[idx]}</span>
                              {isOuter && (
                                <span className="text-[10px] font-sans bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded">
                                  Lớp ngoài cùng
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">n = {idx + 1}</td>
                            <td className="py-2.5 px-3 font-bold text-cyan-400 text-sm">{count}</td>
                            <td className="py-2.5 px-3 text-slate-400">{maxCap}</td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2 w-36">
                                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${isOuter ? 'bg-amber-400' : 'bg-cyan-400'}`} 
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-slate-400 w-8">{percent}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VIVID APPLICATIONS FOR STUDENTS */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-cyan-500/10 border border-amber-500/30">
                <h3 className="text-base sm:text-lg font-bold text-amber-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Ứng dụng thực tế & Câu chuyện kỳ thú của {element.name} ({element.vietnameseName})</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  {element.summaryVi}
                </p>
              </div>

              {/* Applications Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {element.applications.map((app, idx) => {
                  const IconComp = iconMap[app.iconName] || Sparkles;

                  return (
                    <div 
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-800 transition shadow-xl flex flex-col justify-between group space-y-3"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-300 group-hover:scale-105 group-hover:bg-cyan-500/30 transition shrink-0">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block">
                              Ứng dụng #{idx + 1} • {app.category === 'technology' ? 'Công nghệ' : app.category === 'daily-life' ? 'Đời sống' : app.category === 'medicine' ? 'Y học' : app.category === 'aerospace' ? 'Hàng không vũ trụ' : 'Công nghiệp'}
                            </span>
                            <h4 className="text-base font-bold text-white group-hover:text-cyan-200 transition">
                              {app.title}
                            </h4>
                          </div>
                        </div>

                        {/* Dynamic Interactive Animated Simulation & High-Resolution Scientific Photo */}
                        <ApplicationVisual
                          application={app}
                          element={element}
                          index={idx}
                        />

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {app.description}
                        </p>
                      </div>

                      {app.funFact && (
                        <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-start gap-2 bg-slate-900/60 -mx-2 -mb-2 p-3 rounded-xl border border-amber-500/20">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-200/90 italic">
                            <strong className="text-amber-300 not-italic">Bạn có biết? </strong>
                            {app.funFact}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Chemical Education Callout */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 text-xs text-slate-300 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-100 block">Dành cho học sinh ôn bài & thực hành:</span>
                    <span className="text-slate-400">
                      Nguyên tố {element.symbol} có số electron hóa trị quyết định khả năng tạo liên kết hóa học.
                    </span>
                  </div>
                </div>

                {onCompareWith && (
                  <button
                    onClick={() => onCompareWith(element)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>So sánh nguyên tố này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PHYSICAL & CHEMICAL PROPERTIES */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Số hiệu nguyên tử (Z)</span>
                  <strong className="text-lg font-mono text-cyan-400 font-bold">{element.number}</strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Nguyên tử khối chuẩn</span>
                  <strong className="text-lg font-mono text-slate-200 font-bold">{element.atomicMass}</strong>
                  <span className="text-[10px] text-slate-400 block">Làm tròn SGK: {element.roundedMass}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Hạt cấu tạo (p, n, e)</span>
                  <div className="text-sm font-mono font-bold space-x-1 mt-0.5">
                    <span className="text-rose-400">{particles.protons}p⁺</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-200">{particles.neutrons}n⁰</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-cyan-400">{particles.electrons}e⁻</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                    Số khối A = {particles.massNumber}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Trạng thái (25°C)</span>
                  <strong className="text-lg text-emerald-400 font-bold capitalize">
                    {element.standardState === 'solid' ? 'Rắn' : element.standardState === 'liquid' ? 'Lỏng' : element.standardState === 'gas' ? 'Khí' : 'Chưa rõ'}
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Độ âm điện (Pauling)</span>
                  <strong className="text-lg font-mono text-amber-400 font-bold">
                    {element.electronegativity !== null ? element.electronegativity : 'Không xác định'}
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Bán kính nguyên tử</span>
                  <strong className="text-lg font-mono text-slate-200 font-bold">
                    {element.atomicRadiusPm !== null ? `${element.atomicRadiusPm} pm` : 'Chưa đo'}
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Nhiệt độ nóng chảy</span>
                  <strong className="text-sm font-mono text-slate-200 font-bold block">
                    {kToC(element.meltingPointKelvin)}
                  </strong>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {element.meltingPointKelvin ? `${element.meltingPointKelvin} K` : ''}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Nhiệt độ sôi</span>
                  <strong className="text-sm font-mono text-slate-200 font-bold block">
                    {kToC(element.boilingPointKelvin)}
                  </strong>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {element.boilingPointKelvin ? `${element.boilingPointKelvin} K` : ''}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Khối lượng riêng</span>
                  <strong className="text-lg font-mono text-slate-200 font-bold">
                    {element.densityGPerCm3 !== null ? `${element.densityGPerCm3} g/cm³` : 'Chưa rõ'}
                  </strong>
                </div>
              </div>

              {/* Oxidation states & Discovery info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
                  <span className="text-xs uppercase font-bold text-slate-400 block">
                    Số oxi hóa thường gặp
                  </span>
                  <div className="p-3 bg-slate-900 rounded-lg font-mono text-cyan-300 text-sm font-semibold">
                    {element.oxidationStates || '0'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
                  <span className="text-xs uppercase font-bold text-slate-400 block">
                    Lịch sử phát hiện
                  </span>
                  <div className="p-3 bg-slate-900 rounded-lg text-xs space-y-1">
                    <div>Năm phát hiện: <strong className="text-amber-300">{element.discoveryYear}</strong></div>
                    <div>Người tìm ra: <strong className="text-slate-200">{element.discoverer}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Bản chuẩn SGK Hóa học GDPT 2018 (IUPAC)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

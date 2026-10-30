import React, { useState } from 'react';
import { ElementData } from '../types/element';
import { getAllElements, KHTN7_FIRST_20_NUMBERS, THCS_VALENCIES, THCS_VIETNAMESE_PHONETICS, getElementParticleDetails } from '../data/elementsData';
import { speakElementName } from '../utils/audio';
import { 
  X, BookOpen, Sparkles, Award, Star, Volume2, 
  Lightbulb, Atom, Layers, FileText, CheckCircle2, 
  ChevronRight, ArrowRight, HelpCircle
} from 'lucide-react';

interface THCSLearningModalProps {
  onClose: () => void;
  onSelectElement: (element: ElementData) => void;
}

type TabType = 'first20' | 'valency-poem' | 'bohr-rules' | 'mass-cheatsheet' | 'flashcards';

export const THCSLearningModal: React.FC<THCSLearningModalProps> = ({
  onClose,
  onSelectElement,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('first20');
  const allElements = getAllElements();

  // 20 First Elements for KHTN 7
  const first20Elements = allElements.filter((e) => KHTN7_FIRST_20_NUMBERS.includes(e.number));

  // Flashcard state
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const currentCardElement = first20Elements[cardIndex] || first20Elements[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % first20Elements.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + first20Elements.length) % first20Elements.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-5xl max-h-[92vh] bg-slate-900 border-2 border-emerald-500/50 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header with Friendly Secondary School Theme */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-yellow-300 shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide">
                  GÓC HỌC TẬP THCS • KHOA HỌC TỰ NHIÊN 7 - 8 - 9
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 shadow-sm">
                  GDPT 2018
                </span>
              </div>
              <p className="text-xs text-emerald-100 hidden sm:block">
                Cẩm nang ôn thi 20 nguyên tố đầu, quy tắc vỏ electron, hóa trị và nguyên tử khối amu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 bg-slate-950/90 border-b border-slate-800 flex gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm py-2 shrink-0">
          <button
            onClick={() => setActiveTab('first20')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'first20'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Star className="w-4 h-4 text-amber-300" />
            <span>20 Nguyên tố KHTN 7</span>
          </button>

          <button
            onClick={() => setActiveTab('bohr-rules')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'bohr-rules'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Atom className="w-4 h-4" />
            <span>Quy tắc Vỏ Electron</span>
          </button>

          <button
            onClick={() => setActiveTab('valency-poem')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'valency-poem'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Bài Ca Hóa Trị THCS</span>
          </button>

          <button
            onClick={() => setActiveTab('mass-cheatsheet')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'mass-cheatsheet'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Bảng Nguyên Tử Khối Thi Học Kì</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'flashcards'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-yellow-300" />
            <span>Lật Thẻ Ôn Tập 5 Phút</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: 20 FIRST ELEMENTS TABLE */}
          {activeTab === 'first20' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span>20 Nguyên Tố Cốt Lõi Môn Khoa Học Tự Nhiên Lớp 7 (Z = 1 đến 20)</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Học sinh THCS cần nắm vững: Số proton ($Z$), Kí hiệu, Tên IUPAC, Cách phát âm SGK, Khối lượng nguyên tử (amu) và Số e từng lớp.
                  </p>
                </div>
                <div className="text-xs text-emerald-300 font-mono bg-emerald-900/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                  Chu kì 1, 2, 3 & Canxi (Chu kì 4)
                </div>
              </div>

              {/* Table of 20 elements */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-3 text-center">Số Z</th>
                        <th className="py-3 px-3 text-center">Kí hiệu</th>
                        <th className="py-3 px-3">Tên IUPAC & Phát âm</th>
                        <th className="py-3 px-3 text-center">Tên cũ (tham khảo)</th>
                        <th className="py-3 px-3 text-center">NTK (amu)</th>
                        <th className="py-3 px-3 text-center">Hạt (p, n, e)</th>
                        <th className="py-3 px-3 text-center">Lớp e (K, L, M, N)</th>
                        <th className="py-3 px-3 text-center">e lớp ngoài cùng</th>
                        <th className="py-3 px-3 text-center">Hóa trị</th>
                        <th className="py-3 px-3 text-center">Phân loại</th>
                        <th className="py-3 px-3 text-center">Khám phá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {first20Elements.map((el) => {
                        const viPhonetic = THCS_VIETNAMESE_PHONETICS[el.number] || '';
                        const valency = THCS_VALENCIES[el.number] || '-';
                        const outerE = el.electronsPerShell[el.electronsPerShell.length - 1];
                        const pInfo = getElementParticleDetails(el);

                        return (
                          <tr 
                            key={el.number}
                            className="hover:bg-slate-900/70 transition cursor-pointer"
                            onClick={() => {
                              onSelectElement(el);
                              onClose();
                            }}
                          >
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-cyan-400">
                              {el.number}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 font-extrabold text-base text-white inline-flex items-center justify-center shadow-sm">
                                {el.symbol}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <strong className="text-sm text-white">{el.name}</strong>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speakElementName(el.name);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition"
                                  title="Nghe phát âm chuẩn IUPAC"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <span className="text-[11px] text-emerald-400 block font-sans">
                                Đọc là: <em>{viPhonetic}</em>
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-400">
                              {el.vietnameseTraditionalName || '-'}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-300">
                              {el.roundedMass}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-xs">
                              <span className="text-rose-400 font-bold">{pInfo.protons}p</span>{' '}
                              <span className="text-slate-500">•</span>{' '}
                              <span className="text-slate-300 font-bold">{pInfo.neutrons}n</span>{' '}
                              <span className="text-slate-500">•</span>{' '}
                              <span className="text-cyan-400 font-bold">{pInfo.electrons}e</span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-cyan-300 font-bold">
                              [{el.electronsPerShell.join(', ')}]
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-extrabold text-emerald-400">
                              {outerE} e⁻
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-300">
                              {valency}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                el.broadCategory === 'metal'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                  : el.broadCategory === 'nonmetal'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}>
                                {el.broadCategory === 'metal' ? 'Kim loại' : el.broadCategory === 'nonmetal' ? 'Phi kim' : 'Khí hiếm'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="text-xs text-cyan-400 hover:underline flex items-center justify-center gap-1">
                                <span>Mô hình 3D</span>
                                <ArrowRight className="w-3 h-3" />
                              </span>
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

          {/* TAB 2: BOHR-RUTHERFORD ATOM SHELL RULES */}
          {activeTab === 'bohr-rules' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rule 1 */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/40 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-lg border border-cyan-500/30">
                    1
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Quy tắc số electron tối đa từng lớp
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Theo mô hình Rutherford - Bohr trong SGK KHTN 7:
                  </p>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li>Lớp thứ nhất (K, trong cùng): chứa tối đa <strong className="text-cyan-300">2 electron</strong>.</li>
                    <li>Lớp thứ hai (L): chứa tối đa <strong className="text-cyan-300">8 electron</strong>.</li>
                    <li>Lớp thứ ba (M): chứa tối đa <strong className="text-cyan-300">8 electron</strong> (đối với 20 nguyên tố đầu) hoặc 18 electron.</li>
                    <li>Lớp thứ tư (N): nhận tiếp electron khi lớp trong đã ổn định.</li>
                  </ul>
                </div>

                {/* Rule 2 */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-lg border border-emerald-500/30">
                    2
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Electron lớp ngoài cùng quyết định tính chất
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Nhìn vào số electron ở lớp ngoài cùng của nguyên tử:
                  </p>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span><strong>1, 2, 3 e⁻:</strong> Thường là <strong className="text-cyan-300">Kim loại</strong> (dễ nhường e).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                      <span><strong>5, 6, 7 e⁻:</strong> Thường là <strong className="text-rose-300">Phi kim</strong> (dễ nhận e).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span><strong>8 e⁻ (Heli có 2 e⁻):</strong> Là <strong className="text-amber-300">Khí hiếm</strong> (bền vững, trơ).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <span><strong>4 e⁻:</strong> Có thể là Phi kim (C, Si) hoặc Kim loại (Sn, Pb).</span>
                    </li>
                  </ul>
                </div>

                {/* Rule 3 */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/40 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-black text-lg border border-purple-500/30">
                    3
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Liên hệ với Bảng Tuần Hoàn
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li><strong className="text-purple-300">Số thứ tự chu kì</strong> = Số lớp electron của nguyên tử (ví dụ: Na có 3 lớp e $\to$ thuộc Chu kì 3).</li>
                    <li><strong className="text-purple-300">Số thứ tự nhóm A</strong> = Số electron lớp ngoài cùng (ví dụ: Cl có 7 e lớp ngoài cùng $\to$ thuộc Nhóm VIIA).</li>
                    <li><strong className="text-purple-300">Số hiệu nguyên tử $Z$</strong> = Số proton trong hạt nhân = Số electron trong vỏ nguyên tử.</li>
                  </ul>
                </div>
              </div>

              {/* Visual Demo of Sodium (Na) Atom Model */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Ví dụ kinh điển KHTN 7</span>
                  <h4 className="text-lg font-bold text-white">Nguyên tử Sodium (Natri) • $Z = 11$</h4>
                  <p className="text-xs text-slate-300">
                    Hạt nhân có 11 proton. Lớp 1 có 2e; Lớp 2 có 8e; Lớp 3 (ngoài cùng) có 1e $\to$ Viết gọn: <strong className="text-cyan-300 font-mono">[2, 8, 1]</strong>.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const na = allElements.find((e) => e.number === 11);
                    if (na) {
                      onSelectElement(na);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
                >
                  <Atom className="w-4 h-4" />
                  <span>Xem Mô Hình 3D Động của Sodium</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: BÀI CA HÓA TRỊ THCS */}
          {activeTab === 'valency-poem' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/40 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>Bài Ca Hóa Trị THCS (Mẹo Thuộc Lòng Viết Công Thức Hóa Học)</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Bài thơ lục bát truyền thống giúp học sinh THCS nhớ nhanh hóa trị của các kim loại và phi kim thường gặp.
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-amber-900/40 px-3 py-1.5 rounded-xl border border-amber-500/30">
                  KHTN Lớp 7 & 8
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl max-w-2xl mx-auto space-y-4 font-sans text-sm leading-relaxed text-slate-200">
                <div className="space-y-2 border-l-4 border-amber-400 pl-4 py-1 italic">
                  <p className="text-amber-200 font-bold not-italic text-xs uppercase tracking-wider mb-2">Hóa trị I & II:</p>
                  <p>Kali (K), Iốt (I), Hiđrô (H),</p>
                  <p>Natri (Na) với Bạc (Ag), Clo (Cl) một loài</p>
                  <p>Là hoá trị I chớ sai</p>
                  <p>Ghi lòng bớt nỗi hoang mang muôn phần.</p>
                </div>

                <div className="space-y-2 border-l-4 border-cyan-400 pl-4 py-1 italic">
                  <p className="text-cyan-200 font-bold not-italic text-xs uppercase tracking-wider mb-2">Hóa trị II:</p>
                  <p>Magie (Mg), Kẽm (Zn) với Thủy ngân (Hg),</p>
                  <p>Oxi (O), Đồng (Cu), Thiếc (Sn) thêm phần Bari (Ba),</p>
                  <p>Cuối cùng thêm chú Canxi (Ca),</p>
                  <p>Hoá trị II nhớ ghi đừng nhầm.</p>
                </div>

                <div className="space-y-2 border-l-4 border-emerald-400 pl-4 py-1 italic">
                  <p className="text-emerald-200 font-bold not-italic text-xs uppercase tracking-wider mb-2">Hóa trị III & IV:</p>
                  <p>Bác Nhôm (Al) hoá trị III lần,</p>
                  <p>In sâu trí óc khi cần có ngay.</p>
                  <p>Cacbon (C), Silic (Si) này đây,</p>
                  <p>Có hoá trị IV không ngày nào quên.</p>
                </div>

                <div className="space-y-2 border-l-4 border-purple-400 pl-4 py-1 italic">
                  <p className="text-purple-200 font-bold not-italic text-xs uppercase tracking-wider mb-2">Nhiều hóa trị (Sắt & Nitơ):</p>
                  <p>Sắt (Fe) kia lắm lúc ghen hờn,</p>
                  <p>Hai, ba lên xuống thật phiền lắm thay (Hóa trị II và III).</p>
                  <p>Nitơ (N) rắc rối nhất trần,</p>
                  <p>I, II, III, IV lúc thời lên V!</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MASS CHEATSHEET FOR EXAMS */}
          {activeTab === 'mass-cheatsheet' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    <span>Bảng Nguyên Tử Khối Làm Tròn (amu) Dành Cho Bài Thi Học Kì</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Các giá trị nguyên tử khối tiêu chuẩn trong sách bài tập và đề kiểm tra KHTN THCS.
                  </p>
                </div>
                <span className="text-xs font-mono text-purple-300 bg-purple-900/40 px-3 py-1.5 rounded-xl border border-purple-500/30">
                  1 amu ≈ 1.66 × 10⁻²⁴ g
                </span>
              </div>

              {/* Grid cards of common exam masses */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {[
                  { num: 1, s: 'H', m: 1, name: 'Hydrogen' },
                  { num: 6, s: 'C', m: 12, name: 'Carbon' },
                  { num: 7, s: 'N', m: 14, name: 'Nitrogen' },
                  { num: 8, s: 'O', m: 16, name: 'Oxygen' },
                  { num: 11, s: 'Na', m: 23, name: 'Sodium' },
                  { num: 12, s: 'Mg', m: 24, name: 'Magnesium' },
                  { num: 13, s: 'Al', m: 27, name: 'Aluminium' },
                  { num: 15, s: 'P', m: 31, name: 'Phosphorus' },
                  { num: 16, s: 'S', m: 32, name: 'Sulfur' },
                  { num: 17, s: 'Cl', m: 35.5, name: 'Chlorine' },
                  { num: 19, s: 'K', m: 39, name: 'Potassium' },
                  { num: 20, s: 'Ca', m: 40, name: 'Calcium' },
                  { num: 26, s: 'Fe', m: 56, name: 'Iron' },
                  { num: 29, s: 'Cu', m: 64, name: 'Copper' },
                  { num: 30, s: 'Zn', m: 65, name: 'Zinc' },
                  { num: 35, s: 'Br', m: 80, name: 'Bromine' },
                  { num: 47, s: 'Ag', m: 108, name: 'Silver' },
                  { num: 56, s: 'Ba', m: 137, name: 'Barium' },
                ].map((item) => (
                  <div 
                    key={item.num}
                    onClick={() => {
                      const el = allElements.find((e) => e.number === item.num);
                      if (el) {
                        onSelectElement(el);
                        onClose();
                      }
                    }}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 hover:bg-slate-900 transition flex flex-col items-center justify-center text-center cursor-pointer group shadow-md"
                  >
                    <span className="text-xl font-black text-white group-hover:text-cyan-300">
                      {item.s}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{item.name}</span>
                    <div className="mt-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-extrabold text-xs">
                      = {item.m} amu
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INTERACTIVE 5-MINUTE FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="space-y-4 max-w-lg mx-auto py-2">
              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-white flex items-center justify-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-300" />
                  <span>Thẻ Nhớ Flashcard • Ôn Nhanh 20 Nguyên Tố KHTN 7</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Nhấp vào thẻ để lật xem đáp án, rèn luyện trí nhớ trước khi kiểm tra!
                </p>
              </div>

              {/* Flashcard container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-64 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-emerald-500/60 p-6 flex flex-col items-center justify-center text-center shadow-2xl cursor-pointer hover:border-emerald-400 transition transform active:scale-98 select-none relative overflow-hidden"
              >
                <div className="absolute top-3 left-4 text-xs font-bold text-slate-400 font-mono">
                  Thẻ {cardIndex + 1} / {first20Elements.length}
                </div>
                <div className="absolute top-3 right-4 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {isFlipped ? 'Mặt sau (Đáp án)' : 'Mặt trước (Câu hỏi)'}
                </div>

                {!isFlipped ? (
                  <div className="space-y-3">
                    <span className="text-xs uppercase font-bold text-slate-400">Nguyên tố có kí hiệu hóa học:</span>
                    <div className="text-6xl font-black text-cyan-300 tracking-tight">
                      {currentCardElement.symbol}
                    </div>
                    <span className="text-xs text-slate-400 block">Số hiệu nguyên tử: Z = {currentCardElement.number}</span>
                    <span className="text-[11px] text-amber-300 italic block mt-2">
                      👉 Chạm vào đây để xem Tên IUPAC, Hóa trị & Cấu tạo!
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2 animate-in zoom-in-95">
                    <div className="flex items-center justify-center gap-2">
                      <strong className="text-2xl font-black text-white">{currentCardElement.name}</strong>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakElementName(currentCardElement.name);
                        }}
                        className="p-1 rounded-md text-slate-300 hover:text-cyan-300 hover:bg-slate-800"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-emerald-400 font-medium">
                      Đọc là: <em>{THCS_VIETNAMESE_PHONETICS[currentCardElement.number]}</em>
                    </p>
                    <div className="pt-2 flex flex-wrap justify-center gap-2 sm:gap-3 text-xs font-mono">
                      <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Hạt (p, n, e):</span>
                        <span className="font-bold text-slate-200">
                          <span className="text-rose-400">{currentCardElement.number}p</span> • <span className="text-slate-300">{currentCardElement.number === 17 ? 18 : Math.max(0, Math.round(currentCardElement.roundedMass - currentCardElement.number))}n</span> • <span className="text-cyan-400">{currentCardElement.number}e</span>
                        </span>
                      </div>
                      <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Lớp electron:</span>
                        <span className="font-bold text-cyan-300">[{currentCardElement.electronsPerShell.join(', ')}]</span>
                      </div>
                      <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Hóa trị:</span>
                        <span className="font-bold text-amber-300">{THCS_VALENCIES[currentCardElement.number]}</span>
                      </div>
                      <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">NTK (amu):</span>
                        <span className="font-bold text-rose-300">{currentCardElement.roundedMass}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrevCard}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  ← Thẻ trước
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
                >
                  {isFlipped ? 'Xem lại câu hỏi' : 'Lật xem đáp án'}
                </button>

                <button
                  onClick={handleNextCard}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  Thẻ tiếp theo →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

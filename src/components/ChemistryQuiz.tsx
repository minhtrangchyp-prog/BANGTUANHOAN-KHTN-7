import React, { useState } from 'react';
import { ElementData } from '../types/element';
import { getElementByNumber } from '../data/elementsData';
import { X, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Award, RotateCcw } from 'lucide-react';

interface ChemistryQuizProps {
  onClose: () => void;
  onSelectElement: (element: ElementData) => void;
}

interface Question {
  id: number;
  question: string;
  options: { label: string; elementNum: number }[];
  correctNum: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Khí nào được bơm phồng trong các gói bánh snack bim bim khoai tây chiên để giữ bánh luôn giòn tan mà không bị ôi dầu?',
    options: [
      { label: 'Oxy (O)', elementNum: 8 },
      { label: 'Nitrogen (N)', elementNum: 7 },
      { label: 'Chlorine (Cl)', elementNum: 17 },
      { label: 'Helium (He)', elementNum: 2 },
    ],
    correctNum: 7,
    explanation: 'Nitơ (N) là khí trơ ở điều kiện thường nhờ liên kết ba N≡N siêu bền, ngăn chặn dầu mỡ bị oxy hóa mà không cần hóa chất bảo quản độc hại.'
  },
  {
    id: 2,
    question: 'Nguyên tố kim loại nào nằm ở chính giữa trung tâm phân tử diệp lục, giúp cây xanh quang hợp tạo ra khí oxy cho Trái Đất?',
    options: [
      { label: 'Iron - Sắt (Fe)', elementNum: 26 },
      { label: 'Calcium - Canxi (Ca)', elementNum: 20 },
      { label: 'Magnesium - Magie (Mg)', elementNum: 12 },
      { label: 'Sodium - Natri (Na)', elementNum: 11 },
    ],
    correctNum: 12,
    explanation: 'Một nguyên tử Magie (Mg²⁺) nằm ở trung tâm vòng porphyrin của phân tử diệp lục, đóng vai trò hấp thụ các photon ánh sáng mặt trời.'
  },
  {
    id: 3,
    question: '18 tấm gương lục giác mạ vàng của kính viễn vọng không gian 10 tỷ USD James Webb (JWST) được chế tạo từ nguyên tố kim loại siêu nhẹ nào?',
    options: [
      { label: 'Beryllium (Be)', elementNum: 4 },
      { label: 'Aluminium (Al)', elementNum: 13 },
      { label: 'Titanium (Ti)', elementNum: 22 },
      { label: 'Lithium (Li)', elementNum: 3 },
    ],
    correctNum: 4,
    explanation: 'Beri (Be) cực kỳ nhẹ và giữ nguyên hình dạng không bị co giãn biến dạng ở nhiệt độ âm sâu -233°C ngoài vũ trụ.'
  },
  {
    id: 4,
    question: 'Theo quy tắc 2n², lớp electron thứ 3 (Lớp M, với n = 3) có thể chứa tối đa bao nhiêu electron?',
    options: [
      { label: '8 electron', elementNum: 10 },
      { label: '18 electron', elementNum: 18 },
      { label: '32 electron', elementNum: 32 },
      { label: '2 electron', elementNum: 2 },
    ],
    correctNum: 18,
    explanation: 'Áp dụng công thức số electron tối đa của lớp n: S = 2n² = 2 × 3² = 2 × 9 = 18 electron (gồm phân lớp 3s² 3p⁶ 3d¹⁰).'
  },
  {
    id: 5,
    question: 'Kim loại nào có độ dẫn điện và dẫn nhiệt tốt nhất trong tất cả các kim loại trên Trái Đất?',
    options: [
      { label: 'Copper - Đồng (Cu)', elementNum: 29 },
      { label: 'Gold - Vàng (Au)', elementNum: 79 },
      { label: 'Silver - Bạc (Ag)', elementNum: 47 },
      { label: 'Aluminium - Nhôm (Al)', elementNum: 13 },
    ],
    correctNum: 47,
    explanation: 'Bạc (Ag) là kim loại dẫn điện và dẫn nhiệt xuất sắc nhất, tiếp theo là Đồng (Cu) và Vàng (Au).'
  },
  {
    id: 6,
    question: 'Nguyên tố nào là linh hồn của Thung lũng công nghệ, dùng chế tạo các con chip vi xử lý máy tính và pin năng lượng mặt trời?',
    options: [
      { label: 'Carbon (C)', elementNum: 6 },
      { label: 'Silicon (Si)', elementNum: 14 },
      { label: 'Germanium (Ge)', elementNum: 32 },
      { label: 'Phosphorus (P)', elementNum: 15 },
    ],
    correctNum: 14,
    explanation: 'Silic (Si) là chất bán dẫn kỳ diệu tạo nên hàng tỷ bóng bán dẫn trên các bộ vi xử lý CPU máy tính và điện thoại thông minh hiện nay.'
  }
];

export const ChemistryQuiz: React.FC<ChemistryQuizProps> = ({ onClose, onSelectElement }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (elementNum: number) => {
    if (isAnswered) return;
    setSelectedAnswer(elementNum);
    setIsAnswered(true);

    if (elementNum === currentQ.correctNum) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-purple-900/40 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base sm:text-lg text-white">
              Thử Tài Hóa Học: Nguyên Tố & Cuộc Sống
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {!isFinished ? (
            <>
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Câu hỏi {currentIdx + 1} / {QUIZ_QUESTIONS.length}</span>
                  <span className="font-semibold text-purple-300">Điểm: {score}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Statement */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                {currentQ.question}
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.elementNum;
                  const isCorrect = opt.elementNum === currentQ.correctNum;

                  let btnStyle = 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-slate-200';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200 shadow-md';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950/70 border-rose-500/80 text-rose-200';
                    } else {
                      btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.elementNum}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(opt.elementNum)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt.label}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {isAnswered && (
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 space-y-2 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-purple-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Giải thích kiến thức hóa học:</span>
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => {
                        const el = getElementByNumber(currentQ.correctNum);
                        onSelectElement(el);
                        onClose();
                      }}
                      className="text-[11px] underline text-cyan-300 hover:text-cyan-200 cursor-pointer"
                    >
                      Khám phá mô hình 3D nguyên tử này →
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>{currentIdx + 1 === QUIZ_QUESTIONS.length ? 'Xem kết quả' : 'Câu tiếp theo'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Finished Results Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-bold text-white">
                Chúc mừng bạn đã hoàn thành bài đố vui!
              </h4>

              <p className="text-sm text-slate-300">
                Bạn đã trả lời đúng <strong className="text-purple-400 font-bold text-base">{score}</strong> / {QUIZ_QUESTIONS.length} câu hỏi.
              </p>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Chơi lại từ đầu</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Quay lại Bảng Tuần Hoàn
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

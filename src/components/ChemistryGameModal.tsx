import React, { useState, useMemo, useEffect } from 'react';
import { ElementData } from '../types/element';
import { getAllElements, getElementByNumber } from '../data/elementsData';
import { 
  X, Sparkles, Award, RotateCcw, HelpCircle, CheckCircle2, 
  AlertCircle, ArrowRight, Lightbulb, Flame, Trophy, Play, 
  Gamepad2, Shuffle, Atom, Clock, Star, Volume2
} from 'lucide-react';
import { speakElementName } from '../utils/audio';

interface ChemistryGameModalProps {
  onClose: () => void;
  onSelectElement: (element: ElementData) => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'clue-quiz' | 'word-guess';

interface GameItem {
  elementNumber: number;
  clue: string;
  hintProperty: string;
  difficulty: Difficulty;
}

// Curated accurate chemical clues based on element properties and applications
const GAME_DATABASE: GameItem[] = [
  // EASY LEVEL (THCS & Common elements)
  {
    elementNumber: 26,
    clue: 'Nguyên tố kim loại có ký hiệu Fe, là thành phần chủ yếu tạo nên thép xây dựng và hemoglobin trong máu người.',
    hintProperty: 'Số hiệu Z = 26, Nhóm VIIIB, Khối lượng nguyên tử xấp xỉ 56',
    difficulty: 'easy',
  },
  {
    elementNumber: 29,
    clue: 'Kim loại màu đỏ cam dẻo dai, dẫn điện và dẫn nhiệt xuất sắc, dùng làm lõi dây điện gia đình và nhạc cụ kèn đồng.',
    hintProperty: 'Ký hiệu Cu, Số hiệu Z = 29, Cấu hình electron đặc biệt [Ar] 3d¹⁰ 4s¹',
    difficulty: 'easy',
  },
  {
    elementNumber: 1,
    clue: 'Nguyên tố nhẹ nhất vũ trụ, khi kết hợp với oxy tạo thành nước và được dùng làm nhiên liệu lỏng cho tên lửa vũ trụ.',
    hintProperty: 'Ký hiệu H, Số hiệu Z = 1, Chu kì 1, Nhóm IA',
    difficulty: 'easy',
  },
  {
    elementNumber: 2,
    clue: 'Khí hiếm nhẹ không bao giờ cháy nổ, dùng để bơm khinh khí cầu an toàn và làm mát máy chụp cộng hưởng từ MRI ở bệnh viện.',
    hintProperty: 'Ký hiệu He, Số hiệu Z = 2, Lớp vỏ bão hòa 2 electron (1s²)',
    difficulty: 'easy',
  },
  {
    elementNumber: 6,
    clue: 'Nguyên tố là khung xương của mọi sinh vật sống, tồn tại dưới dạng kim cương quý giá, than chì ruột bút chì và sợi carbon siêu nhẹ.',
    hintProperty: 'Ký hiệu C, Số hiệu Z = 6, Chu kì 2, Nhóm IVA, Khối lượng = 12',
    difficulty: 'easy',
  },
  {
    elementNumber: 7,
    clue: 'Khí chiếm 78% bầu khí quyển Trái Đất, được bơm phồng trong gói bim bim để giữ khoai tây luôn giòn tan mà không bị ôi thiu.',
    hintProperty: 'Ký hiệu N, Số hiệu Z = 7, Liên kết ba N≡N siêu bền vững',
    difficulty: 'easy',
  },
  {
    elementNumber: 8,
    clue: 'Chất khí duy trì sự sống của con người khi hô hấp và duy trì sự cháy, dùng trong bình dưỡng khí y tế cấp cứu bệnh nhân.',
    hintProperty: 'Ký hiệu O, Số hiệu Z = 8, Chiếm 21% khí quyển Trái Đất',
    difficulty: 'easy',
  },
  {
    elementNumber: 11,
    clue: 'Kim loại kiềm mềm có thể cắt bằng dao, khi kết hợp với clo tạo thành muối ăn NaCl gia vị thiết yếu hàng ngày.',
    hintProperty: 'Ký hiệu Na, Số hiệu Z = 11, Cháy với ngọn lửa màu vàng tươi',
    difficulty: 'easy',
  },
  {
    elementNumber: 13,
    clue: 'Kim loại nhẹ bền bỉ chống gỉ tốt nhờ màng oxit bảo vệ, dùng làm khung vỏ máy bay, lon nước ngọt và giấy bạc nướng thực phẩm.',
    hintProperty: 'Ký hiệu Al, Số hiệu Z = 13, Kim loại phong phú nhất trong vỏ Trái Đất',
    difficulty: 'easy',
  },
  {
    elementNumber: 79,
    clue: 'Kim loại quý ánh vàng lộng lẫy không bao giờ bị rỉ sét, dùng làm trang sức quý giá và lớp mạ chắn bức xạ trên mũ phi hành gia.',
    hintProperty: 'Ký hiệu Au, Số hiệu Z = 79, Cực kỳ dẻo, 1g có thể dát mỏng 1m²',
    difficulty: 'easy',
  },

  // MEDIUM LEVEL (THPT & Key groups)
  {
    elementNumber: 3,
    clue: 'Kim loại nhẹ nhất bảng tuần hoàn (nổi trên cả nước và dầu hỏa), là trái tim cung cấp năng lượng cho pin sạc điện thoại và xe điện Tesla.',
    hintProperty: 'Ký hiệu Li, Số hiệu Z = 3, Cấu hình electron [He] 2s¹',
    difficulty: 'medium',
  },
  {
    elementNumber: 4,
    clue: 'Kim loại kiềm thổ siêu nhẹ và cứng, được dùng làm 18 tấm gương lục giác mạ vàng của kính viễn vọng không gian 10 tỷ USD James Webb.',
    hintProperty: 'Ký hiệu Be, Số hiệu Z = 4, Cấu hình electron [He] 2s²',
    difficulty: 'medium',
  },
  {
    elementNumber: 9,
    clue: 'Nguyên tố có độ âm điện lớn nhất trong toàn bộ bảng tuần hoàn (3.98), có trong kem đánh răng để bảo vệ men răng chống sâu răng.',
    hintProperty: 'Ký hiệu F, Số hiệu Z = 9, Halogen đứng đầu nhóm VIIA',
    difficulty: 'medium',
  },
  {
    elementNumber: 10,
    clue: 'Khí hiếm trơ phát ra ánh sáng đỏ cam rực rỡ khi có dòng điện phóng qua, dùng làm biển hiệu quảng cáo đường phố về đêm.',
    hintProperty: 'Ký hiệu Ne, Số hiệu Z = 10, Lớp ngoài cùng bão hòa 8 electron (2s² 2p⁶)',
    difficulty: 'medium',
  },
  {
    elementNumber: 12,
    clue: 'Kim loại nằm ở vị trí trung tâm của phân tử diệp lục giúp cây xanh quang hợp, đồng thời bột kim loại này cháy sáng lòa làm pháo hoa.',
    hintProperty: 'Ký hiệu Mg, Số hiệu Z = 12, Nhóm IIA (Kiềm thổ)',
    difficulty: 'medium',
  },
  {
    elementNumber: 14,
    clue: 'Chất bán dẫn then chốt của Thung lũng công nghệ, dùng sản xuất hàng tỷ bóng bán dẫn trên chip CPU máy tính và tấm pin mặt trời.',
    hintProperty: 'Ký hiệu Si, Số hiệu Z = 14, Chu kì 3, Nhóm IVA, Cát thạch anh SiO2',
    difficulty: 'medium',
  },
  {
    elementNumber: 17,
    clue: 'Khí màu vàng lục mùi hắc có tính oxy hóa mạnh, dùng để khử trùng làm sạch nước sinh hoạt thành phố và sản xuất ống nhựa PVC.',
    hintProperty: 'Ký hiệu Cl, Số hiệu Z = 17, Khối lượng nguyên tử làm tròn 35.5',
    difficulty: 'medium',
  },
  {
    elementNumber: 35,
    clue: 'Phi kim duy nhất ở thể lỏng ở nhiệt độ phòng (25°C), có màu nâu đỏ bốc khói cay, hợp chất AgBr từng dùng tráng phim chụp ảnh.',
    hintProperty: 'Ký hiệu Br, Số hiệu Z = 35, Nhóm Halogen VIIA, Chu kì 4',
    difficulty: 'medium',
  },
  {
    elementNumber: 47,
    clue: 'Kim loại có độ dẫn điện và dẫn nhiệt tốt nhất trong tất cả các kim loại, hạt nano của nó diệt khuẩn cực mạnh trong bình sữa trẻ em.',
    hintProperty: 'Ký hiệu Ag, Số hiệu Z = 47, Dùng tráng gương soi phản chiếu ánh sáng',
    difficulty: 'medium',
  },
  {
    elementNumber: 80,
    clue: 'Kim loại duy nhất ở thể lỏng ở nhiệt độ phòng (25°C), giãn nở nhiệt đều dùng trong nhiệt kế y tế đo thân nhiệt và bóng đèn huỳnh quang.',
    hintProperty: 'Ký hiệu Hg, Số hiệu Z = 80, Nhóm IIB, Chu kì 6',
    difficulty: 'medium',
  },

  // HARD LEVEL (Advanced / Specialty & Superheavy)
  {
    elementNumber: 22,
    clue: 'Kim loại chuyển tiếp nhẹ như nhôm cứng như thép, tương thích sinh học hoàn hảo dùng làm khớp xương nhân tạo cấy ghép và vỏ tàu vũ trụ.',
    hintProperty: 'Ký hiệu Ti, Số hiệu Z = 22, Cấu hình electron [Ar] 3d² 4s²',
    difficulty: 'hard',
  },
  {
    elementNumber: 74,
    clue: 'Kim loại có nhiệt độ nóng chảy cao nhất thế giới (3422°C), được dùng làm dây tóc bóng đèn sợi đốt và mũi khoan hợp kim siêu cứng.',
    hintProperty: 'Ký hiệu W (Vonfram/Tungsten), Số hiệu Z = 74, Nhóm VIB',
    difficulty: 'hard',
  },
  {
    elementNumber: 92,
    clue: 'Kim loại phóng xạ nặng tự nhiên, là nguồn nhiên liệu phân hạch hạt nhân cung cấp điện sạch khổng lồ cho các nhà máy điện nguyên tử.',
    hintProperty: 'Ký hiệu U, Số hiệu Z = 92, Chu kì bán rã 4.5 tỷ năm giúp định tuổi Trái Đất',
    difficulty: 'hard',
  },
  {
    elementNumber: 55,
    clue: 'Kim loại kiềm có tần số dao động nguyên tử cực kỳ ổn định, được thế giới dùng để định nghĩa tiêu chuẩn độ dài 1 giây quốc tế.',
    hintProperty: 'Ký hiệu Cs (Xesi), Số hiệu Z = 55, Bán kính nguyên tử lớn kỷ lục',
    difficulty: 'hard',
  },
  {
    elementNumber: 60,
    clue: 'Nguyên tố đất hiếm họ Lanthanide tạo nên loại nam châm vĩnh cửu hút mạnh nhất thế giới (NdFeB), có trong tai nghe AirPods và động cơ xe điện.',
    hintProperty: 'Ký hiệu Nd (Neodim), Số hiệu Z = 60, Phân lớp 4f⁴',
    difficulty: 'hard',
  },
  {
    elementNumber: 78,
    clue: 'Kim loại quý vương giả (Bạch kim), vừa làm trang sức xa xỉ vừa là chất xúc tác chuyển đổi khí thải ô tô và thuốc điều trị ung thư Cisplatin.',
    hintProperty: 'Ký hiệu Pt (Platin), Số hiệu Z = 78, Nhóm VIIIB',
    difficulty: 'hard',
  },
  {
    elementNumber: 118,
    clue: 'Nguyên tố cuối cùng của bảng tuần hoàn hiện tại (Z=118), thuộc nhóm khí hiếm, vinh danh nhà vật lý hạt nhân Yuri Oganessian.',
    hintProperty: 'Ký hiệu Og (Oganesson), Số hiệu Z = 118, Chu kì 7, Nhóm VIIIA',
    difficulty: 'hard',
  }
];

export const ChemistryGameModal: React.FC<ChemistryGameModalProps> = ({
  onClose,
  onSelectElement,
}) => {
  const allElements = useMemo(() => getAllElements(), []);

  // Settings
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameMode, setGameMode] = useState<GameMode>('clue-quiz');

  // Game state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Word-guess mode specific state
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(6);

  // Filter pool by chosen difficulty
  const questionPool = useMemo(() => {
    return GAME_DATABASE.filter((q) => q.difficulty === difficulty);
  }, [difficulty]);

  const currentItem = questionPool[currentIndex] || questionPool[0];
  const targetElement = getElementByNumber(currentItem.elementNumber);

  // Generate 4 randomized options for Quiz Mode
  const quizOptions = useMemo(() => {
    const correctEl = targetElement;
    // Pick 3 plausible distractors
    const distractors = allElements
      .filter((e) => e.number !== correctEl.number)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const list = [correctEl, ...distractors];
    // Shuffle
    return list.sort(() => Math.random() - 0.5);
  }, [targetElement, allElements, currentIndex]);

  // Restart or change difficulty
  const handleStartGame = (newDiff?: Difficulty, newMode?: GameMode) => {
    if (newDiff) setDifficulty(newDiff);
    if (newMode) setGameMode(newMode);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setGameOver(false);
    setGuessedLetters([]);
    setRemainingAttempts(6);
  };

  // Next question
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questionPool.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
      setGuessedLetters([]);
      setRemainingAttempts(6);
    } else {
      setGameOver(true);
    }
  };

  // Handle option select in Clue Quiz
  const handleSelectOption = (num: number) => {
    if (isAnswered) return;
    setSelectedOption(num);
    setIsAnswered(true);

    if (num === targetElement.number) {
      setScore((prev) => prev + (showHint ? 5 : 10));
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  // Handle letter guess in Word-guess Mode
  const handleGuessLetter = (letter: string) => {
    if (isAnswered || guessedLetters.includes(letter)) return;

    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    const targetWord = targetElement.symbol.toUpperCase();
    if (!targetWord.includes(letter)) {
      const newAttempts = remainingAttempts - 1;
      setRemainingAttempts(newAttempts);
      if (newAttempts <= 0) {
        setIsAnswered(true);
        setStreak(0);
      }
    } else {
      // Check if full word solved
      const isComplete = targetWord.split('').every((l) => newGuessed.includes(l));
      if (isComplete) {
        setIsAnswered(true);
        setScore((prev) => prev + 15);
        setStreak((prev) => prev + 1);
      }
    }
  };

  const keyboardLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-2xl max-h-[94vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Game Header */}
        <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-md">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                  Trò Chơi Hóa Học: Thám Tử Nguyên Tố
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase font-mono">
                  Độ khó: {difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Đoán tên & ký hiệu nguyên tố qua thuộc tính khoa học và ứng dụng thực tế
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty & Mode Switcher Bar */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Difficulty Chips */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Cấp độ:</span>
            <button
              onClick={() => handleStartGame('easy')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                difficulty === 'easy'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Dễ (THCS)
            </button>
            <button
              onClick={() => handleStartGame('medium')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                difficulty === 'medium'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Trung bình (THPT)
            </button>
            <button
              onClick={() => handleStartGame('hard')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                difficulty === 'hard'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Khó (Chuyên Hóa)
            </button>
          </div>

          {/* Game Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => handleStartGame(undefined, 'clue-quiz')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                gameMode === 'clue-quiz'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Câu đố 4 lựa chọn
            </button>
            <button
              onClick={() => handleStartGame(undefined, 'word-guess')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                gameMode === 'word-guess'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ô chữ ký hiệu hóa học
            </button>
          </div>
        </div>

        {/* Game Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {!gameOver ? (
            <>
              {/* Score & Streak Header */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">
                    Câu hỏi: <strong className="text-white">{currentIndex + 1}</strong> / {questionPool.length}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                    Điểm: {score}
                  </span>
                </div>

                {streak > 1 && (
                  <div className="flex items-center gap-1 text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Chuỗi thắng: {streak} 🔥</span>
                  </div>
                )}
              </div>

              {/* Clue Prompt Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-850 border border-slate-700 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Gợi ý thuộc tính & Ứng dụng:
                  </span>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 cursor-pointer bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 transition"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Ẩn manh mối' : 'Xem manh mối phụ'}</span>
                  </button>
                </div>

                <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  "{currentItem.clue}"
                </p>

                {showHint && (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2 animate-in fade-in">
                    <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 block mb-0.5">Manh mối thông số:</strong>
                      <span>{currentItem.hintProperty}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* MODE 1: CLUE QUIZ 4-OPTIONS */}
              {gameMode === 'clue-quiz' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {quizOptions.map((opt) => {
                    const isSelected = selectedOption === opt.number;
                    const isCorrect = opt.number === targetElement.number;

                    let btnStyle = 'bg-slate-800/80 border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-slate-200';
                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40 shadow-lg';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      } else {
                        btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={opt.number}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(opt.number)}
                        className={`p-4 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex flex-col items-center justify-center font-bold">
                            <span className="text-[9px] text-slate-400 leading-none">{opt.number}</span>
                            <span className="text-base font-extrabold text-cyan-300 leading-none">{opt.symbol}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <strong className="text-sm block text-white">{opt.name}</strong>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  speakElementName(opt.name);
                                }}
                                title={`Nghe phát âm IUPAC: ${opt.name}`}
                                className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-700/60 transition cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs text-emerald-400 font-medium">
                                {opt.vietnamesePhonetics ? `Đọc là: ${opt.vietnamesePhonetics}` : (opt.vietnameseTraditionalName ? `(tên cũ: ${opt.vietnameseTraditionalName})` : `(${opt.vietnameseName})`)}
                              </span>
                              {opt.valency && (
                                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                                  HT: {opt.valency.split(' ')[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* MODE 2: CHEMICAL WORD / SYMBOL GUESS */}
              {gameMode === 'word-guess' && (
                <div className="space-y-4 pt-2">
                  {/* Revealed tiles */}
                  <div className="flex items-center justify-center gap-2 py-4 bg-slate-950/60 rounded-xl border border-slate-800">
                    {targetElement.symbol.toUpperCase().split('').map((char, cIdx) => {
                      const isRevealed = guessedLetters.includes(char) || isAnswered;

                      return (
                        <div
                          key={cIdx}
                          className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center font-black text-2xl shadow-md transition-all ${
                            isRevealed
                              ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 scale-105'
                              : 'bg-slate-900 border-slate-700 text-transparent'
                          }`}
                        >
                          {isRevealed ? char : '?'}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                    <span>Số lượt thử còn lại: <strong className="text-rose-400 font-bold">{remainingAttempts}</strong></span>
                    <span>Ký hiệu có <strong className="text-cyan-300">{targetElement.symbol.length}</strong> chữ cái</span>
                  </div>

                  {/* Virtual Alphabet Keypad */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    {keyboardLetters.map((l) => {
                      const isGuessed = guessedLetters.includes(l);
                      const isMatch = targetElement.symbol.toUpperCase().includes(l);

                      let keyColor = 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700';
                      if (isGuessed) {
                        keyColor = isMatch
                          ? 'bg-emerald-900 border-emerald-500 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-600 opacity-40';
                      }

                      return (
                        <button
                          key={l}
                          disabled={isGuessed || isAnswered}
                          onClick={() => handleGuessLetter(l)}
                          className={`w-8 h-9 rounded-lg font-bold text-xs border transition cursor-pointer ${keyColor}`}
                        >
                          {l}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Result explanation & Next Question button */}
              {isAnswered && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/50 to-slate-900 border border-purple-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="font-bold text-white text-sm">
                        Đáp án chính xác: <strong className="text-cyan-300">{targetElement.name} ({targetElement.symbol})</strong>
                      </span>
                      {targetElement.ipaPronunciation && (
                        <span className="text-xs font-mono text-purple-300 bg-purple-900/50 border border-purple-700/50 px-2 py-0.5 rounded-full">
                          {targetElement.ipaPronunciation}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => speakElementName(targetElement.name)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 flex items-center gap-1.5 text-xs font-medium cursor-pointer transition active:scale-95"
                        title="Nghe phát âm danh pháp IUPAC"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-300" />
                        <span>Phát âm IUPAC</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        onSelectElement(targetElement);
                        onClose();
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 flex items-center gap-1 cursor-pointer"
                    >
                      <Atom className="w-3.5 h-3.5" />
                      <span>Xem mô hình 3D</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {targetElement.summaryVi}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition active:scale-95 cursor-pointer"
                    >
                      <span>{currentIndex + 1 === questionPool.length ? 'Tổng kết kết quả' : 'Câu tiếp theo'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Game Over Screen */
            <div className="py-8 text-center space-y-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-purple-500/20">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-white">
                  Hoàn Thành Thử Thách Hóa Học!
                </h4>
                <p className="text-sm text-slate-300 mt-1">
                  Bạn đã xuất sắc vượt qua các câu hỏi thuộc cấp độ <strong className="text-purple-400 capitalize">{difficulty}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 max-w-sm mx-auto flex items-center justify-around">
                <div>
                  <span className="text-[11px] text-slate-400 block">Tổng điểm</span>
                  <strong className="text-2xl font-black text-amber-400 font-mono">{score}</strong>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Số câu hoàn thành</span>
                  <strong className="text-2xl font-black text-cyan-400 font-mono">{questionPool.length}</strong>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => handleStartGame()}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại vòng này</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition active:scale-95 cursor-pointer"
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

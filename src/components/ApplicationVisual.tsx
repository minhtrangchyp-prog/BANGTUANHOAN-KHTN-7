import React, { useState } from 'react';
import { ElementApplication, ApplicationVisualType, ElementData } from '../types/element';
import { 
  Sparkles, Play, Pause, RotateCw, ZoomIn, Image as ImageIcon, 
  Activity, Zap, Flame, Rocket, Radio, Shield, Sun, Eye, Layers
} from 'lucide-react';

interface ApplicationVisualProps {
  application: ElementApplication;
  element: ElementData;
  index: number;
}

// Curated high-resolution scientific photography for authentic real-world applications
const PHOTO_MAP: Record<ApplicationVisualType, { url: string; caption: string }> = {
  'rocket': {
    url: 'https://images.unsplash.com/photo-1517976487502-5f79e96e1058?auto=format&fit=crop&w=800&q=80',
    caption: 'Động cơ tên lửa không gian đốt cháy Hydro và Oxy lỏng tạo lực đẩy cực đại',
  },
  'battery': {
    url: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?auto=format&fit=crop&w=800&q=80',
    caption: 'Pin Lithium-ion mật độ năng lượng cao dùng trong xe điện và thiết bị thông minh',
  },
  'mri': {
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    caption: 'Hệ thống chụp cộng hưởng từ MRI làm mát bằng Heli lỏng siêu dẫn ở -269°C',
  },
  'telescope': {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    caption: 'Kính viễn vọng James Webb (JWST) với 18 gương Beri mạ vàng chụp sâu vào vũ trụ',
  },
  'microchip': {
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    caption: 'Phiến bán dẫn Silicon chứa hàng chục tỷ transistor trên vi xử lý siêu máy tính',
  },
  'hemoglobin': {
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    caption: 'Luyện thép hợp kim chịu lực và cấu trúc nguyên tử sắt trong hồng cầu sinh học',
  },
  'copper-wire': {
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    caption: 'Lõi dây cáp đồng nguyên chất dẫn điện tối ưu trong mạng lưới năng lượng quốc gia',
  },
  'neon-tube': {
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    caption: 'Đèn phóng điện khí hiếm Neon phát quang rực rỡ trong bóng tối',
  },
  'fireworks': {
    url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=800&q=80',
    caption: 'Pháo hoa màu sắc rực rỡ từ sự phát xạ quang phổ của các muối kim loại',
  },
  'mercury-tube': {
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    caption: 'Cột thủy ngân lỏng giãn nở chính xác dùng trong thiết bị đo nhiệt độ và áp suất',
  },
  'water-purify': {
    url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
    caption: 'Quy trình khử trùng clo và xử lý nước sạch phục vụ hàng triệu người dân',
  },
  'tooth-shield': {
    url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
    caption: 'Hợp chất Flour tái khoáng hóa men răng và chống lại sự ăn mòn axit',
  },
  'nuclear-reactor': {
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    caption: 'Lò phản ứng năng lượng hạt nhân phân hạch Uranium cung cấp nguồn điện phát thải thấp',
  },
  'airplane-titanium': {
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    caption: 'Khung máy bay siêu nhẹ và chi tiết cấy ghép y tế từ hợp kim Titan siêu bền',
  },
  'solar-panel': {
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    caption: 'Trang trại tấm pin năng lượng mặt trời quang điện chuyển đổi photon ánh sáng',
  },
  'gold-visor': {
    url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80',
    caption: 'Lớp phủ vàng nguyên chất phản xạ 98% bức xạ hồng ngoại trên mũ phi hành gia',
  },
  'fertilizer': {
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    caption: 'Phân đạm và phân bón khoáng chất nuôi dưỡng đồng ruộng và cây trồng nông nghiệp',
  },
  'chlorophyll': {
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    caption: 'Magie là tâm phân tử diệp lục trong lục lạp tế bào thực vật giúp quang hợp',
  },
  'diamond-lattice': {
    url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
    caption: 'Mạng tinh thể kim cương và than chì từ liên kết cộng hóa trị bền vững của Carbon',
  },
  'magnet-field': {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    caption: 'Nam châm vĩnh cửu Neodymium siêu mạnh tạo lực từ trường khổng lồ',
  },
  'laser-fiber': {
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    caption: 'Tia laser kết hợp sợi thủy tinh quang học truyền dẫn thông tin tốc độ ánh sáng',
  },
  'generic-science': {
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    caption: 'Nghiên cứu nguyên tố hóa học trong phòng thí nghiệm khoa học hiện đại',
  },
};

// Automatic resolver to determine the most vivid visual type for each application
function resolveVisualType(app: ElementApplication, element: ElementData): ApplicationVisualType {
  if (app.visualType) return app.visualType;

  const t = (app.title + ' ' + app.description + ' ' + app.iconName).toLowerCase();
  const z = element.number;

  if (t.includes('tên lửa') || t.includes('rocket') || t.includes('khí cầu') || t.includes('đẩy') || z === 1) {
    if (t.includes('phân bón') || t.includes('haber')) return 'fertilizer';
    return 'rocket';
  }
  if (t.includes('pin') || t.includes('battery') || t.includes('lithium') || t.includes('tesla') || t.includes('sạc') || z === 3) {
    return 'battery';
  }
  if (t.includes('mri') || t.includes('cộng hưởng từ') || t.includes('siêu dẫn') || (z === 2 && t.includes('mát'))) {
    return 'mri';
  }
  if (t.includes('james webb') || t.includes('viễn vọng') || t.includes('jwst') || t.includes('kính thiên văn') || z === 4) {
    return 'telescope';
  }
  if (t.includes('chip') || t.includes('bán dẫn') || t.includes('silicon') || t.includes('cpu') || t.includes('transistor') || z === 14) {
    return 'microchip';
  }
  if (t.includes('máu') || t.includes('hemoglobin') || t.includes('hồng cầu') || t.includes('thép') || t.includes('gang') || z === 26) {
    return 'hemoglobin';
  }
  if (t.includes('dây điện') || t.includes('dẫn điện') || t.includes('đồng') || t.includes('cáp điện') || z === 29) {
    return 'copper-wire';
  }
  if (t.includes('đèn neon') || t.includes('quảng cáo') || t.includes('phóng điện') || z === 10 || (element.category === 'noble-gas' && t.includes('đèn'))) {
    return 'neon-tube';
  }
  if (t.includes('pháo hoa') || t.includes('cháy sáng') || t.includes('ngọn lửa') || z === 38 || z === 56) {
    return 'fireworks';
  }
  if (t.includes('nhiệt kế') || t.includes('thủy ngân') || t.includes('áp kế') || z === 80) {
    return 'mercury-tube';
  }
  if (t.includes('lọc nước') || t.includes('khử trùng') || t.includes('nước sinh hoạt') || t.includes('clo') || z === 17) {
    return 'water-purify';
  }
  if (t.includes('răng') || t.includes('men răng') || t.includes('kem đánh răng') || z === 9) {
    return 'tooth-shield';
  }
  if (t.includes('hạt nhân') || t.includes('phóng xạ') || t.includes('phân hạch') || t.includes('lò phản ứng') || z === 92 || z === 94) {
    return 'nuclear-reactor';
  }
  if (t.includes('máy bay') || t.includes('xương nhân tạo') || t.includes('khung') || z === 22 || z === 13) {
    return 'airplane-titanium';
  }
  if (t.includes('mặt trời') || t.includes('quang điện') || t.includes('solar')) {
    return 'solar-panel';
  }
  if (t.includes('vàng') || t.includes('mạ vàng') || t.includes('mũ phi hành') || z === 79) {
    return 'gold-visor';
  }
  if (t.includes('phân bón') || t.includes('đạm') || t.includes('nông nghiệp') || z === 7 || z === 15) {
    return 'fertilizer';
  }
  if (t.includes('diệp lục') || t.includes('quang hợp') || z === 12) {
    return 'chlorophyll';
  }
  if (t.includes('kim cương') || t.includes('than chì') || t.includes('graphene') || z === 6) {
    return 'diamond-lattice';
  }
  if (t.includes('nam châm') || t.includes('từ trường') || z === 60) {
    return 'magnet-field';
  }
  if (t.includes('laser') || t.includes('quang học') || t.includes('sợi quang') || z === 31 || z === 39) {
    return 'laser-fiber';
  }

  return 'generic-science';
}

export const ApplicationVisual: React.FC<ApplicationVisualProps> = ({
  application,
  element,
  index,
}) => {
  const visualType = resolveVisualType(application, element);
  const photoData = PHOTO_MAP[visualType] || PHOTO_MAP['generic-science'];
  const photoUrl = application.imageUrl || photoData.url;

  // View state: 'animation' (default dynamic interactive) vs 'photo' (authentic photography)
  const [activeView, setActiveView] = useState<'animation' | 'photo'>('animation');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [interactiveStep, setInteractiveStep] = useState<number>(0);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  // Trigger interactive action
  const handleInteract = () => {
    setInteractiveStep((prev) => (prev + 1) % 4);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/70 bg-slate-950/80 shadow-md relative group flex flex-col">
      {/* Top Bar with Mode Toggle & Category */}
      <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px] gap-2">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold truncate">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="truncate">{application.title}</span>
        </div>

        {/* Animation vs Photo Switcher */}
        <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('animation')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
              activeView === 'animation'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Xem mô phỏng động"
          >
            <Sparkles className="w-3 h-3" />
            <span>Mô phỏng động</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('photo')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
              activeView === 'photo'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Xem ảnh thực tế"
          >
            <ImageIcon className="w-3 h-3" />
            <span>Ảnh thực tế</span>
          </button>
        </div>
      </div>

      {/* Main Visual Display Area (Height ~190px) */}
      <div className="h-48 w-full relative overflow-hidden bg-slate-950 flex items-center justify-center select-none">
        {/* MODE 1: DYNAMIC ANIMATED SIMULATION */}
        {activeView === 'animation' && (
          <div className="w-full h-full relative flex items-center justify-center p-2">
            {renderDynamicSimulation(visualType, isPlaying, interactiveStep, element)}

            {/* Floating Interactive Controller Bar */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10 bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700/80 shadow-lg text-[10px]">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition cursor-pointer"
                title={isPlaying ? 'Tạm dừng mô phỏng' : 'Tiếp tục chuyển động'}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={handleInteract}
                className="px-2 py-0.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 font-semibold flex items-center gap-1 transition active:scale-95 cursor-pointer"
                title="Tác động tương tác vào mô phỏng"
              >
                <RotateCw className="w-3 h-3" />
                <span>Tương tác</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: AUTHENTIC PHOTOGRAPHY */}
        {(activeView === 'photo' || imgError) && (
          <div className="w-full h-full relative group">
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
                <span className="text-xs text-slate-500">Đang tải hình ảnh khoa học...</span>
              </div>
            )}

            <img
              src={photoUrl}
              alt={application.title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                setImgError(true);
                setActiveView('animation'); // Gracefully fallback to animation
              }}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>

            <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-sm p-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-300 pointer-events-none">
              <p className="line-clamp-1">{photoData.caption}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Procedural dynamic animated SVG graphics for each visual type
function renderDynamicSimulation(
  type: ApplicationVisualType,
  isPlaying: boolean,
  step: number,
  element: ElementData
) {
  const animClass = isPlaying ? '' : '[animation-play-state:paused]';

  switch (type) {
    case 'rocket':
      return (
        <div className={`w-full h-full relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 ${animClass}`}>
          {/* Stars background */}
          <div className="absolute inset-0 opacity-40">
            <span className="absolute top-3 left-6 w-1 h-1 bg-white rounded-full animate-ping"></span>
            <span className="absolute top-10 right-10 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse"></span>
            <span className="absolute bottom-6 left-12 w-1 h-1 bg-amber-200 rounded-full"></span>
            <span className="absolute top-5 right-28 w-1 h-1 bg-white rounded-full"></span>
          </div>

          {/* Rocket Body */}
          <div className={`relative flex flex-col items-center transition-transform duration-300 ${isPlaying ? 'animate-float-slow' : ''}`}>
            {/* Nose Cone */}
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-cyan-400"></div>
            {/* Rocket Hull */}
            <div className="w-7 h-16 bg-gradient-to-r from-slate-200 via-white to-slate-300 rounded-sm relative border-x border-slate-400 shadow-md flex flex-col items-center justify-around py-1">
              <div className="w-3 h-3 rounded-full bg-cyan-600 border border-slate-700 flex items-center justify-center text-[7px] text-white font-bold">
                {element.symbol}
              </div>
              <span className="text-[7px] font-mono text-slate-700 font-extrabold tracking-tighter">H₂ / O₂</span>
              <div className="w-5 h-1 bg-red-600 rounded"></div>
            </div>
            {/* Fins */}
            <div className="w-11 h-4 flex justify-between -mt-3">
              <div className="w-2 h-4 bg-cyan-600 -skew-x-12 rounded-bl"></div>
              <div className="w-2 h-4 bg-cyan-600 skew-x-12 rounded-br"></div>
            </div>
            {/* Exhaust Flame */}
            <div className={`flex flex-col items-center -mt-0.5 ${isPlaying ? 'animate-exhaust-flame' : ''}`}>
              <div className="w-4 h-9 bg-gradient-to-b from-cyan-300 via-amber-400 to-rose-600 rounded-b-full filter blur-[1px]"></div>
              <div className="w-2 h-5 bg-white rounded-b-full -mt-8 filter blur-[0.5px]"></div>
            </div>
          </div>

          {/* Propulsion Reaction Formula Callout */}
          <div className="absolute top-2 left-2 bg-slate-900/90 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300">
            2H₂ + O₂ → 2H₂O (v = 4500 m/s)
          </div>
        </div>
      );

    case 'battery':
      const chargePct = 40 + ((step * 20) % 60);
      return (
        <div className={`w-full h-full relative flex flex-col items-center justify-center p-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 ${animClass}`}>
          {/* Battery Cell Diagram */}
          <div className="w-64 h-24 rounded-xl border-2 border-emerald-500/60 bg-slate-900/90 relative p-2 flex items-center justify-between shadow-lg shadow-emerald-950/50">
            {/* Battery Terminal Pin */}
            <div className="absolute -right-3 w-2.5 h-8 bg-emerald-500 rounded-r-md"></div>

            {/* Anode (Graphite) */}
            <div className="w-12 h-full bg-slate-800 rounded border border-slate-700 flex flex-col items-center justify-center text-[9px] text-slate-400">
              <span className="font-bold text-rose-400">Anode (-)</span>
              <span className="text-[8px] font-mono">C₆ (Than)</span>
            </div>

            {/* Electrolyte & Moving Li+ ions */}
            <div className="flex-1 h-full px-2 flex flex-col justify-around relative overflow-hidden">
              <div className="flex justify-between items-center text-[9px] text-cyan-300 font-mono">
                <span>Dòng ion Li⁺ →</span>
                <span className="text-emerald-400 font-bold">{chargePct}%</span>
              </div>
              <div className="relative w-full h-6 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${chargePct}%` }}
                ></div>
                {/* Floating Li+ Particles */}
                <div className="absolute inset-0 flex items-center justify-around">
                  <span className={`w-3.5 h-3.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[8px] flex items-center justify-center shadow-sm ${isPlaying ? 'animate-bounce' : ''}`}>Li⁺</span>
                  <span className={`w-3.5 h-3.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[8px] flex items-center justify-center shadow-sm ${isPlaying ? 'animate-bounce delay-150' : ''}`}>Li⁺</span>
                  <span className={`w-3.5 h-3.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[8px] flex items-center justify-center shadow-sm ${isPlaying ? 'animate-bounce delay-300' : ''}`}>Li⁺</span>
                </div>
              </div>
              <div className="text-[8px] text-center text-slate-400">
                Chuyển dịch electron: <strong className="text-cyan-300">Li ⇌ Li⁺ + e⁻</strong>
              </div>
            </div>

            {/* Cathode (LiCoO2) */}
            <div className="w-12 h-full bg-slate-800 rounded border border-slate-700 flex flex-col items-center justify-center text-[9px] text-slate-400">
              <span className="font-bold text-cyan-400">Cathode (+)</span>
              <span className="text-[8px] font-mono">LiCoO₂</span>
            </div>
          </div>
        </div>
      );

    case 'mri':
      return (
        <div className={`w-full h-full relative flex items-center justify-center bg-slate-950 overflow-hidden ${animClass}`}>
          {/* Concentric Magnetic Waves */}
          <div className="relative flex items-center justify-center">
            <div className={`w-36 h-36 rounded-full border border-cyan-500/20 flex items-center justify-center ${isPlaying ? 'animate-ping' : ''}`}></div>
            <div className={`absolute w-28 h-28 rounded-full border-2 border-cyan-400/40 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}></div>
            <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-indigo-900 to-cyan-900 border-2 border-cyan-400 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/30">
              <Activity className="w-6 h-6 text-cyan-300 animate-pulse" />
              <span className="text-[7px] text-white font-mono font-bold">MRI 3.0T</span>
            </div>
          </div>

          <div className="absolute top-2 left-2 bg-slate-900/90 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] text-blue-300 font-mono">
            Cuộn siêu dẫn Heli: -269°C (4.2 K)
          </div>
        </div>
      );

    case 'telescope':
      return (
        <div className={`w-full h-full relative flex items-center justify-center bg-slate-950 overflow-hidden ${animClass}`}>
          {/* Deep Space Background */}
          <div className="absolute inset-0 bg-radial from-indigo-950/40 via-purple-950/20 to-slate-950"></div>

          {/* Hexagonal Honeycomb Mirror (JWST Beryllium Gold-Coated) */}
          <div className={`relative flex items-center justify-center ${isPlaying ? 'animate-pulse-glow' : ''}`}>
            <div className="grid grid-cols-3 gap-1 p-2 bg-slate-900/40 rounded-2xl border border-amber-500/30 backdrop-blur-sm">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-9 bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 rounded-md border border-amber-200 flex items-center justify-center shadow-md transform hover:scale-110 transition cursor-pointer"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <span className="text-[7px] font-black text-amber-950">Be-Au</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] text-amber-300 font-mono">
            Gương Beri mạ vàng • Nhiệt độ: -233°C
          </div>
        </div>
      );

    case 'microchip':
      return (
        <div className={`w-full h-full relative flex items-center justify-center bg-slate-950 p-2 overflow-hidden ${animClass}`}>
          {/* Silicon Chip Die */}
          <div className="w-40 h-28 rounded-xl bg-slate-900 border-2 border-emerald-500/60 relative p-2 shadow-xl shadow-emerald-950/50 flex flex-col items-center justify-center">
            {/* Pin legs */}
            <div className="absolute -top-1.5 inset-x-4 flex justify-between">
              {[...Array(8)].map((_, i) => <div key={i} className="w-1.5 h-2 bg-emerald-400 rounded-sm"></div>)}
            </div>
            <div className="absolute -bottom-1.5 inset-x-4 flex justify-between">
              {[...Array(8)].map((_, i) => <div key={i} className="w-1.5 h-2 bg-emerald-400 rounded-sm"></div>)}
            </div>

            {/* Core processor */}
            <div className={`w-20 h-14 rounded-lg bg-emerald-950/80 border border-emerald-400/80 flex flex-col items-center justify-center relative ${isPlaying ? 'animate-pulse' : ''}`}>
              <span className="text-[9px] font-extrabold text-emerald-300 font-mono">Si CPU 3nm</span>
              <span className="text-[7px] text-emerald-400 font-mono">15 Tỷ Transistor</span>
            </div>

            {/* Circuit data pulses */}
            <div className="absolute inset-2 pointer-events-none opacity-40">
              <div className="w-full h-0.5 bg-emerald-400 my-1 animate-pulse"></div>
            </div>
          </div>

          <div className="absolute top-2 left-2 bg-slate-900/90 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] text-emerald-300 font-mono">
            Bán dẫn Silicon tinh khiết 99.9999999%
          </div>
        </div>
      );

    case 'hemoglobin':
      return (
        <div className={`w-full h-full relative flex items-center justify-center bg-slate-950 overflow-hidden ${animClass}`}>
          {/* Red Blood Cell (Hồng cầu) */}
          <div className={`relative flex items-center justify-center ${isPlaying ? 'animate-float-slow' : ''}`}>
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-600 via-red-700 to-rose-950 border-4 border-rose-500 shadow-2xl shadow-rose-900/60 flex items-center justify-center relative">
              {/* Inner Biconcave Dimple */}
              <div className="w-14 h-14 rounded-full bg-rose-900/70 border border-rose-600 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-black text-white">Fe²⁺</span>
                <span className="text-[7px] text-rose-200">Heme Core</span>
              </div>

              {/* 4 Docking Oxygen Molecules */}
              <div className="absolute -top-1 w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[8px] flex items-center justify-center shadow animate-ping">O₂</div>
              <div className="absolute -bottom-1 w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[8px] flex items-center justify-center shadow">O₂</div>
              <div className="absolute -left-1 w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[8px] flex items-center justify-center shadow">O₂</div>
              <div className="absolute -right-1 w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[8px] flex items-center justify-center shadow">O₂</div>
            </div>
          </div>

          <div className="absolute top-2 left-2 bg-slate-900/90 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] text-rose-300 font-mono">
            Hemoglobin: 1 phân tử gắn 4 O₂
          </div>
        </div>
      );

    case 'copper-wire':
      return (
        <div className={`w-full h-full relative flex items-center justify-center bg-slate-950 p-4 ${animClass}`}>
          {/* Wire cross section */}
          <div className="w-60 h-16 rounded-xl bg-slate-800 border-2 border-amber-600 relative overflow-hidden flex items-center justify-around px-2 shadow-lg">
            {/* Outer insulation cutaway */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-blue-700 border-r-2 border-slate-900 flex items-center justify-center text-[8px] text-white font-bold">
              PVC Vỏ
            </div>

            {/* Glowing Copper Core with flowing electrons */}
            <div className="ml-14 flex-1 h-10 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 rounded-md relative flex items-center justify-around overflow-hidden shadow-inner">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full bg-cyan-300 text-slate-950 font-black text-[8px] flex items-center justify-center shadow-md ${
                    isPlaying ? 'animate-bounce' : ''
                  }`}
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  e⁻
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-2 left-2 bg-slate-900/90 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] text-amber-300 font-mono">
            Độ dẫn điện Cu: 59.6 × 10⁶ S/m
          </div>
        </div>
      );

    case 'neon-tube':
      const colors = ['#f43f5e', '#fb923c', '#a855f7', '#06b6d4'];
      const chosenColor = colors[step % colors.length];

      return (
        <div className={`w-full h-full relative flex items-center justify-center bg-slate-950 overflow-hidden ${animClass}`}>
          <div 
            className="p-5 rounded-2xl border-2 flex items-center justify-center transition-all duration-300"
            style={{ 
              borderColor: chosenColor,
              boxShadow: `0 0 25px ${chosenColor}, inset 0 0 15px ${chosenColor}` 
            }}
          >
            <div className="text-3xl font-black tracking-widest uppercase flex items-center gap-2" style={{ color: chosenColor }}>
              <span>{element.symbol}</span>
              <span className="text-sm font-sans font-normal opacity-90">{element.name}</span>
            </div>
          </div>

          <div className="absolute top-2 left-2 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono">
            Phóng điện ion hóa khí hiếm
          </div>
        </div>
      );

    case 'fireworks':
      return (
        <div className={`w-full h-full relative flex items-center justify-center bg-slate-950 overflow-hidden ${animClass}`}>
          {/* Multiple Fireworks Bursts */}
          <div className="relative flex items-center justify-center">
            <div className={`w-32 h-32 rounded-full border border-dashed border-rose-400/40 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
              <div className="w-20 h-20 rounded-full border border-amber-400/50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white shadow-xl shadow-amber-400 animate-ping"></div>
              </div>
            </div>

            {/* Exploding Sparkles */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="absolute w-2 h-10 origin-bottom"
                style={{ transform: `rotate(${deg}deg) translateY(-20px)` }}
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-md shadow-cyan-300 animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="absolute top-2 left-2 bg-slate-900/90 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] text-amber-300 font-mono">
            Quang phổ phát xạ ngọn lửa
          </div>
        </div>
      );

    case 'nuclear-reactor':
      return (
        <div className={`w-full h-full relative flex items-center justify-center bg-slate-950 overflow-hidden ${animClass}`}>
          {/* Cherenkov Blue Glow & Nuclear Core */}
          <div className="relative flex items-center justify-center">
            <div className={`w-32 h-32 rounded-full bg-cyan-500/10 border-2 border-cyan-400/50 flex items-center justify-center ${isPlaying ? 'animate-pulse-glow' : ''}`}>
              <div className="w-20 h-20 rounded-full bg-cyan-900/40 border border-cyan-300 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-black text-cyan-200">²³⁵U</span>
                <span className="text-[7px] text-cyan-400 font-mono">Phân hạch</span>
              </div>
            </div>
          </div>

          <div className="absolute top-2 left-2 bg-slate-900/90 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] text-cyan-300 font-mono">
            Bức xạ Cherenkov • ΔE = Δm · c²
          </div>
        </div>
      );

    default:
      // Generic high-tech scientific simulation
      return (
        <div className={`w-full h-full relative flex items-center justify-center bg-slate-950 overflow-hidden ${animClass}`}>
          <div className="relative flex items-center justify-center">
            <div className={`w-28 h-28 rounded-full border border-cyan-500/30 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
              <div className="w-20 h-20 rounded-full border border-purple-500/30 flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg">
                  {element.symbol}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-2 left-2 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono">
            Ứng dụng công nghệ & Khoa học
          </div>
        </div>
      );
  }
}

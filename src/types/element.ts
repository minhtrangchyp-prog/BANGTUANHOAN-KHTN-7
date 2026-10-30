export type ElementCategory = 
  | 'alkali-metal'           // Kim loại kiềm
  | 'alkaline-earth-metal'   // Kim loại kiềm thổ
  | 'transition-metal'       // Kim loại chuyển tiếp
  | 'post-transition-metal'  // Kim loại sau chuyển tiếp
  | 'metalloid'              // Á kim
  | 'reactive-nonmetal'      // Phi kim hoạt động (đa nguyên tử / khí)
  | 'halogen'                // Halogen
  | 'noble-gas'              // Khí hiếm
  | 'lanthanide'             // Lanthanide
  | 'actinide'               // Actinide
  | 'unknown';               // Chưa rõ tính chất

export type BroadCategory = 'metal' | 'nonmetal' | 'noble-gas';

export type StateOfMatter = 'solid' | 'liquid' | 'gas' | 'unknown';

export type ApplicationVisualType = 
  | 'rocket'
  | 'battery'
  | 'mri'
  | 'telescope'
  | 'microchip'
  | 'hemoglobin'
  | 'copper-wire'
  | 'neon-tube'
  | 'fireworks'
  | 'mercury-tube'
  | 'water-purify'
  | 'tooth-shield'
  | 'nuclear-reactor'
  | 'airplane-titanium'
  | 'solar-panel'
  | 'gold-visor'
  | 'fertilizer'
  | 'diamond-lattice'
  | 'magnet-field'
  | 'laser-fiber'
  | 'chlorophyll'
  | 'generic-science';

export interface ElementApplication {
  title: string;
  description: string;
  category: 'technology' | 'daily-life' | 'industry' | 'medicine' | 'nature' | 'aerospace';
  imageUrl?: string;
  visualType?: ApplicationVisualType;
  iconName: string;
  funFact?: string;
}

export interface ElementData {
  number: number; // Z
  symbol: string;
  name: string; // Tên IUPAC chuẩn GDPT 2018 (ví dụ: Hydrogen, Helium, Iron, Copper, Sodium, Potassium, Aluminium...)
  vietnameseName: string; // Tên IUPAC chuẩn GDPT 2018 dùng trong giảng dạy
  vietnameseTraditionalName?: string; // Tên gọi truyền thống cũ trước GDPT 2018 (ví dụ: Sắt, Đồng, Nhôm, Thủy ngân...)
  ipaPronunciation?: string; // Phiên âm quốc tế IPA (ví dụ: /ˈhaɪ.drə.dʒən/, /ˈaɪ.ərn/)
  atomicMass: number; // Khối lượng nguyên tử chuẩn
  roundedMass: number; // Khối lượng nguyên tử làm tròn theo SGK (H: 1, He: 4, C: 12...)
  massNumber?: number; // Số khối A nguyên của đồng vị chính (ví dụ: Cl: 35, H: 1, He: 4...)
  protons?: number; // Số proton: p = Z
  neutrons?: number; // Số neutron: n = A - Z
  electrons?: number; // Số electron: e = Z
  period: number; // Chu kì 1 - 7
  group: number; // Nhóm 1 - 18
  groupRoman: string; // IA, IIA, IIIB, etc. theo SGK Việt Nam
  broadCategory: BroadCategory; // 'metal' (Kim loại) | 'nonmetal' (Phi kim) | 'noble-gas' (Khí hiếm)
  category: ElementCategory;
  categoryNameVi: string;
  block: 's' | 'p' | 'd' | 'f';
  electronConfiguration: string; // e.g., "1s² 2s² 2p⁶ 3s¹"
  condensedElectronConfiguration: string; // e.g., "[Ne] 3s¹"
  electronsPerShell: number[]; // e.g., [2, 8, 1] cho Na (K, L, M, N...)
  electronegativity: number | null; // Pauling
  atomicRadiusPm: number | null; // Bán kính nguyên tử (pm)
  meltingPointKelvin: number | null;
  boilingPointKelvin: number | null;
  densityGPerCm3: number | null; // g/cm³
  oxidationStates: string; // e.g. "-1, +1, +3, +5, +7" or "+2, +3"
  standardState: StateOfMatter; // ở 298.15 K (25°C)
  discoveryYear: string;
  discoverer: string;
  summaryVi: string;
  applications: ElementApplication[];
  // Đặc trưng dành riêng cho học sinh THCS (KHTN Lớp 7, 8, 9 GDPT 2018)
  valency?: string; // Hóa trị phổ biến dùng viết CTHH (I, II, III, IV...)
  vietnamesePhonetics?: string; // Phiên âm tiếng Việt theo SGK KHTN 7 (ví dụ: Hai-đrô-dần, Xô-đi-ừm, Óc-xi-dần)
  isTHCSEssential?: boolean; // Thuộc 20 nguyên tố cốt lõi KHTN 7 hoặc kim loại trọng tâm KHTN 8-9
  thcsGrade?: string; // Phân lớp học (ví dụ: "KHTN 7 (Z=1-20)", "KHTN 8 (Kim loại quen thuộc)")
}

export type DisplayMode = 'standard' | 'mass' | 'shells' | 'electronegativity' | 'valency' | 'particles';

# Bảng Tuần Hoàn Hoá Học Động 3D - GDPT 2018 ⚛️

Ứng dụng bảng tuần hoàn các nguyên tố hóa học tương tác động, trực quan sinh động dành cho học sinh THCS & THPT theo chuẩn chương trình Giáo dục Phổ thông 2018 (GDPT 2018).

---

## 🌟 Tính Năng Nổi Bật

- **Bảng tuần hoàn tương tác chuẩn GDPT 2018**:
  - Đầy đủ 118 nguyên tố hóa học với danh pháp quốc tế IUPAC chính xác.
  - Phân loại trực quan: Kim loại kiềm, kiềm thổ, halogen, khí hiếm, phi kim, kim loại chuyển tiếp, lanthanoid, actinoid.
  - Bộ lọc thông minh theo trạng thái (Rắn, Lỏng, Khí, Nhân tạo) và nhóm tính chất.
- **Mô hình nguyên tử 3D & 2D (Bohr Model)**:
  - Cấu tạo chi tiết số hạt hạ nguyên tử chính xác ($p, n, e$).
  - Phân bố electron theo từng lớp $K, L, M, N, O, P, Q$ theo đúng quy tắc Klechkowski và phân mức năng lượng.
  - Xoay 360 độ trong không gian 3 chiều với Three.js mượt mà.
- **Phát âm danh pháp IUPAC chuẩn**:
  - Tích hợp phát âm tiếng Anh chuẩn xác danh pháp IUPAC theo SGK Khoa học tự nhiên và Hóa học mới.
- **Ứng dụng thực tế sinh động**:
  - Hình ảnh và mô tả ứng dụng thực tế từng nguyên tố trong đời sống, công nghiệp, y học và công nghệ cao.
- **Công cụ so sánh đa nguyên tố**:
  - Chọn và so sánh đồng thời nhiều nguyên tố (số hiệu, nguyên tử khối, bán kính nguyên tử, độ âm điện, cấu hình electron).
- **Mini Game trắc nghiệm đố vui**:
  - Ôn luyện kiến thức với câu hỏi về tính chất, ứng dụng và cấu tạo nguyên tử, chấm điểm và giải thích chi tiết.
- **Bảng tuần hoàn sách giáo khoa**:
  - Chế độ xem bảng SGK nằm ngang với độ phân giải cao, tiện đối chiếu khi học tập.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Môi Trường Cục Bộ (Local)

1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```

2. **Chạy server phát triển (Development)**:
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại: `http://localhost:3000`

3. **Kiểm tra lỗi mã nguồn (Lint)**:
   ```bash
   npm run lint
   ```

4. **Đóng gói sản phẩm (Build Production)**:
   ```bash
   npm run build
   ```

---

## ☁️ Triển Khai Lên Vercel (Deploy)

Dự án đã được cấu hình tối ưu sẵn sàng 100% cho Vercel:
- File `vercel.json` định tuyến SPA rewrites và cấu hình cache CDN.
- Xem chi tiết từng bước triển khai tại file **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)**.

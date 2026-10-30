# Hướng Dẫn Triển Khai Lên Vercel (Deployment Guide)

Dự án **Bảng Tuần Hoàn Hoá Học Động 3D (GDPT 2018)** được xây dựng bằng **React + TypeScript + Vite + Tailwind CSS + Three.js**. Đây là một ứng dụng Single Page Application (SPA) hoàn chỉnh chạy ở phía máy khách (Client-Side), rất nhẹ, tốc độ cao và hoàn toàn tương thích để triển khai miễn phí 100% lên nền tảng **Vercel**.

---

## 1. Danh sách các file cấu hình đã được rà soát và tạo sẵn

| File | Chức năng | Chi tiết cấu hình |
| :--- | :--- | :--- |
| **`vercel.json`** | Cấu hình máy chủ Vercel | Định tuyến SPA rewrites (`/*` -> `/index.html`) chống lỗi 404 khi reload/F5 trang; thiết lập Cache-Control 1 năm (`immutable`) cho tài nguyên tĩnh trong `/assets/` |
| **`.vercelignore`** | Tối ưu upload mã nguồn | Bỏ qua `.git`, `node_modules`, log, và các file tạm thời khi deploy |
| **`.gitignore`** | Quản lý Git | Đã cấu hình bỏ qua `.vercel`, `dist/`, `node_modules/` |
| **`vite.config.ts`** | Trình đóng gói Vite | Đã tối ưu hóa đường dẫn ESM (`import.meta.url`) chuẩn Node.js trên Vercel build container |
| **`package.json`** | Script build & dependencies | Lệnh `npm run build` tạo thư mục `dist` trong ~1 giây |
| **`index.html`** | Thẻ Meta, SEO & Icon | Tích hợp sẵn `favicon.svg`, mô tả giáo dục GDPT 2018, OpenGraph preview cards |
| **`public/favicon.svg`** | Biểu tượng website | Logo mô hình nguyên tử xoay chuẩn vector hiển thị trên tab trình duyệt |
| **`public/assets/`** | Tài nguyên hình ảnh bảng SGK | Ảnh bảng tuần hoàn SGK nằm ngang và các hình minh họa ứng dụng |

---

## 2. Cách 1: Triển khai tự động qua GitHub (Khuyên dùng)

Đây là phương thức tiện lợi nhất vì Vercel sẽ tự động build lại ứng dụng mỗi khi bạn cập nhật code lên GitHub.

### Bước 1: Đẩy mã nguồn lên GitHub
Nếu chưa có repo Git:
```bash
git init
git add .
git commit -m "feat: Bảng tuần hoàn hóa học động 3D GDPT 2018 sẵn sàng cho Vercel"
git branch -M main
git remote add origin <URL_REPO_GITHUB_CUA_BAN>
git push -u origin main
```

### Bước 2: Nhập dự án vào Vercel
1. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản **GitHub**.
2. Tại bảng điều khiển Dashboard, bấm nút **"Add New..."** ở góc phải trên -> chọn **"Project"**.
3. Trong danh sách repositories, tìm dự án của bạn và nhấn **"Import"**.

### Bước 3: Xác nhận thông số cấu hình dự án
Vercel sẽ tự động đọc file `vercel.json` và nhận diện cấu hình:
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (để mặc định)
- **Build Command**: `vite build` (hoặc `npm run build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`
*(Không cần cấu hình Environment Variables vì ứng dụng chạy client-side thuần túy).*

### Bước 4: Triển khai
- Bấm nút **"Deploy"**.
- Chờ khoảng 30 đến 45 giây để Vercel build.
- Sau khi hoàn thành, bạn sẽ nhận được đường link website chính thức có chứng chỉ bảo mật SSL miễn phí:  
  👉 **`https://ten-du-an-cua-ban.vercel.app`**

---

## 3. Cách 2: Triển khai trực tiếp bằng Vercel CLI (Dòng lệnh)

Nếu bạn không muốn liên kết với GitHub và muốn deploy trực tiếp từ máy tính cá nhân:

```bash
# 1. Cài đặt Vercel CLI toàn cục (hoặc dùng npx)
npm install -g vercel

# 2. Đăng nhập vào Vercel
vercel login

# 3. Chạy lệnh triển khai thử nghiệm (Preview)
vercel

# Các câu hỏi xác nhận từ CLI:
# ? Set up and deploy “path/to/project”? [Y/n] -> Nhấn Y
# ? Which scope do you want to deploy to? -> Chọn tài khoản cá nhân của bạn
# ? Link to existing project? [y/N] -> Nhấn N
# ? What’s your project’s name? -> Đặt tên (vd: bang-tuan-hoan-3d)
# ? In which directory is your code located? -> Nhấn Enter (mặc định ./)
# ? Want to modify these settings? [y/N] -> Nhấn N (Vercel tự nhận diện Vite)

# 4. Khi sẵn sàng đưa lên đường dẫn Production chính thức:
vercel --prod
```

---

## 4. Các điểm lưu ý quan trọng đã được xử lý sẵn

1. **Khắc phục lỗi 404 khi tải lại trang (SPA Routing)**:
   - File `vercel.json` đã chứa quy tắc `rewrites` dẫn tất cả request về `/index.html`.
2. **Tối ưu tốc độ tải và bộ nhớ đệm (Caching)**:
   - Các file JavaScript/CSS được băm mã (hash) trong `assets/` được đặt tiêu đề `Cache-Control: public, max-age=31536000, immutable`, giúp website tải tức thì ở các lần truy cập tiếp theo.
3. **Mô hình 3D Three.js và Âm thanh IUPAC**:
   - Web Audio API và WebGL Three.js chạy 100% trên trình duyệt người dùng mà không cần backend server phức tạp hay chi phí hosting bổ sung.

# Aura Dining – Hệ thống Đặt Bàn Nhà Hàng

Website đặt bàn và quản trị nhà hàng: trải nghiệm người dùng bằng React + Vite, backend Node.js/Express + MongoDB, toàn bộ giao diện tiếng Việt.

## 1. Tính năng nổi bật
- Đặt bàn online (chọn ngày/giờ, sở thích chỗ ngồi, xuất CSV).
- Quy trình chọn bàn chi tiết, phân bàn tự động/manual trong trang Admin.
- Khu vực admin có đăng nhập bảo vệ (JWT + MongoDB), tự động hết hạn sau 8 giờ.
- Quản lý thực đơn, bàn, phân công bàn, phân tích số liệu, cài đặt nhà hàng.
- Backend riêng với MongoDB, hỗ trợ gửi email xác nhận (SMTP tùy chọn).

## 2. Kiến trúc
```
Restaurant-Table-Booking/
├─ src/               # Frontend React (Vite)
├─ server/            # Backend Express + MongoDB
└─ public/            # Assets tĩnh
```

## 3. Cài đặt & chạy

### Yêu cầu hệ thống
- Node.js (phiên bản 18 trở lên)
- MongoDB (đang chạy local hoặc connection string)
- npm hoặc yarn

### Bước 1: Clone và cài đặt dependencies

```bash
# Clone repository (nếu chưa có)
cd Restaurant-Table-Booking

# Cài đặt dependencies cho frontend
npm install

# Cài đặt dependencies cho backend
cd server
npm install
cd ..
```

### Bước 2: Tạo file .env ở root dự án

Tạo file `.env` ở **root dự án** (cùng cấp với `package.json`), chứa tất cả biến môi trường:

```bash
# Tạo file .env ở root
touch .env
```

Nội dung file `.env`:

```env
# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=restaurant_db

# JWT Secret (for authentication)
JWT_SECRET=your-secret-key-change-this-in-production

# SMTP Email Configuration (tùy chọn)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Frontend Vite Environment Variables (tùy chọn)
VITE_API_BASE_URL=http://localhost:5000
VITE_API_PREFIX=/api
```

**Lưu ý quan trọng:**
- File `.env` phải ở **root dự án** (không phải trong thư mục `server/`)
- Thay đổi `JWT_SECRET` thành một chuỗi bí mật ngẫu nhiên trong môi trường production
- Nếu không cấu hình SMTP, hệ thống vẫn hoạt động nhưng không gửi email xác nhận

### Bước 3: Khởi động MongoDB

Đảm bảo MongoDB đang chạy:

```bash
# Nếu dùng MongoDB local
mongod

# Hoặc nếu dùng MongoDB Atlas, chỉ cần có connection string trong MONGODB_URI
```

### Bước 4: Seed dữ liệu mẫu (lần đầu tiên)

```bash
cd server
npm run seed
npm run indexes
cd ..
```

Lệnh này sẽ tạo:
- Dữ liệu mẫu: bàn, món ăn, cài đặt nhà hàng
- Tài khoản admin mặc định (xem phần đăng nhập bên dưới)
- Indexes cho MongoDB để tối ưu hiệu suất

### Bước 5: Chạy Backend

Mở terminal thứ nhất:

```bash
cd server
npm run dev
```

Backend sẽ chạy tại `http://localhost:5000`

### Bước 6: Chạy Frontend

Mở terminal thứ hai:

```bash
# Ở root dự án
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000` (Vite tự động đổi port nếu bận)

### Kiểm tra hoạt động

1. **Backend health check:** Mở trình duyệt vào `http://localhost:5000/health`
2. **Frontend:** Mở trình duyệt vào `http://localhost:3000`
3. **Admin panel:** `http://localhost:3000/admin/login`

## 4. Đăng nhập khu vực Admin

Sau khi chạy `npm run seed`, hệ thống tạo tài khoản admin mặc định:

- **Email:** `admin@auradining.vn`
- **Mật khẩu:** `123456`

**Cách đăng nhập:**
1. Truy cập `http://localhost:3000/admin/login`
2. Nhập email và mật khẩu ở trên
3. Sau khi đăng nhập thành công, bạn sẽ được chuyển vào bảng điều khiển
4. Token được lưu trong LocalStorage (hết hạn sau 8 giờ hoặc khi đăng xuất)

**⚠️ Lưu ý bảo mật:**
- Hãy đổi mật khẩu ngay khi lên môi trường production
- Có thể cập nhật mật khẩu bằng cách sửa document trong collection `admin_users` của MongoDB

## 5. Scripts chính
| Vị trí | Lệnh | Mô tả |
|-------|------|-------|
| `/` | `npm run dev` | Vite dev server |
| `/` | `npm run build` | Build frontend |
| `/` | `npm run preview` | Preview build |
| `/server` | `npm run dev` | Node --watch backend |
| `/server` | `npm run seed` | Seed dữ liệu mẫu MongoDB (bàn, món, settings & tài khoản admin) |
| `/server` | `npm run indexes` | Tạo index MongoDB |

## 6. Gửi email xác nhận
Backend dùng `nodemailer`. Nếu không cấu hình SMTP, hệ thống vẫn hoạt động nhưng không gửi email. Khi cấu hình đầy đủ biến môi trường (xem phần backend), mỗi lần đặt bàn thành công sẽ gửi mail “Aura Dining” tới khách.

## 7. Roadmap gợi ý
- Upload logo chính thức vào `src/assets` và thay cho biểu tượng tạm thời.
- Thêm trang blog/sự kiện.
- Triển khai Docker Compose (MongoDB + backend + frontend).

## 8. Hỗ trợ
Nếu gặp lỗi:
1. Kiểm tra log terminal (frontend/backend).
2. Xác nhận MongoDB đang chạy.
3. Kiểm tra file `.env` (đúng port, URL).
4. Xoá `node_modules` và chạy `npm install` lại nếu thiếu dependency (`nodemailer`, v.v.).

Chúc bạn vận hành Aura Dining thật thành công! 🍽️🔥


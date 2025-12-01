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
### Frontend
```bash
cd Restaurant-Table-Booking
npm install
cp .env.example .env   # (tự tạo nếu chưa có)
# .env
VITE_API_BASE_URL=http://localhost:5000
VITE_API_PREFIX=/api
npm run dev
```
Frontend chạy tại http://localhost:3000 (Vite auto đổi port nếu bận).

### Backend
```bash
cd server
npm install
cp .env.example .env   # hoặc tự tạo
# ví dụ biến bắt buộc
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=restaurant_db
PORT=5000
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=change_me_to_a_secure_key
# SMTP (tuỳ chọn để gửi email)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=username
SMTP_PASS=password
EMAIL_FROM="Aura Dining" <no-reply@auradining.vn>

npm run dev            # chạy server
```
Lưu ý: nếu muốn seed dữ liệu mẫu chạy `npm run seed`, tạo index `npm run indexes`.

### Đăng nhập khu vực Admin
- Sau khi chạy `npm run seed`, hệ thống tạo tài khoản mặc định:
  - Email: `admin@auradining.vn`
  - Mật khẩu: `AuraDining@2025`
- Đăng nhập tại `http://localhost:3000/admin/login`.
- Sau khi đăng nhập thành công bạn sẽ được chuyển vào bảng điều khiển và token được lưu trong LocalStorage (hết hạn sau 8 giờ hoặc khi đăng xuất).
- Hãy đổi mật khẩu ngay khi lên môi trường thật bằng cách cập nhật document trong collection `admin_users` (hoặc viết form riêng).

## 4. Scripts chính
| Vị trí | Lệnh | Mô tả |
|-------|------|-------|
| `/` | `npm run dev` | Vite dev server |
| `/` | `npm run build` | Build frontend |
| `/` | `npm run preview` | Preview build |
| `/server` | `npm run dev` | Node --watch backend |
| `/server` | `npm run seed` | Seed dữ liệu mẫu MongoDB (bàn, món, settings & tài khoản admin) |
| `/server` | `npm run indexes` | Tạo index MongoDB |

## 5. Gửi email xác nhận
Backend dùng `nodemailer`. Nếu không cấu hình SMTP, hệ thống vẫn hoạt động nhưng không gửi email. Khi cấu hình đầy đủ biến môi trường (xem phần backend), mỗi lần đặt bàn thành công sẽ gửi mail “Aura Dining” tới khách.

## 6. Roadmap gợi ý
- Upload logo chính thức vào `src/assets` và thay cho biểu tượng tạm thời.
- Thêm trang blog/sự kiện.
- Triển khai Docker Compose (MongoDB + backend + frontend).

## 7. Hỗ trợ
Nếu gặp lỗi:
1. Kiểm tra log terminal (frontend/backend).
2. Xác nhận MongoDB đang chạy.
3. Kiểm tra file `.env` (đúng port, URL).
4. Xoá `node_modules` và chạy `npm install` lại nếu thiếu dependency (`nodemailer`, v.v.).

Chúc bạn vận hành Aura Dining thật thành công! 🍽️🔥


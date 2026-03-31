---
name: Personal Learning Resource Website
description: Personal website with admin for uploading learning materials and videos
type: project
---

# Trang Web Cá Nhân Chia Sẻ Tài Liệu Học Tập - Thiết Kế

## 1. Tổng Quan Dự Án

Xây dựng trang web cá nhân cho phép:
- **Người dùng**: Xem tài liệu và video học tập theo chủ đề (Tin A, Tin B)
- **Admin**: Upload và quản lý nội dung qua trang admin công khai
- Tìm kiếm cục bộ trong mỗi chủ đề
- Deploy trên Cloudflare Pages với database D1

## 2. Yêu Cầu Chi Tiết

### 2.1 Chức Năng
- **Trang chủ**: Hiển thị 2 chủ đề chính (Tin A, Tin B) dưới dạng card/banner
- **Trang chủ đề**: Hiển thị danh sách tài liệu và video của chủ đề đó
  - Tài liệu ZIP từ Google Drive (embed link)
  - Video YouTube (embed)
  - Ô tìm kiếm cục bộ (lọc theo từ khóa trong tên)
- **Trang admin**: Upload nội dung mới
  - Chọn chủ đề (Tin A / Tin B)
  - Nhập tên, mô tả
  - Chọn loại (tài liệu/video)
  - Nhập link (Google Drive share link / YouTube URL)
  - Lưu vào D1
- **Database D1**: Lưu metadata
  - `id` (autoincrement)
  - `title` (text)
  - `description` (text)
  - `type` (enum: 'document', 'video')
  - `topic` (enum: 'tin_a', 'tin_b')
  - `url` (text)
  - `created_at` (timestamp)
  - `order_index` (integer, optional)

### 2.2 Giao Diện
- **Phong cách**: Hiện đại, năng động
- **Responsive**: Mobile-first, hoạt động trên điện thoại và desktop
- **Màu sắc**: Màu sắc sinh động, có gradient
- **Hiệu ứng**: Transitions, hover effects
- **Typography**: Font chữ hiện đại, dễ đọc

### 2.3 Tìm Kiếm
- Mỗi trang chủ đề có ô input tìm kiếm
- Lọc real-time: khi gõ, chỉ hiển thị items có từ khóa trong `title`
- Không cần tìm kiếm toàn trang

### 2.4 Admin
- Trang admin công khai (không cần đăng nhập)
- Form đơn giản với các trường bắt buộc
- Sau khi submit, redirect về trang chủ đề tương ứng

### 2.5 Deployment
- Cloudflare Pages (miễn phí)
- Database: Cloudflare D1
- Build command phù hợp với framework chọn

## 3. Kiến Trúc Kỹ Thuật

### 3.1 Framework
**Khuyến nghị: Next.js (App Router)**
- SSR/SSG tốt cho SEO
- Dễ deploy lên Cloudflare Pages
- Hỗ trợ D1 tích hợp sẵn qua `@cloudflare/d1`
- Route handler cho admin POST dễ làm

**Các lựa chọn khác:**
- Astro: Đơn giản, nhanh, nhưng ít built-in state management
- Vanilla JS + HTML: Quá đơn giản, khó scale sau này

**Chọn:** Next.js 14+ với App Router

### 3.2 Database Schema
```sql
CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('document', 'video')),
  topic TEXT NOT NULL CHECK (topic IN ('tin_a', 'tin_b')),
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_topic ON resources(topic);
CREATE INDEX idx_type ON resources(type);
```

### 3.3 Cấu Trúc Thư Mục
```
/
├── app/
│   ├── page.tsx                 # Trang chủ (hiển thị 2 chủ đề)
│   ├── layout.tsx               # Root layout
│   ├── tin-a/
│   │   ├── page.tsx            # Trang chủ đề Tin A
│   │   └── components/
│   │       └── ResourceList.tsx # Component danh sách + search
│   ├── tin-b/
│   │   ├── page.tsx            # Trang chủ đề Tin B
│   │   └── components/
│   │       └── ResourceList.tsx
│   └── admin/
│       ├── page.tsx            # Trang admin upload
│       └── components/
│           └── UploadForm.tsx
├── lib/
│   └── db.ts                   # D1 client connection
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Card.tsx
├── styles/
│   └── globals.css             # Tailwind import + custom styles
├── public/                     # Static assets nếu cần
├── wrangler.toml               # Cloudflare config
├── package.json
└── tailwind.config.js
```

### 3.4 State Management
- Không cần complex state management
- Search state: local component state (React useState)
- Fetch data: React Server Components (RSC) cho trang chủ và trang chủ đề
- Admin POST: Server Action hoặc API Route

### 3.5 Các Thư Viện
- **UI Framework**: Next.js 14
- **Styling**: Tailwind CSS (hiện đại, nhanh)
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages
- **Icons**: Lucide React hoặc Heroicons

### 3.6 Data Flow
```
Trang chủ (GET /) → server component → query all topics → render 2 cards

Trang chủ đề (GET /tin-a) → server component → query resources where topic='tin_a' → render list + search client component

Admin (GET /admin) → render form

Submit admin → POST /api/admin/upload → insert vào D1 → redirect
```

## 4. Các Rủi Ro & Giải Pháp

| Rủi ro | Giải pháp |
|--------|-----------|
| XSS khi hiển thị user input (title, description) | Escape properly, hoặc dùng `dangerouslySetInnerHTML` cẩn thận |
| Link Google Drive không trực tiếp downloadable | Dùng `uc?id=` format cho direct download |
| YouTube embed slow | Dùng `loading="lazy"` |
| D1 connection issues | Retry logic, connection pooling (wrangler tự xử lý) |

## 5. Các Bước Triển Khai (Tổng Quan)

1. **Setup**: Tạo Next.js project, cấu hình Tailwind, Cloudflare D1
2. **Database**: Tạo D1 database, chạy migration
3. **Layout & Components**: Header, Footer, Navigation
4. **Trang chủ**: Hiển thị 2 chủ đề dưới dạng card
5. **Trang chủ đề** (Tin A & Tin B): Danh sách resources với search
6. **Trang admin**: Form upload và xử lý submit
7. **Testing**: Test thủ công các luồng chính
8. **Deployment**: Deploy lên Cloudflare Pages

## 6. Các Quyết Định Đã Lấy

- **Framework**: Next.js App Router (không dùng Pages Router)
- **Styling**: Tailwind CSS (không dùng CSS modules hay styled-components)
- **Database**: D1 với Prisma-like raw SQL
- **Search**: Client-side filter (không cần server search, data nhỏ)
- **Admin**: Công khai, không có auth
- **Video**: YouTube embed
- **Tài liệu**: Google Drive direct download link

## 7. Điều Chưa Có (Out of Scope)

- Authentication / Authorization
- User comments/reviews
- Analytics
- Pagination (nếu nhiều hơn 50 items có thể thêm sau)
- Image thumbnails cho tài liệu
- Drag-and-drop upload (upload trực tiếp lên Drive rồi lấy link)
- Bulk upload

## 8. Tiêu Chí Thành Công

- Trang chủ hiển thị 2 chủ đề đúng
- Tìm kiếm trong trang chủ đề hoạt động
- Thêm mới tài liệu/video qua admin thành công
- Deploy lên Cloudflare Pages thành công
- Database D1 lưu và query được dữ liệu

---

**Lưu ý**: Đây là spec cho lần triển khai đầu tiên. Có thể mở rộng sau nếu cần.

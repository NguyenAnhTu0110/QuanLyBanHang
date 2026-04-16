# Quản Lý Bán Hàng Online

Dự án quản lý bán hàng online được xây dựng theo yêu cầu:

- Back-end: `Node.js + Express`
- Database: `MongoDB + Mongoose`
- Front-end: `HTML + CSS + JavaScript thuần`
- Công cụ test API: `Postman`

## Chức năng chính

- CRUD đầy đủ cho 4 bộ dữ liệu: `categories`, `products`, `customers`, `orders`
- Trang tổng quan hiển thị doanh thu, số lượng collection, đơn hàng gần đây và tồn kho thấp
- Giao diện tách thành nhiều trang riêng để demo chức năng CRUD
- Đơn hàng liên kết `customer` và danh sách `products`
- Đăng nhập, đăng xuất và phân quyền theo vai trò `admin` / `user`
- User sau khi đăng nhập sẽ vào trang web bán hàng cơ bản để xem sản phẩm

## Cấu trúc thư mục

```text
QuanLyBanHang/
|-- public/
|   |-- assets/
|   |   |-- css/styles.css
|   |   `-- js/
|   |-- index.html
|   `-- pages/
|       |-- categories.html
|       |-- products.html
|       |-- customers.html
|       `-- orders.html
|-- postman/
|   `-- QuanLyBanHangOnline.postman_collection.json
|-- src/
|   |-- config/database.js
|   |-- controllers/
|   |-- models/
|   |-- routes/
|   |-- utils/asyncHandler.js
|   |-- app.js
|   `-- server.js
|-- .env.example
`-- package.json
```

## Các trang giao diện

- `/` - Trang tổng quan
- `/login` - Trang đăng nhập
- `/shop` - Trang web bán hàng cho user
- `/pages/categories.html` - CRUD danh mục
- `/pages/products.html` - CRUD sản phẩm
- `/pages/customers.html` - CRUD khách hàng
- `/pages/orders.html` - CRUD đơn hàng

## Các API route

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/store/products`
- `GET | POST /api/categories`
- `GET | PUT | DELETE /api/categories/:id`
- `GET | POST /api/products`
- `GET | PUT | DELETE /api/products/:id`
- `GET | POST /api/customers`
- `GET | PUT | DELETE /api/customers/:id`
- `GET | POST /api/orders`
- `GET | PUT | DELETE /api/orders/:id`
- `GET /api/dashboard/stats`

## Hướng dẫn chạy project

1. Cài dependency:

```bash
npm install
```

2. Tạo file `.env` từ `.env.example`

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/quanlybanhang_online
```

3. Đảm bảo MongoDB đang chạy local.

4. Khởi động project:

```bash
npm run dev
```

5. Mở trình duyệt:

```text
http://localhost:3000/login
```

## Tài khoản mẫu

- Admin
  Tên đăng nhập: `admin`
  Mật khẩu: `admin123`
- User
  Tên đăng nhập: `user`
  Mật khẩu: `user123`

## Sử dụng Postman

Nhập file:

```text
postman/QuanLyBanHangOnline.postman_collection.json
```

Sau khi tạo dữ liệu, thay các biến:

- `{{categoryId}}`
- `{{productId}}`
- `{{customerId}}`
- `{{orderId}}`

bằng `_id` thực tế trong database để test các request `GET by ID`, `PUT`, `DELETE`.

# Quản Lý Bán Hàng Online

> Hệ thống quản lý bán hàng online hoàn chỉnh với giao diện admin và user store, xây dựng bằng Node.js + Express + MongoDB + Vanilla JavaScript.

## 📋 Mục Lục

- [Giới thiệu](#giới-thiệu)
- [✨ Chức năng](#-chức-năng)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [📁 Cấu trúc dự án](#-cấu-trúc-dự-án)
- [🚀 Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [🔌 API Routes](#-api-routes)
- [🗄️ Cơ sở dữ liệu](#️-cơ-sở-dữ-liệu)
- [👤 Tài khoản mặc định](#-tài-khoản-mặc-định)
- [🔐 Phân quyền người dùng](#-phân-quyền-người-dùng)
- [📸 Hướng dẫn upload hình ảnh](#-hướng-dẫn-upload-hình-ảnh)
- [🧪 Testing API với Postman](#-testing-api-với-postman)
- [🐛 Khắc phục sự cố](#-khắc-phục-sự-cố)
- [📚 Tài liệu thêm](#-tài-liệu-thêm)

## Giới Thiệu

Quản Lý Bán Hàng Online là một hệ thống quản lý bán hàng đầy đủ chức năng, cung cấp hai giao diện chính:

- **Giao diện Admin**: Quản lý toàn bộ sản phẩm, danh mục, khách hàng và đơn hàng
- **Giao diện User**: Xem sản phẩm, cập nhật thông tin cá nhân và đặt hàng

Ứng dụng được phát triển với các công nghệ web hiện đại, sử dụng Vanilla JavaScript (không sử dụng framework frontend) để tối giản hóa độ phức tạp và tăng tốc độ tải.

## ✨ Chức Năng

### 👨‍💼 Phía Admin

- ✅ **CRUD đầy đủ** cho: Danh mục, Sản phẩm, Khách hàng, Đơn hàng
- ✅ **Dashboard tổng quan** với 5 chỉ số:
  - Tổng số đơn hàng (All Orders)
  - Đơn hàng đang chuẩn bị (Preparing)
  - Đơn hàng đang giao (Shipping)
  - Đơn hàng thành công (Success)
  - Đơn hàng hủy (Cancelled)
- ✅ **Quản lý trạng thái đơn hàng**: preparing → shipping → success/cancelled
- ✅ **Quản lý thanh toán**: Chuyển đổi trạng thái pending/received (cho đơn không COD)
- ✅ **Upload hình ảnh** cho sản phẩm (lưu vào thư mục `/public/uploads/`)
- ✅ **Phân quyền theo vai trò**: Admin (toàn quyền) vs User (chỉ xem shop)
- ✅ **Tìm kiếm & lọc dữ liệu**: Hỗ trợ tìm kiếm nhanh

### 👥 Phía User

- ✅ **Xem danh sách sản phẩm** hoạt động từ shop
- ✅ **Cập nhật hồ sơ cá nhân**: Họ tên, email, điện thoại
- ✅ **Quản lý địa chỉ giao hàng**:
  - Dropdown liên động (Tỉnh → Quận/Huyện → Phường/Xã)
  - Hỗ trợ nhiều địa chỉ
  - Chọn địa chỉ mặc định
- ✅ **Đặt hàng** với 3 phương thức thanh toán:
  - Tiền mặt (COD - Cash On Delivery)
  - Chuyển khoản (Bank Transfer)
  - Thẻ ngân hàng (Card Payment)
- ✅ **Xem lịch sử đơn hàng** và chi tiết từng đơn

### 🔐 Hệ Thống Chung

- ✅ **Đăng ký / Đăng nhập** với xác thực tài khoản
- ✅ **Session-based authentication** (8 giờ timeout)
- ✅ **Dữ liệu địa chỉ Việt Nam** đầy đủ (Tỉnh → Quận/Huyện → Phường/Xã)
- ✅ **Mã hóa mật khẩu** an toàn (Bcrypt)
- ✅ **Validation dữ liệu** ở cả frontend và backend

## 🛠️ Công Nghệ Sử Dụng

### Backend

- **Node.js** - JavaScript runtime
- **Express 4.19.2** - Web framework
- **Express-session 1.19.0** - Session management & authentication
- **MongoDB** - NoSQL database
- **Mongoose 8.9.0** - MongoDB ODM (Object Data Modeling)
- **Multer 1.4.5** - File upload middleware
- **Morgan 1.10.0** - HTTP request logger
- **Dotenv 16.4.5** - Environment variable manager

### Frontend

- **HTML5** - Markup language
- **CSS3** - Styling (responsive design)
- **JavaScript (Vanilla)** - No frameworks, pure ES6+
- **Fetch API** - HTTP client
- **Local Storage** - Client-side data storage

### Development Tools

- **Nodemon 3.1.7** - Auto-reload development server
- **Postman** - API testing tool

### Requirements

- Node.js >= 18
- MongoDB (local hoặc remote)
- npm hoặc yarn

## 📁 Cấu Trúc Dự Án

```
QuanLyBanHang/
├── public/                         # Frontend files
│   ├── index.html                  # Trang Dashboard admin
│   ├── login.html                  # Trang đăng nhập
│   ├── register.html               # Trang đăng ký
│   ├── shop.html                   # Trang bán hàng (user)
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css          # Toàn bộ CSS (responsive design)
│   │   ├── data/
│   │   │   ├── tinh_tp.json        # Dữ liệu Tỉnh/Thành phố Việt Nam
│   │   │   ├── quan_huyen.json     # Dữ liệu Quận/Huyện
│   │   │   └── xa_phuong.json      # Dữ liệu Phường/Xã
│   │   └── js/
│   │       ├── api.js              # HTTP client (fetch API wrapper)
│   │       ├── shared.js           # Utility functions & common components
│   │       ├── auth.js             # Authentication handler
│   │       ├── shop.js             # Shop page logic (user)
│   │       ├── orders.js           # Orders page logic (admin)
│   │       ├── products.js         # Products page logic (admin)
│   │       ├── categories.js       # Categories page logic (admin)
│   │       ├── customers.js        # Customers page logic (admin)
│   │       ├── dashboard.js        # Dashboard logic (admin)
│   │       └── login.js            # Login/Register logic
│   ├── pages/                      # Admin pages
│   │   ├── categories.html         # Categories management
│   │   ├── products.html           # Products management
│   │   ├── customers.html          # Customers management
│   │   └── orders.html             # Orders management
│   ├── uploads/                    # Product images (generated after upload)
│   └── img/                        # Static images
│
├── src/                            # Backend files
│   ├── config/
│   │   ├── database.js             # MongoDB connection
│   │   └── seedUsers.js            # Seed default users on startup
│   │
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic (login, register, logout)
│   │   ├── categoryController.js   # Category CRUD operations
│   │   ├── productController.js    # Product CRUD + image upload
│   │   ├── customerController.js   # Customer CRUD operations
│   │   ├── orderController.js      # Order CRUD + status management
│   │   ├── storeController.js      # Store endpoints for user
│   │   ├── dashboardController.js  # Dashboard statistics
│   │   └── crudFactory.js          # Generic CRUD factory (reusable logic)
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       # Authentication & authorization checks
│   │   └── uploadMiddleware.js     # Multer configuration for file uploads
│   │
│   ├── models/
│   │   ├── User.js                 # User schema (admin, user roles)
│   │   ├── Category.js             # Category schema
│   │   ├── Product.js              # Product schema
│   │   ├── Customer.js             # Customer schema with addresses
│   │   └── Order.js                # Order schema with items
│   │
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth routes
│   │   ├── categoryRoutes.js       # /api/categories routes
│   │   ├── productRoutes.js        # /api/products routes
│   │   ├── customerRoutes.js       # /api/customers routes
│   │   ├── orderRoutes.js          # /api/orders routes
│   │   ├── storeRoutes.js          # /api/store routes (public)
│   │   └── dashboardRoutes.js      # /api/dashboard routes
│   │
│   ├── utils/
│   │   ├── asyncHandler.js         # Error handling wrapper
│   │   ├── password.js             # Password hashing & verification
│   │   └── vietnamAddresses.js     # Address utilities
│   │
│   ├── app.js                      # Express app configuration
│   └── server.js                   # Server entry point
│
├── postman/
│   └── QuanLyBanHangOnline.postman_collection.json  # Postman collection for API testing
│
├── package.json                    # Dependencies & scripts
├── .env.example                    # Environment variables template
└── README.md                       # This file
```

## 🌐 Các Trang Giao Diện

| URL                      | Vai trò | Mô tả                              | Bắt buộc đăng nhập |
| ------------------------ | ------- | ---------------------------------- | ------------------ |
| `/login`                 | Public  | Đăng nhập                          | ❌                 |
| `/register`              | Public  | Đăng ký tài khoản                  | ❌                 |
| `/`                      | Admin   | Dashboard tổng quan                | ✅ (Admin)         |
| `/pages/categories.html` | Admin   | CRUD danh mục sản phẩm             | ✅ (Admin)         |
| `/pages/products.html`   | Admin   | CRUD sản phẩm + upload hình        | ✅ (Admin)         |
| `/pages/customers.html`  | Admin   | CRUD khách hàng                    | ✅ (Admin)         |
| `/pages/orders.html`     | Admin   | CRUD đơn hàng + quản lý trạng thái | ✅ (Admin)         |
| `/shop.html`             | User    | Xem sản phẩm + đặt hàng            | ✅ (Bất kỳ user)   |

## 🔌 API Routes

### Authentication

```http
POST   /api/auth/login      - Đăng nhập
       Body: { username, password }
       Response: { success, message, user }

POST   /api/auth/register   - Đăng ký
       Body: { username, fullName, email, phone, password }
       Response: { success, message, user }

POST   /api/auth/logout     - Đăng xuất
       Response: { success, message }

GET    /api/auth/me         - Lấy thông tin user hiện tại
       Response: { success, user }
```

### Store (User - Không cần quyền admin)

```http
GET    /api/store/products  - Lấy danh sách sản phẩm hoạt động
       Response: { success, count, data: [...] }
```

### Categories (Admin)

```http
GET    /api/categories              - Lấy danh sách danh mục
       Response: { success, count, data: [...] }

POST   /api/categories              - Tạo danh mục mới
       Body: { name, description, isActive }
       Response: { success, message, data }

GET    /api/categories/:id          - Chi tiết danh mục
       Response: { success, data }

PUT    /api/categories/:id          - Cập nhật danh mục
       Body: { name, description, isActive }
       Response: { success, message, data }

DELETE /api/categories/:id          - Xóa danh mục
       Response: { success, message }
```

### Products (Admin)

```http
GET    /api/products                - Lấy danh sách sản phẩm
       Response: { success, count, data: [...] }

POST   /api/products                - Tạo sản phẩm mới (có thể upload hình)
       Body: FormData { name, sku, category, price, stock, description, image }
       Response: { success, message, data }

GET    /api/products/:id            - Chi tiết sản phẩm
       Response: { success, data }

PUT    /api/products/:id            - Cập nhật sản phẩm (có thể upload hình mới)
       Body: FormData { name, sku, category, price, stock, description, image }
       Response: { success, message, data }

DELETE /api/products/:id            - Xóa sản phẩm
       Response: { success, message }
```

### Customers (Admin)

```http
GET    /api/customers               - Lấy danh sách khách hàng
       Response: { success, count, data: [...] }

POST   /api/customers               - Tạo khách hàng mới
       Body: { fullName, email, phone, city, address, addresses }
       Response: { success, message, data }

GET    /api/customers/:id           - Chi tiết khách hàng
       Response: { success, data }

PUT    /api/customers/:id           - Cập nhật khách hàng
       Body: { fullName, email, phone, city, address, addresses }
       Response: { success, message, data }

DELETE /api/customers/:id           - Xóa khách hàng
       Response: { success, message }
```

### Orders (Admin & User)

```http
GET    /api/orders                  - Lấy danh sách đơn hàng
       Response: { success, count, data: [...] }

POST   /api/orders                  - Tạo đơn hàng mới
       Body: { customer, items, shippingAddress, paymentMethod, totalAmount, note }
       Response: { success, message, data }

GET    /api/orders/:id              - Chi tiết đơn hàng
       Response: { success, data }

PUT    /api/orders/:id              - Cập nhật đơn hàng
       Body: { status, paymentMethod, note, ... }
       Response: { success, message, data }

DELETE /api/orders/:id              - Xóa đơn hàng
       Response: { success, message }

PUT    /api/orders/:id/delivery-status  - Cập nhật trạng thái giao hàng
       Body: { deliveryStatus: "preparing" | "shipping" | "success" | "cancelled" }
       Response: { success, message, data }

PUT    /api/orders/:id/payment-status   - Cập nhật trạng thái thanh toán
       Body: { paymentStatus: "pending" | "received" }
       Response: { success, message, data }
```

### Dashboard (Admin)

```http
GET    /api/dashboard/stats         - Lấy thống kê dashboard
       Response: {
         success,
         stats: {
           totalOrders,
           preparingOrders,
           shippingOrders,
           successOrders,
           cancelledOrders
         }
       }
```

## 🗄️ Cơ Sở Dữ Liệu

### User Schema

```javascript
{
  _id: ObjectId,
  username: String (unique, lowercase),
  fullName: String,
  email: String (unique, lowercase),
  phone: String (10-11 digits),
  passwordHash: String,
  role: "admin" | "user" (default: "user"),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Schema

```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema

```javascript
{
  _id: ObjectId,
  name: String (required),
  sku: String (unique, uppercase),
  category: ObjectId (ref: Category),
  price: Number (>= 0),
  stock: Number (>= 0, default: 0),
  description: String,
  imageUrl: String,
  image: String,
  status: "active" | "inactive" (default: "active"),
  createdAt: Date,
  updatedAt: Date
}
```

### Customer Schema

```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  phone: String,
  city: String,
  address: String,
  addresses: [{
    provinceId: String,
    provinceName: String,
    districtId: String,
    districtName: String,
    wardId: String,
    wardName: String,
    addressDetail: String,
    isDefault: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema

```javascript
{
  _id: ObjectId,
  orderCode: String (unique),
  customer: ObjectId (ref: Customer),
  items: [{
    product: ObjectId (ref: Product),
    productName: String,
    quantity: Number,
    unitPrice: Number,
    lineTotal: Number
  }],
  totalAmount: Number,
  status: "preparing" | "shipping" | "success" | "cancelled",
  paymentMethod: "cod" | "bank_transfer" | "card",
  paymentStatus: "pending" | "received" (for non-COD),
  shippingAddress: String,
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống

- Node.js version 18 trở lên
- MongoDB (local hoặc cloud)
- Git

### Bước 1: Clone/Tải Dự Án

```bash
# Nếu sử dụng Git
git clone <repository-url>
cd QuanLyBanHang

# Hoặc nếu có file .zip
unzip QuanLyBanHang.zip
cd QuanLyBanHang
```

### Bước 2: Cài Dependencies

```bash
npm install
```

Lệnh này sẽ cài đặt tất cả các package được liệt kê trong `package.json`:

- Express framework
- MongoDB driver
- Multer (upload file)
- Session management
- Nodemon (development)

### Bước 3: Cấu Hình Environment Variables

```bash
# Copy file .env.example thành .env
cp .env.example .env

# Hoặc trên Windows:
copy .env.example .env
```

Chỉnh sửa file `.env` với các giá trị phù hợp:

```env
# Port server chạy
PORT=3000

# MongoDB connection string
# Ví dụ local: mongodb://127.0.0.1:27017/quanlybanhang_online
# Ví dụ cloud: mongodb+srv://username:password@cluster.mongodb.net/quanlybanhang_online
MONGODB_URI=mongodb://127.0.0.1:27017/quanlybanhang_online

# Session secret (có thể để mặc định hoặc thay đổi)
SESSION_SECRET=quan-ly-ban-hang-online-secret
```

### Bước 4: Đảm Bảo MongoDB Chạy

**Nếu dùng MongoDB Local:**

```bash
# Windows - Nếu MongoDB là service:
# MongoDB service sẽ tự chạy khi boot

# Hoặc chạy mongod từ terminal:
mongod

# macOS/Linux:
mongod
```

**Nếu dùng MongoDB Cloud (Atlas):**

- Tạo tài khoản trên [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Tạo cluster và database
- Cập nhật `MONGODB_URI` trong file `.env` với connection string

### Bước 5: Khởi Động Server

**Development Mode (Với Nodemon - auto-reload):**

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000` và tự reload khi bạn sửa code.

**Production Mode:**

```bash
npm start
```

### Bước 6: Truy Cập Ứng Dụng

Mở trình duyệt web và truy cập:

- **Trang chủ:** http://localhost:3000
- **Đăng nhập:** http://localhost:3000/login
- **Đăng ký:** http://localhost:3000/register

## 👤 Tài Khoản Mặc Định

Ứng dụng tự động tạo hai tài khoản mặc định khi khởi động (xem file `src/config/seedUsers.js`):

### Admin Account

- **Username:** `admin`
- **Password:** `admin123`
- **Vai trò:** Admin (toàn quyền)
- **Email:** admin@example.com

### User Account

- **Username:** `user`
- **Password:** `user123`
- **Vai trò:** User (chỉ xem shop)
- **Email:** user@example.com

> 💡 **Lưu ý:** Sau lần đầu tiên khởi động, những tài khoản này sẽ được lưu vào database. Lần sau khởi động, chúng không bị ghi đè lại.

## 🔐 Phân Quyền Người Dùng

Hệ thống áp dụng hai vai trò chính:

### 👨‍💼 Admin (Quản Trị Viên)

| Tính năng              | Quyền |
| ---------------------- | ----- |
| Xem Dashboard          | ✅    |
| CRUD Categories        | ✅    |
| CRUD Products          | ✅    |
| Upload hình sản phẩm   | ✅    |
| CRUD Customers         | ✅    |
| CRUD Orders            | ✅    |
| Quản lý trạng thái đơn | ✅    |
| Cập nhật thanh toán    | ✅    |
| Xem Shop               | ✅    |
| Đặt hàng               | ✅    |

### 👥 User (Người Dùng)

| Tính năng              | Quyền |
| ---------------------- | ----- |
| Xem Dashboard          | ❌    |
| CRUD Categories        | ❌    |
| CRUD Products          | ❌    |
| Upload hình            | ❌    |
| CRUD Customers         | ❌    |
| CRUD Orders            | ❌    |
| Quản lý trạng thái đơn | ❌    |
| Cập nhật thanh toán    | ❌    |
| Xem Shop               | ✅    |
| Đặt hàng               | ✅    |
| Cập nhật hồ sơ cá nhân | ✅    |
| Cập nhật địa chỉ       | ✅    |

**Kiểm soát truy cập được xác thực ở:**

1. **Frontend:** Kiểm tra `localStorage` trước khi hiển thị trang
2. **Backend:** Middleware `requireRole("admin")` trên tất cả route admin

## 📸 Hướng Dẫn Upload Hình Ảnh

### Quy Trình Upload

1. **Từ Admin Dashboard:**
   - Vào trang **Products** (`/pages/products.html`)
   - Nhấn nút **"Thêm Sản Phẩm"** hoặc **"Chỉnh Sửa"**
   - Chọn file hình ảnh từ máy tính
   - Hình sẽ được upload cùng với dữ liệu sản phẩm

2. **Từ API:**

```javascript
const formData = new FormData();
formData.append("name", "Sản phẩm A");
formData.append("sku", "SKU123");
formData.append("category", "507f1f77bcf86cd799439011");
formData.append("price", 99999);
formData.append("stock", 50);
formData.append("description", "Mô tả sản phẩm");
formData.append("image", file); // File object từ input

const response = await fetch("/api/products", {
  method: "POST",
  body: formData,
});
```

### Lưu Ý Về Hình Ảnh

- **Định dạng hỗ trợ:** JPG, JPEG, PNG, GIF, WebP
- **Kích thước tối đa:** Tùy Multer config (mặc định: 5MB)
- **Đường dẫn lưu:** `/public/uploads/`
- **Truy cập:** `http://localhost:3000/uploads/[filename]`

### Cấu Hình Upload (Multer)

File cấu hình: `src/middleware/uploadMiddleware.js`

```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/uploads/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
```

## 🧪 Testing API Với Postman

### Cài Đặt Postman Collection

1. **Mở Postman**
   - Download [Postman](https://www.postman.com/downloads/) nếu chưa có

2. **Import Collection**
   - File: `postman/QuanLyBanHangOnline.postman_collection.json`
   - Vào Postman → **File** → **Import**
   - Chọn file collection

3. **Cấu Hình Environment (Tùy chọn)**
   - Tạo Environment mới
   - Thêm biến: `base_url` = `http://localhost:3000`

### Thứ Tự Test

1. **Authentication**
   - `POST /api/auth/login` - Đăng nhập
   - Copy token từ response (nếu cần)

2. **Categories**
   - `POST /api/categories` - Tạo danh mục
   - `GET /api/categories` - Lấy danh sách
   - Lưu lại `categoryId` từ response

3. **Products**
   - `POST /api/products` - Tạo sản phẩm (sử dụng `categoryId` ở trên)
   - `GET /api/products` - Lấy danh sách
   - Lưu `productId`

4. **Customers**
   - `POST /api/customers` - Tạo khách hàng
   - Lưu `customerId`

5. **Orders**
   - `POST /api/orders` - Tạo đơn hàng (sử dụng `customerId` và `productId`)
   - `GET /api/orders` - Lấy danh sách
   - `PUT /api/orders/:id/delivery-status` - Cập nhật trạng thái

### Sử Dụng Variables

Sau khi tạo dữ liệu, thay các biến bằng `_id` thực tế:

```
{{categoryId}}   → ID của danh mục
{{productId}}    → ID của sản phẩm
{{customerId}}   → ID của khách hàng
{{orderId}}      → ID của đơn hàng
```

## 💳 Phương Thức Thanh Toán

Hệ thống hỗ trợ 3 phương thức thanh toán:

### 1. **COD (Tiền mặt)**

- **Mã:** `cod`
- **Trạng thái thanh toán:** Không có (mặc định pending)
- **Mô tả:** Khách hàng thanh toán khi nhận hàng

### 2. **Chuyển Khoản (Bank Transfer)**

- **Mã:** `bank_transfer`
- **Trạng thái thanh toán:** Có (pending/received)
- **Mô tả:** Khách hàng chuyển tiền trước, admin xác nhận

### 3. **Thẻ Ngân Hàng (Card)**

- **Mã:** `card`
- **Trạng thái thanh toán:** Có (pending/received)
- **Mô tả:** Thanh toán bằng thẻ tín dụng/ghi nợ

> ⚠️ **Lưu ý:** Hiện tại ứng dụng chỉ quản lý trạng thái, không kết nối gateway thanh toán thực tế.

## 📊 Trạng Thái Đơn Hàng

Đơn hàng sẽ trải qua các trạng thái sau:

| Trạng thái    | Mã        | Mô tả         | Tiếp theo           |
| ------------- | --------- | ------------- | ------------------- |
| **Preparing** | preparing | Đang chuẩn bị | → Shipping          |
| **Shipping**  | shipping  | Đang giao     | → Success/Cancelled |
| **Success**   | success   | Hoàn thành    | ✅ Kết thúc         |
| **Cancelled** | cancelled | Hủy hàng      | ✅ Kết thúc         |

**Quy tắc chuyển trạng thái:**

- Chỉ admin có thể thay đổi trạng thái
- Không thể quay lại trạng thái trước đó
- Trạng thái mặc định khi tạo: `preparing`

## 🐛 Khắc Phục Sự Cố

### Vấn đề: Server không khởi động

**Lỗi: "Cannot connect to MongoDB"**

- ✅ Kiểm tra MongoDB service có chạy: `mongod` hoặc service manager
- ✅ Kiểm tra `MONGODB_URI` trong `.env`
- ✅ Nếu dùng MongoDB Atlas, kiểm tra IP whitelist
- ✅ Kiểm tra username/password nếu dùng authentication

**Lỗi: "Port 3000 already in use"**

- Thay đổi port trong `.env`: `PORT=3001`
- Hoặc kill process đang sử dụng port 3000:

  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F

  # macOS/Linux
  lsof -i :3000
  kill -9 <PID>
  ```

### Vấn đề: Lỗi upload file

**Lỗi: "EACCES: permission denied"**

- ✅ Kiểm tra quyền thư mục `/public/uploads/`
- ✅ Tạo thư mục nếu chưa tồn tại

**Lỗi: "File too large"**

- Cấu hình Multer trong `src/middleware/uploadMiddleware.js`
- Tăng limit: `limits: { fileSize: 10 * 1024 * 1024 }` (10MB)

### Vấn đề: Session hết hạn

**Người dùng bị logout tự động**

- Thời gian session mặc định: 8 giờ
- Thay đổi trong `src/app.js`: `maxAge: 1000 * 60 * 60 * 8`

### Vấn đề: Tài khoản mặc định không tạo

**Lỗi: "admin account already exists"**

- ✅ Bình thường - tài khoản chỉ tạo lần đầu
- ✅ Nếu muốn reset, xóa collection `users` trong MongoDB

### Vấn đề: Frontend không load được

**Trang trắng hoặc lỗi CORS**

- ✅ Kiểm tra console (F12 → Network, Console)
- ✅ Đảm bảo server chạy (http://localhost:3000)
- ✅ Clear cache: Ctrl+Shift+Delete
- ✅ Kiểm tra file path trong HTML

### Vấn đề: Không thể đăng nhập

**Lỗi: "Invalid credentials"**

- ✅ Kiểm tra username/password (case-sensitive)
- ✅ Đảm bảo tài khoản được seed: xem database
- ✅ Reset data: xóa database và restart server

**Lỗi: "Unauthorized"**

- ✅ Session có thể hết hạn → đăng nhập lại
- ✅ Xóa localStorage: F12 → Application → Clear All

## 📚 Tài Liệu Thêm

### Tài Liệu Chính Thức

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Multer Documentation](https://github.com/expressjs/multer)

### Hướng Dẫn Thêm

- [RESTful API Best Practices](https://restfulapi.net/)
- [MongoDB Schema Design](https://docs.mongodb.com/manual/core/data-model-design/)
- [Session Management Security](https://owasp.org/www-community/attacks/session_fixation)

### Contact & Support

- Để báo cáo lỗi hoặc đề xuất, vui lòng tạo Issue
- Để đóng góp code, tạo Pull Request

---

**Bản quyền © 2024 - Quản Lý Bán Hàng Online**  
License: MIT

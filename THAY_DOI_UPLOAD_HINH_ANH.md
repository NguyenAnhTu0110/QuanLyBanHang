# Tóm tắt các thay đổi - Upload Hình Ảnh Sản Phẩm

## 📋 Danh sách tất cả các tệp đã sửa đổi

### 1. **Backend - Node.js/Express**

#### [package.json](package.json)

- ✅ Thêm `multer` dependency: `"multer": "^1.4.5-lts.1"`
- Dùng để xử lý upload file multipart/form-data

#### [src/middleware/uploadMiddleware.js](src/middleware/uploadMiddleware.js) - **TẠO MỚI**

- Tạo middleware multer để xử lý file upload
- Cấu hình lưu file vào `/public/uploads/`
- Giới hạn kích thước: 5MB
- Chỉ cho phép: JPG, PNG, GIF, WebP
- Tạo tên file tự động: `timestamp-random.ext`

#### [src/models/Product.js](src/models/Product.js)

- ✅ Thêm field `image` (String) - lưu đường dẫn file upload
- Giữ nguyên `imageUrl` để backward compatibility
- Schema sẽ nhận cả hai loại hình ảnh

#### [src/controllers/productController.js](src/controllers/productController.js)

- ✅ Ghi đè phương thức `create()` để xử lý file upload
- ✅ Ghi đè phương thức `update()` để xử lý file upload
- Nếu có file, lưu vào `body.image = /uploads/filename`
- Vẫn hỗ trợ các field khác như trước

#### [src/routes/productRoutes.js](src/routes/productRoutes.js)

- ✅ Thêm upload middleware vào route POST và PUT
- `router.post("/", upload.single("image"), productController.create)`
- `router.put("/:id", upload.single("image"), productController.update)`

#### [src/app.js](src/app.js)

- ✅ Thêm route static cho `/uploads` folder
- `app.use("/uploads", express.static(pagePath("uploads")))`
- Cho phép trình duyệt truy cập file hình ảnh

---

### 2. **Frontend - HTML/CSS/JS**

#### [public/pages/products.html](public/pages/products.html)

- ✅ Thay đổi input "Link hình ảnh" thành file input
- Thêm `<input type="file" name="image" accept="image/*">`
- Thêm field tùy chọn "Link hình ảnh" (imageUrl)
- Hiển thị hỗ trợ định dạng và kích thước tối đa

#### [public/assets/js/api.js](public/assets/js/api.js)

- ✅ Cập nhật phương thức `request()` để hỗ trợ FormData
- Kiểm tra nếu body là FormData, không set Content-Type (browser tự set)
- Thêm 2 method mới: `createWithFile()` và `updateWithFile()`
- Vẫn hỗ trợ JSON API bình thường

#### [public/assets/js/products.js](public/assets/js/products.js)

- ✅ Cập nhật `fillForm()` - reset file input khi edit
- ✅ Cập nhật form submit handler:
  - Kiểm tra xem có file được chọn không
  - Nếu có file: tạo FormData, append tất cả fields + file
  - Sử dụng `api.createWithFile()` hoặc `api.updateWithFile()`
  - Nếu không có file: dùng JSON API bình thường
- Hỗ trợ cả 2 kiểu: upload file hoặc nhập link

#### [public/assets/js/shop.js](public/assets/js/shop.js)

- ✅ Cập nhật logic hiển thị hình ảnh
- Ưu tiên: `product.image` (upload) > `product.imageUrl` (link)
- Hiển thị tên sản phẩm nếu không có hình ảnh nào

---

### 3. **Cấu hình & Ignore**

#### [.gitignore](.gitignore)

- ✅ Thêm quy tắc bỏ qua thư mục uploads
- `/public/uploads/*` - bỏ qua tất cả file trong uploads
- `!/public/uploads/.gitkeep` - giữ lại .gitkeep để có thư mục

#### [public/uploads/.gitkeep](public/uploads/.gitkeep) - **TẠO MỚI**

- File rỗng để git track thư mục uploads

#### [UPLOAD_IMAGE_GUIDE.md](UPLOAD_IMAGE_GUIDE.md) - **TẠO MỚI**

- Hướng dẫn sử dụng tính năng upload hình ảnh

---

## 🔄 Quy trình hoạt động

### Thêm sản phẩm với hình ảnh:

```
1. User chọn file hình ảnh từ máy
2. Form tạo FormData: {name, sku, image_file, ...}
3. API gửi FormData tới server
4. Middleware multer xử lý: validate, lưu file
5. Controller nhận: req.file có thông tin file
6. Lưu vào DB: image = "/uploads/timestamp-random.jpg"
7. Frontend hiển thị: <img src="/uploads/timestamp-random.jpg" />
```

### Cập nhật sản phẩm:

- Nếu chọn file mới: upload và update `image`
- Nếu không chọn: giữ nguyên hình ảnh cũ
- Nếu nhập link: cập nhật `imageUrl`

---

## ✅ Kiểm tra sau khi sửa

1. **Cài đặt dependencies**:

   ```bash
   npm install
   ```

2. **Chạy server**:

   ```bash
   npm run dev  # hoặc npm start
   ```

3. **Kiểm tra tính năng**:
   - ✅ Vào trang Products
   - ✅ Thêm sản phẩm mới + chọn hình ảnh
   - ✅ Kiểm tra file được lưu tại `/public/uploads/`
   - ✅ Hình ảnh hiển thị đúng trên shop
   - ✅ Cập nhật sản phẩm + chọn hình ảnh khác
   - ✅ Hình ảnh cũ giữ lại nếu không chọn file mới

---

## 🛠️ Tùy chỉnh

### Thay đổi kích thước tối đa file:

Sửa tại `src/middleware/uploadMiddleware.js`:

```javascript
limits: {
  fileSize: 10 * 1024 * 1024, // 10MB
},
```

### Thêm định dạng hình ảnh khác:

Sửa tại `src/middleware/uploadMiddleware.js`:

```javascript
const allowedMimes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];
const allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
```

### Thay đổi thư mục lưu file:

Sửa tại `src/middleware/uploadMiddleware.js`:

```javascript
const uploadsDir = path.join(__dirname, "../../public/images"); // thay đổi đường dẫn
```

---

## 📝 Lưu ý quan trọng

1. **Thư mục uploads**: Sẽ được tạo tự động khi server chạy
2. **File name**: Được tạo tự động để tránh xung đột
3. **Backward compatibility**: Hệ thống vẫn hỗ trợ imageUrl cũ
4. **Cleanup**: Cần xóa thủ công file cũ từ thư mục uploads nếu xóa sản phẩm
5. **Storage**: Đọc thêm để lưu file trên cloud (S3, Cloudinary, etc.)

---

## 🎯 Kết quả

✅ Người dùng có thể upload hình ảnh trực tiếp từ máy
✅ Hình ảnh tự động lưu vào server
✅ Hiển thị đúng trên trang shop
✅ Vẫn hỗ trợ nhập link hình ảnh cũ
✅ Xử lý lỗi file (kích thước, định dạng)

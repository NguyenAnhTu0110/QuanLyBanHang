# Hướng dẫn sử dụng Upload Hình Ảnh Sản Phẩm

## Thay đổi chính

Hệ thống đã được cập nhật để hỗ trợ upload hình ảnh sản phẩm từ máy tính của bạn, thay vì phải nhập link.

## Cách sử dụng

### 1. **Thêm sản phẩm mới**

- Vào trang "Quản lý Sản phẩm"
- Điền thông tin sản phẩm
- Trong trường **"Hình ảnh sản phẩm"**, click để chọn file từ máy tính
- Hỗ trợ các định dạng: JPG, PNG, GIF, WebP (Tối đa 5MB)
- Click "Lưu sản phẩm"

### 2. **Cập nhật sản phẩm**

- Click "Sửa" trên sản phẩm cần cập nhật
- Có thể chọn hình ảnh mới hoặc giữ nguyên
- Tùy chọn: nhập link hình ảnh thay thế (nếu không upload file)

### 3. **Tùy chọn thay thế**

- Nếu không upload file, bạn vẫn có thể nhập link hình ảnh trực tiếp
- Hệ thống sẽ ưu tiên sử dụng file upload nếu có cả hai

## Thư mục lưu trữ

- Hình ảnh upload sẽ được lưu tại: `/public/uploads/`
- Tên file tự động được tạo để tránh xung đột

## Yêu cầu kỹ thuật

- Node.js packages: `multer` đã được thêm vào package.json
- Chạy `npm install` để cài đặt dependencies
- Đảm bảo thư mục `/public/uploads/` tồn tại (sẽ được tạo tự động)

## Hỗ trợ lỗi

- **File quá lớn**: Tối đa 5MB
- **Định dạng không hỗ trợ**: Chỉ JPG, PNG, GIF, WebP
- **Thư mục uploads**: Sẽ được tạo tự động khi chạy server

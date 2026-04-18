// Vietnam Address Data
const vietnamAddressData = {
  "Thành phố Hồ Chí Minh": {
    "Quận 1": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16", "Phường 17", "Phường 18", "Phường 19", "Phường 20", "Phường 21", "Phường 22", "Phường 23", "Phường 24"],
    "Quận 2": ["Phường An Khánh", "Phường An Lợi Đông", "Phường An Phú", "Phường Bình An", "Phường Bình Trưng Đông", "Phường Bình Trưng Tây", "Phường Cát Lái", "Phường Thạnh Mỹ Lợi", "Phường Thủ Thiêm"],
    "Quận 3": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14"],
    "Quận 4": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16"],
    "Quận 5": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16"],
    "Quận 6": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14"],
    "Quận 7": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16"],
    "Quận 8": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16"],
    "Quận 9": ["Phường An Phú", "Phường Phước Long A", "Phường Phước Long B", "Phường Phước Bình", "Phường Tăng Nhơn Phú A", "Phường Tăng Nhơn Phú B", "Phường Trường Thạnh", "Phường Long Bình", "Phường Long Trường", "Phường Hiệp Phú"],
    "Quận 10": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15"],
    "Quận 11": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15"],
    "Quận 12": ["Phường An Phú Tây", "Phường Cây Xanh", "Phường Hiệp Nhất", "Phường Tân Chánh Hiệp", "Phường Tân Hưởng", "Phường Tân Thới Hiệp", "Phường Tân Thới Nhất"],
    "Quận Thủ Đức": ["Phường Bình Thạnh", "Phường Linh Chiểu", "Phường Linh Đông", "Phường Linh Tây", "Phường Linh Xuân", "Phường Tam Bình", "Phường Tam Phú", "Phường Tam Thôn Nhất", "Phường Thạnh Lộc", "Phường Thạnh Mỹ Lợi"],
  },
  "Hà Nội": {
    "Quận Hoàn Kiếm": ["Phường Cửa Nam", "Phường Cửa Đông", "Phường Cửa Bắc", "Phường Lý Thái Tổ", "Phường Tràng Tiền", "Phường Hàng Trắng", "Phường Hàng Bạc", "Phường Hàng Bột", "Phường Hàng Gai", "Phường Phúc Tân"],
    "Quận Ba Đình": ["Phường Phúc Xá", "Phường Quảng An", "Phường Thanh Xuân Trung", "Phường Thanh Xuân Nam", "Phường Thanh Xuân Bắc", "Phường Nguyễn Trung Trực", "Phường Trúc Bạch"],
    "Quận Hai Bà Trưng": ["Phường Bạch Đằng", "Phường Bồ Đề", "Phường Đống Đác", "Phường Giáp Bát", "Phường Hàng Bột", "Phường Lê Đại Hành", "Phường Minh Khai", "Phường Thanh Bình"],
  },
};

// Export cho browser
if (typeof window !== 'undefined') {
  window.vietnamAddressData = vietnamAddressData;
}

// Export cho Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = vietnamAddressData;
}

// Vietnam provinces, districts, and wards data (Filtered: Hà Nội, Đà Nẵng, Đắk Lắk, TP.HCM)
const vietnamAddresses = {
  provinces: [
    { id: "01", name: "Hà Nội" },
    { id: "48", name: "Đà Nẵng" },
    { id: "66", name: "Đắk Lắk" },
    { id: "79", name: "TP. Hồ Chí Minh" },
  ],

  districts: {
    // Hà Nội (30 đơn vị)
    "01": [
      { id: "001", name: "Quận Ba Đình" }, { id: "002", name: "Quận Hoàn Kiếm" }, { id: "003", name: "Quận Tây Hồ" },
      { id: "004", name: "Quận Long Biên" }, { id: "005", name: "Quận Cầu Giấy" }, { id: "006", name: "Quận Đống Đa" },
      { id: "007", name: "Quận Hai Bà Trưng" }, { id: "008", name: "Quận Hoàng Mai" }, { id: "009", name: "Quận Thanh Xuân" },
      { id: "016", name: "Huyện Sóc Sơn" }, { id: "017", name: "Huyện Đông Anh" }, { id: "018", name: "Huyện Gia Lâm" },
      { id: "019", name: "Quận Nam Từ Liêm" }, { id: "020", name: "Huyện Thanh Trì" }, { id: "021", name: "Quận Bắc Từ Liêm" },
      { id: "250", name: "Huyện Mê Linh" }, { id: "268", name: "Quận Hà Đông" }, { id: "269", name: "Thị xã Sơn Tây" },
      { id: "271", name: "Huyện Ba Vì" }, { id: "272", name: "Huyện Phúc Thọ" }, { id: "273", name: "Huyện Đan Phượng" },
      { id: "274", name: "Huyện Hoài Đức" }, { id: "275", name: "Huyện Quốc Oai" }, { id: "276", name: "Huyện Thạch Thất" },
      { id: "277", name: "Huyện Chương Mỹ" }, { id: "278", name: "Huyện Thanh Oai" }, { id: "279", name: "Huyện Thường Tín" },
      { id: "280", name: "Huyện Phú Xuyên" }, { id: "281", name: "Huyện Ứng Hòa" }, { id: "282", name: "Huyện Mỹ Đức" },
    ],
    // Đà Nẵng (8 đơn vị)
    "48": [
      { id: "490", name: "Quận Liên Chiểu" }, { id: "491", name: "Quận Thanh Khê" }, { id: "492", name: "Quận Hải Châu" },
      { id: "493", name: "Quận Sơn Trà" }, { id: "494", name: "Quận Ngũ Hành Sơn" }, { id: "495", name: "Quận Cẩm Lệ" },
      { id: "497", name: "Huyện Hòa Vang" }, { id: "498", name: "Huyện Hoàng Sa" },
    ],
    // Đắk Lắk (15 đơn vị)
    "66": [
      { id: "643", name: "Thành phố Buôn Ma Thuột" }, { id: "644", name: "Thị xã Buôn Hồ" }, { id: "645", name: "Huyện Ea H'leo" },
      { id: "646", name: "Huyện Ea Súp" }, { id: "647", name: "Huyện Buôn Đôn" }, { id: "648", name: "Huyện Cư M'gar" },
      { id: "649", name: "Huyện Krông Búk" }, { id: "650", name: "Huyện Krông Năng" }, { id: "651", name: "Huyện Ea Kar" },
      { id: "652", name: "Huyện M'Đrắk" }, { id: "653", name: "Huyện Krông Pắc" }, { id: "654", name: "Huyện Krông Ana" },
      { id: "655", name: "Huyện Lắk" }, { id: "656", name: "Huyện Krông Bông" }, { id: "657", name: "Huyện Cư Kuin" },
    ],
    // TP. Hồ Chí Minh (22 đơn vị)
    "79": [
      { id: "760", name: "Quận 1" }, { id: "761", name: "Quận 12" }, { id: "764", name: "Quận Gò Vấp" },
      { id: "765", name: "Quận Bình Thạnh" }, { id: "766", name: "Quận Tân Bình" }, { id: "767", name: "Quận Tân Phú" },
      { id: "768", name: "Quận Phú Nhuận" }, { id: "769", name: "Thành phố Thủ Đức" }, { id: "770", name: "Quận 3" },
      { id: "771", name: "Quận 10" }, { id: "772", name: "Quận 11" }, { id: "773", name: "Quận 4" },
      { id: "774", name: "Quận 5" }, { id: "775", name: "Quận 6" }, { id: "776", name: "Quận 8" },
      { id: "777", name: "Quận Bình Tân" }, { id: "778", name: "Quận 7" }, { id: "783", name: "Huyện Củ Chi" },
      { id: "784", name: "Huyện Hóc Môn" }, { id: "785", name: "Huyện Bình Chánh" }, { id: "786", name: "Huyện Nhà Bè" },
      { id: "787", name: "Huyện Cần Giờ" },
    ],
  },

  wards: {
    /* ========================= ĐÀ NẴNG (FULL 100%) ========================= */
    "490": [ // Liên Chiểu
      { id: "20194", name: "Phường Hòa Hiệp Bắc" }, { id: "20195", name: "Phường Hòa Hiệp Nam" },
      { id: "20197", name: "Phường Hòa Khánh Bắc" }, { id: "20198", name: "Phường Hòa Khánh Nam" },
      { id: "20200", name: "Phường Hòa Minh" }
    ],
    "491": [ // Thanh Khê
      { id: "20203", name: "Phường Tam Thuận" }, { id: "20206", name: "Phường Thanh Khê Tây" },
      { id: "20209", name: "Phường Thanh Khê Đông" }, { id: "20212", name: "Phường Xuân Hà" },
      { id: "20215", name: "Phường Tân Chính" }, { id: "20218", name: "Phường Chính Gián" },
      { id: "20221", name: "Phường Vĩnh Trung" }, { id: "20224", name: "Phường Thạc Gián" },
      { id: "20227", name: "Phường An Khê" }, { id: "20230", name: "Phường Hòa Khê" }
    ],
    "492": [ // Hải Châu
      { id: "20233", name: "Phường Thanh Bình" }, { id: "20236", name: "Phường Thuận Phước" },
      { id: "20239", name: "Phường Thạch Thang" }, { id: "20242", name: "Phường Hải Châu I" },
      { id: "20245", name: "Phường Hải Châu II" }, { id: "20248", name: "Phường Phước Ninh" },
      { id: "20251", name: "Phường Hòa Thuận Tây" }, { id: "20254", name: "Phường Hòa Thuận Đông" },
      { id: "20257", name: "Phường Nam Dương" }, { id: "20260", name: "Phường Bình Hiên" },
      { id: "20263", name: "Phường Bình Thuận" }, { id: "20266", name: "Phường Hòa Cường Bắc" },
      { id: "20269", name: "Phường Hòa Cường Nam" }
    ],
    "493": [ // Sơn Trà
      { id: "20272", name: "Phường Thọ Quang" }, { id: "20275", name: "Phường Nại Hiên Đông" },
      { id: "20278", name: "Phường Mân Thái" }, { id: "20281", name: "Phường An Hải Bắc" },
      { id: "20284", name: "Phường Phước Mỹ" }, { id: "20287", name: "Phường An Hải Tây" },
      { id: "20290", name: "Phường An Hải Đông" }
    ],
    "494": [ // Ngũ Hành Sơn
      { id: "20293", name: "Phường Mỹ An" }, { id: "20296", name: "Phường Khuê Mỹ" },
      { id: "20299", name: "Phường Hòa Hải" }, { id: "20302", name: "Phường Hòa Quý" }
    ],
    "495": [ // Cẩm Lệ
      { id: "20305", name: "Phường Khuê Trung" }, { id: "20308", name: "Phường Hòa Phát" },
      { id: "20311", name: "Phường Hòa An" }, { id: "20314", name: "Phường Hòa Thọ Tây" },
      { id: "20317", name: "Phường Hòa Thọ Đông" }, { id: "20320", name: "Phường Hòa Xuân" }
    ],
    "497": [ // Hòa Vang
      { id: "20323", name: "Xã Hòa Bắc" }, { id: "20326", name: "Xã Hòa Liên" },
      { id: "20329", name: "Xã Hòa Ninh" }, { id: "20332", name: "Xã Hòa Sơn" },
      { id: "20335", name: "Xã Hòa Nhơn" }, { id: "20338", name: "Xã Hòa Phú" },
      { id: "20341", name: "Xã Hòa Phong" }, { id: "20344", name: "Xã Hòa Châu" },
      { id: "20347", name: "Xã Hòa Tiến" }, { id: "20350", name: "Xã Hòa Phước" },
      { id: "20353", name: "Xã Hòa Khương" }
    ],
    "498": [], // Hoàng Sa không có phân cấp phường xã

    /* ========================= TP HỒ CHÍ MINH (Các quận/huyện chính) ========================= */
    "760": [ // Quận 1
      { id: "26734", name: "Phường Tân Định" }, { id: "26737", name: "Phường Đa Kao" },
      { id: "26740", name: "Phường Bến Nghé" }, { id: "26743", name: "Phường Bến Thành" },
      { id: "26746", name: "Phường Nguyễn Thái Bình" }, { id: "26749", name: "Phường Phạm Ngũ Lão" },
      { id: "26752", name: "Phường Cầu Ông Lãnh" }, { id: "26755", name: "Phường Cô Giang" },
      { id: "26758", name: "Phường Nguyễn Cư Trinh" }, { id: "26761", name: "Phường Cầu Kho" }
    ],
    "770": [ // Quận 3
      { id: "27151", name: "Phường Võ Thị Sáu" }, { id: "27154", name: "Phường 09" },
      { id: "27157", name: "Phường 10" }, { id: "27160", name: "Phường 11" },
      { id: "27163", name: "Phường 12" }, { id: "27166", name: "Phường 13" },
      { id: "27169", name: "Phường 14" }, { id: "27172", name: "Phường 01" },
      { id: "27175", name: "Phường 02" }, { id: "27178", name: "Phường 03" },
      { id: "27181", name: "Phường 04" }, { id: "27184", name: "Phường 05" }
    ],
    "773": [ // Quận 4
      { id: "27256", name: "Phường 12" }, { id: "27259", name: "Phường 13" },
      { id: "27262", name: "Phường 09" }, { id: "27265", name: "Phường 06" },
      { id: "27268", name: "Phường 08" }, { id: "27271", name: "Phường 10" },
      { id: "27274", name: "Phường 03" }, { id: "27277", name: "Phường 18" },
      { id: "27280", name: "Phường 02" }, { id: "27283", name: "Phường 04" },
      { id: "27286", name: "Phường 14" }, { id: "27289", name: "Phường 15" },
      { id: "27292", name: "Phường 16" }, { id: "27295", name: "Phường 01" }
    ],
    "769": [ // TP Thủ Đức (Đại diện các phường chính do số lượng lớn)
      { id: "26764", name: "Phường Linh Xuân" }, { id: "26767", name: "Phường Bình Chiểu" },
      { id: "26770", name: "Phường Linh Trung" }, { id: "26773", name: "Phường Tam Bình" },
      { id: "26776", name: "Phường Tam Phú" }, { id: "26779", name: "Phường Hiệp Bình Phước" },
      { id: "26782", name: "Phường Hiệp Bình Chánh" }, { id: "26785", name: "Phường Linh Chiểu" },
      { id: "26788", name: "Phường Linh Tây" }, { id: "26791", name: "Phường Linh Đông" },
      { id: "26794", name: "Phường Bình Thọ" }, { id: "26797", name: "Phường Trường Thọ" },
      { id: "26800", name: "Phường Long Bình" }, { id: "26803", name: "Phường Long Thạnh Mỹ" },
      { id: "26806", name: "Phường Tân Phú" }, { id: "26809", name: "Phường Hiệp Phú" },
      { id: "26812", name: "Phường Tăng Nhơn Phú A" }, { id: "26815", name: "Phường Tăng Nhơn Phú B" },
      { id: "26818", name: "Phường Phước Long B" }, { id: "26821", name: "Phường Phước Long A" },
      { id: "26824", name: "Phường Trường Thạnh" }, { id: "26827", name: "Phường Long Phước" },
      { id: "26830", name: "Phường Long Trường" }, { id: "26833", name: "Phường Phước Bình" },
      { id: "26836", name: "Phường Phú Hữu" }, { id: "26839", name: "Phường Thảo Điền" },
      { id: "26842", name: "Phường An Phú" }, { id: "26845", name: "Phường An Khánh" },
      { id: "26848", name: "Phường Bình Trưng Đông" }, { id: "26851", name: "Phường Bình Trưng Tây" },
      { id: "26854", name: "Phường Cát Lái" }, { id: "26857", name: "Phường Thạnh Mỹ Lợi" },
      { id: "26860", name: "Phường An Lợi Đông" }, { id: "26863", name: "Phường Thủ Thiêm" }
    ],

    /* ========================= HÀ NỘI (Các quận trung tâm) ========================= */
    "002": [ // Hoàn Kiếm
      { id: "00037", name: "Phường Phúc Tân" }, { id: "00040", name: "Phường Đồng Xuân" },
      { id: "00043", name: "Phường Hàng Mã" }, { id: "00046", name: "Phường Hàng Buồm" },
      { id: "00049", name: "Phường Hàng Đào" }, { id: "00052", name: "Phường Hàng Bồ" },
      { id: "00055", name: "Phường Cửa Đông" }, { id: "00058", name: "Phường Lý Thái Tổ" },
      { id: "00061", name: "Phường Hàng Bạc" }, { id: "00064", name: "Phường Hàng Gai" },
      { id: "00067", name: "Phường Chương Dương" }, { id: "00070", name: "Phường Hàng Trống" },
      { id: "00073", name: "Phường Cửa Nam" }, { id: "00076", name: "Phường Hàng Bông" },
      { id: "00079", name: "Phường Tràng Tiền" }, { id: "00082", name: "Phường Trần Hưng Đạo" },
      { id: "00085", name: "Phường Phan Chu Trinh" }, { id: "00088", name: "Phường Hàng Bài" }
    ],
    "001": [ // Ba Đình
      { id: "00001", name: "Phường Phúc Xá" }, { id: "00004", name: "Phường Trúc Bạch" },
      { id: "00007", name: "Phường Vĩnh Phúc" }, { id: "00010", name: "Phường Cống Vị" },
      { id: "00013", name: "Phường Liễu Giai" }, { id: "00016", name: "Phường Nguyễn Trung Trực" },
      { id: "00019", name: "Phường Quán Thánh" }, { id: "00022", name: "Phường Ngọc Hà" },
      { id: "00025", name: "Phường Điện Biên" }, { id: "00028", name: "Phường Đội Cấn" },
      { id: "00031", name: "Phường Ngọc Khánh" }, { id: "00034", name: "Phường Kim Mã" },
      { id: "00037", name: "Phường Giảng Võ" }, { id: "00040", name: "Phường Thành Công" }
    ],
    "006": [ // Đống Đa
      { id: "00136", name: "Phường Cát Linh" }, { id: "00139", name: "Phường Văn Miếu" },
      { id: "00142", name: "Phường Quốc Tử Giám" }, { id: "00145", name: "Phường Láng Thượng" },
      { id: "00148", name: "Phường Ô Chợ Dừa" }, { id: "00151", name: "Phường Văn Chương" },
      { id: "00154", name: "Phường Hàng Bột" }, { id: "00157", name: "Phường Láng Hạ" },
      { id: "00160", name: "Phường Khâm Thiên" }, { id: "00163", name: "Phường Thổ Quan" },
      { id: "00166", name: "Phường Nam Đồng" }, { id: "00169", name: "Phường Trung Phụng" },
      { id: "00172", name: "Phường Quang Trung" }, { id: "00175", name: "Phường Trung Liệt" },
      { id: "00178", name: "Phường Phương Liên" }, { id: "00181", name: "Phường Thịnh Quang" },
      { id: "00184", name: "Phường Trung Tự" }, { id: "00187", name: "Phường Kim Liên" },
      { id: "00190", name: "Phường Phương Mai" }, { id: "00193", name: "Phường Ngã Tư Sở" },
      { id: "00196", name: "Phường Khương Thượng" }
    ],

    /* ========================= ĐẮK LẮK (TP. Buôn Ma Thuột) ========================= */
    "643": [
      { id: "23965", name: "Phường Tân Đạt" }, { id: "23968", name: "Phường Tân An" },
      { id: "23971", name: "Phường Tân Lập" }, { id: "23974", name: "Phường Thắng Lợi" },
      { id: "23977", name: "Phường Thành Công" }, { id: "23980", name: "Phường Tân Tiến" },
      { id: "23983", name: "Phường Thành Nhất" }, { id: "23986", name: "Phường Thống Nhất" },
      { id: "23989", name: "Phường Tân Thành" }, { id: "23992", name: "Phường Tân Hòa" },
      { id: "23995", name: "Phường Tự An" }, { id: "23998", name: "Phường Ea Tam" },
      { id: "24001", name: "Phường Khánh Xuân" }, { id: "24004", name: "Xã Ea Tu" },
      { id: "24007", name: "Xã Cư ÊBur" }, { id: "24010", name: "Xã Hòa Thuận" },
      { id: "24013", name: "Xã Hòa Thắng" }, { id: "24016", name: "Xã Ea Kao" },
      { id: "24019", name: "Xã Hòa Phú" }, { id: "24022", name: "Xã Hòa Xuân" },
      { id: "24025", name: "Xã Hòa Khánh" }
    ]
  }
};

module.exports = vietnamAddresses;
import { Product, StoreInfo, Promo, ShopeeItem, Review } from './types';

export const demoStoreInfo: StoreInfo = {
  'Tên cửa hàng': 'Tiệm Anh Thanh - PAT FOOD',
  'Slogan': 'Đồ ăn ngon • Đồ uống mát — Giao niềm vui mỗi ngày',
  'Địa chỉ': 'khu phố 3, Phường Thới Hòa, Thành phố Bến Cát, Tỉnh Bình Dương, Việt Nam',
  'Số điện thoại': '0939944931',
  'Zalo': '0939944931',
  'Giờ mở cửa': '8:00 – 22:00 mỗi ngày',
  'Logo URL': `${import.meta.env.BASE_URL}Logo.png`,
  'Hero Banner URL': `${import.meta.env.BASE_URL}Banner.png`,
  banners: [`${import.meta.env.BASE_URL}Banner.png`],
  'Mô tả ngắn': 'Đồ ăn ngon & nước uống mát lạnh chất lượng, phục vụ cư dân và công nhân Bến Cát – Giao hàng 30 phút',
  'Tên ngân hàng': 'MBbank',
  'Mã ngân hàng': 'MB',
  'Số tài khoản': '00939944931',
  'Tên chủ TK': 'PHAN ANH TUAN',
  'Shopee Store': 'https://shopee.vn/patmilk',
  'Facebook': 'https://www.facebook.com/pat.kg.2025',
  'Google Maps Embed URL': '',
  So_Sao: 4.9,
  Don_Hom_Nay: 128,
  Thoi_Gian_Giao: 30,
  'Mascot URL': `${import.meta.env.BASE_URL}Logo.png`,
  Banner_Mode: 'poster'
};

export const demoProducts: Product[] = [
  {
    ID: "SP001",
    "Tên sản phẩm": "Cơm sườn",
    "Danh mục": "Điểm tâm sáng",
    "Giá bán": 25000,
    "Đơn vị tính": "Phần",
    "Link hình ảnh": "https://comtamsongngoc.vn/upload/product/z458171568579384a02807ba7092b1ca36162fecc11575-8706.jpg",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Cơm sườn thơm lừng, thịt ướp đậm đà ăn kèm dưa leo, cà chua và mỡ hành."
  },
  {
    ID: "SP002",
    "Tên sản phẩm": "Cơm sườn trứng",
    "Danh mục": "Điểm tâm sáng",
    "Giá bán": 25000,
    "Đơn vị tính": "Phần",
    "Link hình ảnh": "https://cdn.tgdd.vn/Files/2021/08/09/1373996/tu-lam-com-tam-suon-trung-don-gian-thom-ngon-nhu-ngoai-hang-202108091254057039.jpg",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Cơm tấm sườn nướng kèm trứng ốp la béo ngậy, tròn vị bữa sáng năng lượng."
  },
  {
    ID: "SP003",
    "Tên sản phẩm": "Bún thịt nướng",
    "Danh mục": "Điểm tâm sáng",
    "Giá bán": 20000,
    "Đơn vị tính": "Phần",
    "Link hình ảnh": "https://laque.vn/wp-content/uploads/2022/07/bun-thit-nuong-hue-1.jpg",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Bún tươi ăn cùng thịt nướng vàng óng, rau sống thanh mát và nước mắm chua ngọt."
  },
  {
    ID: "SP004",
    "Tên sản phẩm": "Bánh ướt",
    "Danh mục": "Điểm tâm sáng",
    "Giá bán": 20000,
    "Đơn vị tính": "Phần",
    "Link hình ảnh": "https://mms.img.susercontent.com/vn-11134513-81ztc-mntp2cbrj9xd77@resize_ss1242x600!@crop_w1242_h600_cT",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Bánh ướt nóng mềm mướt kèm chả lụa, nem, giá trụng và nước mắm pha chuẩn vị."
  },
  {
    ID: "SP005",
    "Tên sản phẩm": "Bánh hỏi",
    "Danh mục": "Điểm tâm sáng",
    "Giá bán": 20000,
    "Đơn vị tính": "Phần",
    "Link hình ảnh": "https://afamilycdn.com/zoom/700_438/150157425591193600/2020/5/23/image7-15902499629441441791846-237-0-1837-2560-crop-1590250346969365194462.jpg",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Bánh hỏi tơi xốp quét mỡ hành thơm phức kèm thịt nướng đậm đà."
  },
  {
    ID: "SP006",
    "Tên sản phẩm": "Bánh mì thịt",
    "Danh mục": "Điểm tâm sáng",
    "Giá bán": 15000,
    "Đơn vị tính": "Ổ",
    "Link hình ảnh": "https://133748497.cdn6.editmysite.com/uploads/1/3/3/7/133748497/KU4IHBWI6JM6X2IKA3G72LU4.jpeg",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Bánh mì vỏ giòn rụm kẹp thịt nướng, pate, bơ và đồ chua tươi giòn hấp dẫn."
  },
  {
    ID: "SP007",
    "Tên sản phẩm": "Bánh trứng",
    "Danh mục": "Điểm tâm sáng",
    "Giá bán": 15000,
    "Đơn vị tính": "Ổ",
    "Link hình ảnh": "https://cdn.tasteatlas.com/images/dishes/79e548ecfc0547eb829be8a51d8ed599.jpg?w=600",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Bánh mì ốp la trứng lòng đào béo ngậy, rắc chút tiêu và nước tương thơm lừng."
  },
  {
    ID: "SP008",
    "Tên sản phẩm": "Xôi thịt",
    "Danh mục": "Điểm tâm sáng",
    "Giá bán": 15000,
    "Đơn vị tính": "Phần",
    "Link hình ảnh": "https://i.ytimg.com/vi/8Niu7LNx5Uw/maxresdefault.jpg",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Xôi nếp dẻo thơm ăn kèm thịt kho đậm đà và hành phi giòn rụm."
  },
  {
    ID: "SP009",
    "Tên sản phẩm": "Cà phê sữa đá",
    "Danh mục": "Đồ uống",
    "Giá bán": 20000,
    "Đơn vị tính": "Ly",
    "Link hình ảnh": "https://giacaphe.com/wp-content/uploads/2023/03/ca-phe-sua-da-2-800x625.jpg",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Cà phê pha phin truyền thống thơm nồng hòa quyện cùng sữa đặc béo ngậy."
  },
  {
    ID: "SP010",
    "Tên sản phẩm": "Cà phê đen đá",
    "Danh mục": "Đồ uống",
    "Giá bán": 15000,
    "Đơn vị tính": "Ly",
    "Link hình ảnh": "https://giadinh.phenikaa.com/wp-content/uploads/2021/07/ly-ca-phe-nhat.jpg",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Cà phê đen đá nguyên chất đậm đà, chuẩn vị tỉnh táo cho ngày mới."
  },
  {
    ID: "SP011",
    "Tên sản phẩm": "Trà tắc - Size M",
    "Danh mục": "Đồ uống",
    "Giá bán": 15000,
    "Đơn vị tính": "Ly",
    "Link hình ảnh": "https://cdn.tgdd.vn/Files/2019/02/19/1150790/cach-lam-tra-tac-giai-nhiet-voi-cong-thuc-pha-cuc-ngon-tai-nha-202208261311497900.jpeg",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Trà tắc chua ngọt mát lạnh, giải nhiệt sảng khoái ngày hè."
  },
  {
    ID: "SP012",
    "Tên sản phẩm": "Trà tắc - Size L",
    "Danh mục": "Đồ uống",
    "Giá bán": 20000,
    "Đơn vị tính": "Ly",
    "Link hình ảnh": "https://cdn.tgdd.vn/Files/2019/02/19/1150790/cach-lam-tra-tac-giai-nhiet-voi-cong-thuc-pha-cuc-ngon-tai-nha-202208261311497900.jpeg",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Ly lớn sảng khoái, vị trà thơm lừng kết hợp tắc tươi thanh mát."
  },
  {
    ID: "SP013",
    "Tên sản phẩm": "Dừa tươi",
    "Danh mục": "Đồ uống",
    "Giá bán": 15000,
    "Đơn vị tính": "Ly",
    "Link hình ảnh": "https://admin.vov.gov.vn/UploadFolder/KhoTin/Images/UploadFolder/VOVVN/Images/sites/default/files/styles/large/public/2023-08/20200513_094457_911488_loi-ich-cua-nuoc-du.max-1800x1800.jpg",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Nước dừa tươi ngọt thanh tự nhiên, thanh lọc cơ thể."
  },
  {
    ID: "SP014",
    "Tên sản phẩm": "Nước mía",
    "Danh mục": "Đồ uống",
    "Giá bán": 10000,
    "Đơn vị tính": "Ly",
    "Link hình ảnh": "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2026/4/8/dai-thao-duong-1-1775616370789749263692.png",
    "Trạng thái": "Còn hàng",
    "Mô tả": "Nước mía ép tươi nguyên chất ngọt lịm, giải khát tức thì."
  }
];

export const demoPromos: Promo[] = [];

export const demoShopee: ShopeeItem[] = [
  { ID: "S1", "Tên sản phẩm": "Cốc Cà Phê & Trà Sữa Giữ Nhiệt Lock&Lock 500ml", "Hình ảnh": "https://img.lazcdn.com/g/ff/kf/Sb41e6ddf4a64483397133701873feae6P.jpg_720x720q80.jpg_.webp", "Link Affiliate": "https://shopee.vn/patmilk" },
  { ID: "S2", "Tên sản phẩm": "Bình Thủy Tinh Kèm Ống Hút Thủy Tinh Cao Cấp", "Hình ảnh": "https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mfnu83w3pvrg09.webp", "Link Affiliate": "https://shopee.vn/patmilk" }
];

export const demoReviews: Review[] = [
  { ID: "R1", "SĐT": "093***493", "Tên SP": "Cơm sườn", "Sao": 5, "Bình luận": "Thịt sườn ướp đậm đà, mềm ngon, cơm dẻo nóng hổi!", "Thời gian": "10/05/2026" },
  { ID: "R2", "SĐT": "098***789", "Tên SP": "Bánh mì thịt", "Sao": 5, "Bình luận": "Bánh mì giòn rụm, thịt nhiều, nước sốt rất vừa miệng.", "Thời gian": "09/05/2026" },
];

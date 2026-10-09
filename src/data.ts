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
  'Mô tả ngắn': 'Trà sữa đậm vị & món ăn ngon chất lượng, phục vụ công nhân và cư dân Bến Cát – Giao hàng 30 phút',
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
  { ID:"PM001", "Tên sản phẩm":"Trà Sữa Trân Châu Hoàng Kim", "Danh mục":"Trà Sữa", "Giá bán":28000, "Đơn vị tính":"Ly", "Link hình ảnh":"https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=600", "Trạng thái":"Còn hàng", "Mô tả":"Trà sữa truyền thống béo ngậy kết hợp cùng trân châu hoàng kim dai giòn sần sật." },
  { ID:"PM002", "Tên sản phẩm":"Trà Đào Cam Sả Tươi Mát", "Danh mục":"Trà Trái Cây", "Giá bán":25000, "Đơn vị tính":"Ly", "Link hình ảnh":"https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600", "Trạng thái":"Còn hàng", "Mô tả":"Vị trà thanh mát hòa quyện cùng đào giòn ngọt lịm và hương sả nồng nàn." },
  { ID:"PM003", "Tên sản phẩm":"Trà Sữa Ô Long Nướng", "Danh mục":"Trà Sữa", "Giá bán":32000, "Giá khuyến mãi":28000, "Đơn vị tính":"Ly", "Link hình ảnh":"https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600", "Trạng thái":"Còn hàng", "Mô tả":"Lá trà ô long được rang nướng đặc trưng mang lại hương khói thơm ngậy quyến rũ." },
  { ID:"PM004", "Tên sản phẩm":"Sữa Tươi Trân Châu Đường Đen", "Danh mục":"Sữa Tươi", "Giá bán":30000, "Đơn vị tính":"Ly", "Link hình ảnh":"https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600", "Trạng thái":"Còn hàng", "Mô tả":"Sữa tươi thanh trùng mát lạnh cùng trân châu đường đen nóng dẻo ngọt thanh." },
  { ID:"PM005", "Tên sản phẩm":"Trà Sữa Thái Xanh Thạch Phô Mai", "Danh mục":"Trà Sữa", "Giá bán":26000, "Đơn vị tính":"Ly", "Link hình ảnh":"https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600", "Trạng thái":"Còn hàng", "Mô tả":"Trà thái xanh chuẩn vị thơm bùi kèm topping thạch phô mai béo ngậy." },
  { ID:"PM006", "Tên sản phẩm":"Trà Trái Cây Nhiệt Đới", "Danh mục":"Trà Trái Cây", "Giá bán":28000, "Đơn vị tính":"Ly", "Link hình ảnh":"https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600", "Trạng thái":"Còn hàng", "Mô tả":"Sự kết hợp bùng nổ của chanh leo, cam vàng và dưa lưới giải nhiệt sảng khoái." },
  { ID:"PM007", "Tên sản phẩm":"Cà Phê Muối Đậm Đà", "Danh mục":"Cà Phê", "Giá bán":22000, "Đơn vị tính":"Ly", "Link hình ảnh":"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600", "Trạng thái":"Còn hàng", "Mô tả":"Cà phê pha phin truyền thống phủ lớp kem muối béo mặn hài hòa khó cưỡng." },
  { ID:"PM008", "Tên sản phẩm":"Combo Bạn Bè 4 Ly Trà Sữa", "Danh mục":"Combo", "Giá bán":110000, "Giá khuyến mãi":95000, "Đơn vị tính":"Phần", "Link hình ảnh":"https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600", "Trạng thái":"Còn hàng", "Mô tả":"Combo 4 ly trà sữa tự chọn topping thả ga, ưu đãi tiết kiệm cho nhóm bạn." },
];

export const demoPromos: Promo[] = [];

export const demoShopee: ShopeeItem[] = [
  { ID: "S1", "Tên sản phẩm": "Cốc Cà Phê & Trà Sữa Giữ Nhiệt Lock&Lock 500ml", "Hình ảnh": "https://img.lazcdn.com/g/ff/kf/Sb41e6ddf4a64483397133701873feae6P.jpg_720x720q80.jpg_.webp", "Link Affiliate": "https://shopee.vn/patmilk" },
  { ID: "S2", "Tên sản phẩm": "Bình Thủy Tinh Kèm Ống Hút Thủy Tinh Cao Cấp", "Hình ảnh": "https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mfnu83w3pvrg09.webp", "Link Affiliate": "https://shopee.vn/patmilk" }
];

export const demoReviews: Review[] = [
  { ID: "R1", "SĐT": "093***493", "Tên SP": "Trà Sữa Trân Châu Hoàng Kim", "Sao": 5, "Bình luận": "Trà thơm đậm vị, trân châu mềm dẻo không bị cứng, rất ngon!", "Thời gian": "10/05/2026" },
  { ID: "R2", "SĐT": "098***789", "Tên SP": "Trà Đào Cam Sả", "Sao": 5, "Bình luận": "Thanh mát, đào giòn ngọt vừa miệng. Giao hàng nhanh tầm 20 phút.", "Thời gian": "09/05/2026" },
];

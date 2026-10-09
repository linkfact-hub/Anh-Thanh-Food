export interface Product {
  ID: string;
  'Tên sản phẩm': string;
  'Danh mục': string;
  'Giá bán': number;
  'Giá khuyến mãi'?: number;
  'Đơn vị tính': string;
  'Link hình ảnh': string;
  'Trạng thái': string;
  'Mô tả'?: string;
}

export interface StoreInfo {
  'Tên cửa hàng': string;
  'Slogan': string;
  'Địa chỉ': string;
  'Số điện thoại': string;
  'Zalo': string;
  'Giờ mở cửa': string;
  'Logo URL': string;
  'Hero Banner URL': string;
  'Mô tả ngắn': string;
  'Tên ngân hàng': string;
  'Mã ngân hàng': string;
  'Số tài khoản': string;
  'Tên chủ TK': string;
  'Shopee Store': string;
  'Facebook': string;
  'Google Maps Embed URL': string;
  banners?: string[];
  Banner_Mode?: string;
  So_Sao?: number | string;
  Don_Hom_Nay?: number | string;
  Thoi_Gian_Giao?: number | string;
  'Mascot URL'?: string;
}

export interface Promo {
  ID: string;
  'Tiêu đề': string;
  'Loại': 'giamgia' | 'quatang' | 'flashsale' | 'khuyenmai';
  'Mô tả': string;
  'Hình ảnh'?: string;
  'Ngày bắt đầu'?: string;
  'Ngày kết thúc'?: string;
  'Nhãn nổi bật'?: string;
  'Màu nền'?: string;
  'Liên kết'?: string;
  'Trạng thái'?: string;
}

export interface ShopeeItem {
  ID: string;
  'Tên sản phẩm': string;
  'Hình ảnh': string;
  'Link Affiliate': string;
}

export interface Review {
  ID: string;
  'Mã đơn'?: string;
  'SĐT'?: string;
  'Tên SP': string;
  'Sao': number;
  'Bình luận': string;
  'Thời gian': string;
}

export interface Member {
  'Mã HV': string;
  'Họ tên': string;
  'SĐT': string;
  'Điểm tích lũy': number;
}

export interface CartItem extends Product {
  cartItemId: string; // to keep track of unique entries
  quantity: number;
}

export interface OrderPayload {
  action: 'datHang';
  maDon: string;
  hoTen: string;
  soDienThoai: string;
  hinhThuc: 'giaohang' | 'tulay';
  diaChiNhanHang?: string;
  ghiChu: string;
  phuongThucThanhToan: 'CODE' | 'CK';
  tongTien: number;
  cart: {
    SP_id: string;
    tenSanPham: string;
    danhMuc: string;
    donViTinh: string;
    soLuong: number;
    giaBan: number;
  }[];
}

export interface LastOrderItem {
  product: Product;
  quantity: number;
}

export interface LastOrder {
  orderCode: string;
  orderDate: string;
  totalPrice: number;
  items: LastOrderItem[];
}

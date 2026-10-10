import { APPS_SCRIPT_URL, DEMO_MODE } from './utils';
import {
  demoStoreInfo, demoProducts, demoPromos,
  demoShopee, demoReviews
} from '../data';

// Helper: POST đến Apps Script
// Apps Script yêu cầu redirect:follow và KHÔNG set Content-Type header
async function postToGAS(payload: object) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    redirect: 'follow',
    body: JSON.stringify(payload),
  });
  return res.json();
}

// ── CACHE DATA STORAGE ──────────────────────────────────────
const STORE_CACHE_KEY = 'pat_store_cache_v2';

export function getCachedStoreData(): {
  cuaHang?: typeof demoStoreInfo;
  sanPham?: typeof demoProducts;
  shopee?: typeof demoShopee;
  suKien?: typeof demoPromos;
} | null {
  try {
    const raw = localStorage.getItem(STORE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.sanPham) && parsed.sanPham.length > 0) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

// ── LOAD DỮ LIỆU BAN ĐẦU ────────────────────────────────────
export async function loadStoreData() {
  if (DEMO_MODE || !APPS_SCRIPT_URL) {
    return {
      cuaHang: demoStoreInfo,
      sanPham: demoProducts,
      shopee:  demoShopee,
      suKien:  demoPromos,
    };
  }
  try {
    // Giới hạn 10s — tránh treo vô thời hạn nếu GAS cold-start chậm bất thường
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(APPS_SCRIPT_URL + '?t=' + Date.now(), { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await res.json();
    if (data.success) {
      if (data.cuaHang) {
        const ch = data.cuaHang;
        // Thay link logo cũ từ template GitHub bằng Logo.png mới
        if (!ch['Logo URL'] || ch['Logo URL'].includes('linkfact-hub/pat-milk-v2') || ch['Logo URL'].includes('raw.githubusercontent.com')) {
          ch['Logo URL'] = `${import.meta.env.BASE_URL}Logo.png`;
        }
        // Thay banner nếu chưa có trên Sheet bằng Banner.png mới
        if (!ch['Hero Banner URL'] && (!Array.isArray(ch.banners) || ch.banners.length === 0)) {
          ch['Hero Banner URL'] = `${import.meta.env.BASE_URL}Banner.png`;
          ch.banners = [`${import.meta.env.BASE_URL}Banner.png`];
        }
        // Cố định chế độ poster mode để hiển thị trọn vẹn banner mới
        ch.Banner_Mode = 'poster';
        // Đồng bộ thương hiệu nếu Sheet chưa cập nhật
        if (ch['Tên cửa hàng'] === 'Pat-Milk V2.0') {
          ch['Tên cửa hàng'] = 'Tiệm Anh Thanh - PAT FOOD';
        }
        if (ch['Slogan'] === 'Thanh mát vị trà, đậm đà hương sữa') {
          ch['Slogan'] = 'Đồ ăn ngon • Đồ uống mát — Giao niềm vui mỗi ngày';
        }
        if (ch['Mascot URL']?.includes('Chibi-girl-in-sporty-style')) {
          ch['Mascot URL'] = `${import.meta.env.BASE_URL}Logo.png`;
        }
      }

      // Lưu lại cache mới nhất để các lần truy cập sau hiển thị tức thì (0ms)
      try {
        localStorage.setItem(STORE_CACHE_KEY, JSON.stringify({
          cuaHang: data.cuaHang,
          sanPham: data.sanPham,
          shopee:  data.shopee,
          suKien:  data.suKien,
          cachedAt: Date.now()
        }));
      } catch {
        // Bỏ qua nếu localStorage đầy
      }

      return data;
    }
    throw new Error(data.error);
  } catch {
    // Fallback: Ưu tiên cache đã lưu trước, nếu không có mới dùng demo
    const cached = getCachedStoreData();
    if (cached) return cached;
    return {
      cuaHang: demoStoreInfo,
      sanPham: demoProducts,
      shopee:  demoShopee,
      suKien:  demoPromos,
    };
  }
}

// ── ĐẶT HÀNG ────────────────────────────────────────────────
export async function datHang(payload: {
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
}) {
  if (DEMO_MODE || !APPS_SCRIPT_URL) {
    // Giả lập thành công ở demo mode
    await new Promise(r => setTimeout(r, 800));
    return { success: true, maDon: payload.maDon };
  }
  return postToGAS({ action: 'datHang', ...payload });
}

// ── ĐĂNG KÝ HỘI VIÊN ────────────────────────────────────────
export async function dangKyHoiVien(payload: {
  hoTen: string;
  soDienThoai: string;
  ngaySinh?: string;
  gioiTinh?: string;
  diaChi?: string;
}) {
  if (DEMO_MODE || !APPS_SCRIPT_URL) {
    await new Promise(r => setTimeout(r, 600));
    return {
      success: true,
      maHV: 'HV' + Date.now().toString().slice(-6),
      hoTen: payload.hoTen,
      diemTichLuy: 10,
    };
  }
  return postToGAS({ action: 'dangKyHoiVien', ...payload });
}

// ── GỬI ĐÁNH GIÁ ────────────────────────────────────────────
export async function guiDanhGia(payload: {
  maDon?: string;
  soDienThoai?: string;
  tenSanPham: string;
  soSao: number;
  binhLuan: string;
}) {
  if (DEMO_MODE || !APPS_SCRIPT_URL) {
    await new Promise(r => setTimeout(r, 400));
    return { success: true };
  }
  return postToGAS({ action: 'guiDanhGia', ...payload });
}

// ── CHAT AI ──────────────────────────────────────────────────
export async function chatAI(history: { role: 'user' | 'assistant'; content: string }[]) {
  if (DEMO_MODE || !APPS_SCRIPT_URL) {
    await new Promise(r => setTimeout(r, 800));
    const q = history[history.length - 1]?.content?.toLowerCase() || '';
    if (q.includes('giá') || q.includes('bao nhiêu'))
      return { success: true, reply: 'Trà sữa truyền thống từ 29.000đ/ly M, 35.000đ/ly L. Combo và các vị khác bạn xem trong menu nha!' };
    if (q.includes('ship') || q.includes('giao'))
      return { success: true, reply: 'Shop giao hàng tận nơi ạ, giao trong khoảng 30 phút tùy khu vực nha bạn!' };
    if (q.includes('hội viên') || q.includes('thành viên'))
      return { success: true, reply: 'Đăng ký hội viên hoàn toàn miễn phí, nhận ngay 10 điểm và nhiều ưu đãi. Bấm nút "Hội Viên" trên header nha bạn!' };
    return { success: true, reply: 'Xin chào! PAT Milk chuyên trà sữa thơm ngon, nguyên liệu tươi mỗi ngày. Bạn cần hỏi gì về menu, giao hàng hay ưu đãi không ạ?' };
  }
  return postToGAS({ action: 'chatAI', history });
}
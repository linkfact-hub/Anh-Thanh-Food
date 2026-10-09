import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGia(n: number | string): string {
  return Number(n).toLocaleString('vi-VN') + 'đ';
}

// ── Giá hiệu lực: ưu tiên Giá khuyến mãi nếu có và hợp lệ (>0, nhỏ hơn giá bán),
// ngược lại trả về Giá bán. Dùng chung cho ProductCard, ProductModal, giỏ hàng,
// checkout để đảm bảo mọi nơi tính tiền đều nhất quán.
export function getEffectivePrice(product: Pick<Product, 'Giá bán' | 'Giá khuyến mãi'>): number {
  const km = Number(product['Giá khuyến mãi']);
  const goc = Number(product['Giá bán']);
  if (km > 0 && km < goc) return km;
  return goc;
}

export function hasDiscount(product: Pick<Product, 'Giá bán' | 'Giá khuyến mãi'>): boolean {
  const km = Number(product['Giá khuyến mãi']);
  const goc = Number(product['Giá bán']);
  return km > 0 && km < goc;
}

export function validateSdtVN(val: string): boolean {
  return /^(0[35789])[0-9]{8}$/.test(val.replace(/\s/g, ''));
}

export function generateOrderCode(): string {
  return 'DH' + Date.now().toString().slice(-10);
}

// ── ĐẶT URL APPS SCRIPT VÀO ĐÂY ──
export const APPS_SCRIPT_URL = import.meta.env.VITE_GAS_URL ?? '';
export const DEMO_MODE = !import.meta.env.VITE_GAS_URL;
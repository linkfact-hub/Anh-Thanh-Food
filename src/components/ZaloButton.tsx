import { motion } from 'motion/react';
import { StoreInfo } from '../types';
import { useStore } from '../store';
import { MessageCircle } from 'lucide-react';

interface ZaloButtonProps {
  storeInfo: StoreInfo;
}

export default function ZaloButton({ storeInfo }: ZaloButtonProps) {
  const { cart, cartOpen } = useStore();
  const hasCart = cart.length > 0 && !cartOpen;

  // Lấy SĐT Zalo từ thông tin cửa hàng, fallback SĐT chính
  const rawPhone = storeInfo['Zalo'] || storeInfo['Số điện thoại'] || '0939944931';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const zaloUrl = `https://zalo.me/${cleanPhone}`;

  // Định dạng hiển thị số điện thoại (vd: 0939 944 931)
  const formattedPhone = cleanPhone.length === 10
    ? `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`
    : rawPhone;

  return (
    <aside aria-label="Kênh hỗ trợ Zalo" className={`fixed right-4 sm:right-6 z-40 transition-all duration-300 ${
      hasCart ? 'bottom-20 sm:bottom-22' : 'bottom-6'
    }`}>
      <motion.a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat Zalo ${formattedPhone}`}
        title={`Chat Zalo với ${storeInfo['Tên cửa hàng'] || 'cửa hàng'} (${formattedPhone})`}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="group relative flex items-center bg-[#0068FF] text-white rounded-full p-2.5 sm:p-3 shadow-[0_6px_24px_rgba(0,104,255,0.45)] hover:shadow-[0_8px_30px_rgba(0,104,255,0.6)] transition-all overflow-visible"
      >
        {/* Vòng xung điện tử lan tỏa (Pulse animation) */}
        <span
          className="absolute inset-0 rounded-full bg-[#0068FF] animate-ping opacity-35 pointer-events-none"
          aria-hidden="true"
        />

        {/* Icon Zalo chính hãng */}
        <div className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 48 48"
            className="w-full h-full drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Nền bóng chat Zalo */}
            <circle cx="24" cy="24" r="23" fill="white" />
            <path
              d="M24 7C14.61 7 7 13.72 7 22c0 4.63 2.39 8.76 6.13 11.53L11.5 39.5a1 1 0 0 0 1.25 1.23l6.27-2.09C20.65 38.86 22.3 39 24 39c9.39 0 17-6.72 17-15S33.39 7 24 7z"
              fill="#0068FF"
            />
            {/* Chữ Zalo trắng chuẩn nhận diện */}
            <text
              x="24"
              y="27.5"
              textAnchor="middle"
              fill="white"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="900"
              fontSize="12.5"
              letterSpacing="-0.5px"
            >
              Zalo
            </text>
          </svg>
        </div>

        {/* Nhãn mở rộng khi hover trên Desktop */}
        <div className="hidden sm:flex max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out overflow-hidden items-center whitespace-nowrap pl-0 group-hover:pl-2.5 group-hover:pr-2">
          <div className="text-left">
            <p className="text-[11px] font-medium leading-none text-white/90">Hỗ trợ đặt món</p>
            <p className="text-xs font-bold text-white leading-tight mt-0.5">{formattedPhone}</p>
          </div>
        </div>

        {/* Huy hiệu chấm xanh Online */}
        <span
          className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full z-20 shadow-sm animate-pulse"
          title="Đang hoạt động"
          aria-hidden="true"
        />
      </motion.a>
    </aside>
  );
}

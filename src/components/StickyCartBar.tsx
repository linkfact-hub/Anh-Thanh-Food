import { useStore } from '../store';
import { formatGia, getEffectivePrice } from '../lib/utils';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StickyCartBarProps {
  onCheckout: () => void;
}

export default function StickyCartBar({ onCheckout }: StickyCartBarProps) {
  const { cart, cartOpen, setCartOpen } = useStore();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + getEffectivePrice(item) * item.quantity,
    0
  );

  // Ẩn khi: giỏ trống, hoặc cart drawer đang mở
  if (cart.length === 0 || cartOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-0 pointer-events-none"
      >
        <div
          className="max-w-lg mx-auto pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[0_-4px_24px_rgba(249,115,22,0.25)]"
          style={{
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {/* Bên trái: icon + số món */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-white text-brand-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            </div>
            <span className="text-sm font-semibold">{totalItems} món</span>
          </button>

          {/* Giữa: tổng tiền */}
          <div className="flex-1 text-center">
            <span className="text-white font-display text-lg font-bold tracking-wide">
              {formatGia(totalPrice)}
            </span>
          </div>

          {/* Bên phải: nút đặt ngay */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onCheckout}
            className="bg-white text-brand-600 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-shadow whitespace-nowrap"
          >
            Đặt ngay →
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

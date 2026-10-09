import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { LastOrder } from '../types';
import { formatGia } from '../lib/utils';
import { RotateCcw, X, ShoppingBag, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function formatOrderTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Gần đây';

    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();

    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    if (isToday) return `Hôm nay, ${hours}:${minutes}`;
    if (isYesterday) return `Hôm qua, ${hours}:${minutes}`;

    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}, ${hours}:${minutes}`;
  } catch {
    return 'Gần đây';
  }
}

export default function ReorderBanner() {
  const { reorderItems, addToast, setCartOpen } = useStore();
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  const loadLastOrder = () => {
    try {
      const raw = localStorage.getItem('pat_last_order') || localStorage.getItem('last_order');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          setLastOrder(parsed);
          return;
        }
      }
    } catch {
      // Ignore JSON error
    }
    setLastOrder(null);
  };

  useEffect(() => {
    loadLastOrder();

    const handleUpdate = () => {
      loadLastOrder();
      setIsDismissed(false); // Reset dismissed state if a new order was placed
    };

    window.addEventListener('pat_last_order_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('pat_last_order_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (!lastOrder || isDismissed) return null;

  const handleReorder = () => {
    if (!lastOrder.items || lastOrder.items.length === 0) return;
    reorderItems(lastOrder.items);
    addToast(`Đã thêm ${lastOrder.items.length} món từ đơn trước vào giỏ!`, 'success');
    setCartOpen(true);
  };

  const totalQuantity = lastOrder.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const itemNamesSummary = lastOrder.items
    .map((i) => `${i.quantity}x ${i.product['Tên sản phẩm']}`)
    .join(' · ');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2"
      >
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-brand-200/90 shadow-[0_8px_28px_rgba(249,115,22,0.14)] p-4 sm:p-5 transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 248, 240, 0.98) 0%, rgba(255, 255, 255, 0.98) 50%, rgba(254, 243, 199, 0.95) 100%)',
          }}
        >
          {/* Decorative glowing blobs */}
          <div
            className="absolute -right-12 -top-12 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08), transparent 70%)' }}
          />
          <div
            className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.08), transparent 70%)' }}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Ẩn gợi ý đặt lại đơn"
            className="absolute top-3 right-3 p-1.5 rounded-full text-text-soft hover:text-text-dark hover:bg-black/5 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pr-6 sm:pr-8">
            {/* Left section: Badges + Title + Items summary */}
            <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
              {/* Icon badge */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200/80 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-brand-500" />
                    Đặt nhanh 1 chạm
                  </span>
                  <span className="text-xs text-text-soft font-medium">
                    {formatOrderTime(lastOrder.orderDate)}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg text-text-dark leading-snug">
                  Đặt lại đơn trước ({totalQuantity} món)?
                </h3>

                {/* Overlapping Thumbnails + item summary */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-2 shrink-0">
                    {lastOrder.items.slice(0, 3).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.product['Link hình ảnh']}
                        alt={item.product['Tên sản phẩm']}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ))}
                    {lastOrder.items.length > 3 && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-lavender-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-brand-600">
                        +{lastOrder.items.length - 3}
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-text-mid truncate max-w-sm sm:max-w-md md:max-w-lg">
                    {itemNamesSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Right section: Price & Action CTA */}
            <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-brand-100/80">
              <div className="text-left md:text-right">
                <p className="text-[11px] text-text-soft uppercase tracking-wider">Tổng đơn cũ</p>
                <p className="font-display font-bold text-base sm:text-lg text-pink-600">
                  {formatGia(lastOrder.totalPrice)}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleReorder}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg shadow-brand-500/25 transition-all whitespace-nowrap cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Đặt lại ngay</span>
                <ChevronRight className="w-4 h-4 hidden sm:inline" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

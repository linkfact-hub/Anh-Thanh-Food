import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { formatGia, getEffectivePrice, hasDiscount } from '../lib/utils';
import { LastOrder } from '../types';
import { X, Minus, Plus, Trash2, ShoppingBag, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, clearCart, reorderItems, addToast } = useStore();
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);
  const total = cart.reduce((sum, item) => sum + getEffectivePrice(item) * item.quantity, 0);

  useEffect(() => {
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
      // Ignore parse error
    }
    setLastOrder(null);
  }, [cartOpen]);

  const handleReorder = () => {
    if (!lastOrder || !lastOrder.items) return;
    reorderItems(lastOrder.items);
    addToast(`Đã thêm ${lastOrder.items.length} món từ đơn trước vào giỏ!`, 'success');
  };

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 bg-text-dark/30 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md h-full bg-bg-base border-l border-brand-100 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-brand-100 bg-white">
          <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-brand-50 rounded-full text-text-mid transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-brand-600">
            <ShoppingBag className="w-5 h-5" />
            <h3 className="font-display text-xl">Giỏ Hàng</h3>
          </div>
          {cart.length > 0 ? (
            <button onClick={clearCart} className="text-sm font-semibold text-red-400 hover:text-red-500 transition-colors">Xóa hết</button>
          ) : <div className="w-12" />}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-2"
              >
                <div className="w-24 h-24 mb-4 bg-lavender-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-brand-300" />
                </div>
                <p className="font-display text-xl text-brand-500 mb-1">Giỏ hàng trống</p>
                <p className="text-sm text-text-soft mb-5">Hãy chọn vài ly nước thơm ngon nhé!</p>

                {lastOrder && (
                  <div className="w-full bg-white rounded-2xl border border-brand-200/90 p-4 shadow-sm mb-5 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 mb-1.5">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Đơn đặt gần nhất ({lastOrder.items.length} món)</span>
                    </div>
                    <p className="text-xs text-text-mid line-clamp-2 mb-3">
                      {lastOrder.items.map((i) => `${i.quantity}x ${i.product['Tên sản phẩm']}`).join(', ')}
                    </p>
                    <button
                      type="button"
                      onClick={handleReorder}
                      className="w-full py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Đặt lại đơn này ({formatGia(lastOrder.totalPrice)})
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setCartOpen(false)}
                  className="px-6 py-2 rounded-full border border-brand-400 text-brand-500 font-semibold hover:bg-brand-50 transition-colors text-sm"
                >
                  Xem thực đơn
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    key={item.cartItemId}
                    className="flex gap-4 p-3 rounded-2xl bg-white border border-brand-100 shadow-sm"
                  >
                    <img src={item['Link hình ảnh']} alt={item['Tên sản phẩm']} className="w-20 h-20 rounded-xl object-cover border border-brand-50" />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold text-text-dark text-sm leading-tight">{item['Tên sản phẩm']}</h4>
                        <button onClick={() => removeFromCart(item.cartItemId)} className="text-text-soft hover:text-red-400 transition-colors p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-text-soft mt-0.5">ĐVT: {item['Đơn vị tính']}</p>

                      <div className="flex justify-between items-end mt-auto pt-2">
                        {hasDiscount(item) ? (
                          <div className="flex items-baseline gap-1.5">
                            <p className="font-display text-pink-600">{formatGia(getEffectivePrice(item))}</p>
                            <p className="text-xs text-text-soft line-through">{formatGia(item['Giá bán'])}</p>
                          </div>
                        ) : (
                          <p className="font-display text-brand-600">{formatGia(item['Giá bán'])}</p>
                        )}
                        <div className="flex items-center gap-2 bg-lavender-50 rounded-xl p-1 border border-brand-100">
                          <button onClick={() => updateQuantity(item.cartItemId, -1)} className="text-text-mid hover:text-brand-600 p-1">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-text-dark">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, 1)} className="text-text-mid hover:text-brand-600 p-1">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-brand-100 bg-white">
            <div className="flex justify-between mb-4">
              <span className="text-text-mid font-medium">Tổng cộng</span>
              <span className="font-display text-xl text-brand-600">{formatGia(total)}</span>
            </div>
            <button
              onClick={() => { setCartOpen(false); onCheckout(); }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 font-bold text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              Đặt hàng <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

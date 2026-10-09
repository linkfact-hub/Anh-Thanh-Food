import { Product } from '../types';
import { formatGia, cn, getEffectivePrice, hasDiscount } from '../lib/utils';
import { Plus, Minus, Star } from 'lucide-react';
import { useStore } from '../store';
import { motion } from 'motion/react';
import type { MouseEvent } from 'react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  avgRating?: number;
}

export default function ProductCard({ product, onClick, avgRating = 4.5 }: ProductCardProps) {
  const { cart, addToCart, updateQuantity, removeFromCart, addToast } = useStore();
  const isOutOfStock = product['Trạng thái'] !== 'Còn hàng';

  const cartItem = cart.find((i) => i.ID === product.ID);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({ ...product, cartItemId: Date.now().toString(), quantity: 1 });
    addToast(`Đã thêm ${product['Tên sản phẩm']} vào giỏ`, 'success');
  };

  const handleIncrease = (e: MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock || !cartItem) return;
    updateQuantity(cartItem.cartItemId, 1);
  };

  const handleDecrease = (e: MouseEvent) => {
    e.stopPropagation();
    if (!cartItem) return;
    if (cartItem.quantity <= 1) {
      removeFromCart(cartItem.cartItemId);
      addToast(`Đã bớt ${product['Tên sản phẩm']} khỏi giỏ`, 'info');
    } else {
      updateQuantity(cartItem.cartItemId, -1);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      whileHover={!isOutOfStock ? { y: -5, boxShadow: '0 12px 40px rgba(249,115,22,0.15)' } : {}}
      onClick={() => onClick(product)}
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all h-full",
        quantityInCart > 0
          ? "border-brand-300 ring-2 ring-brand-400/20 shadow-[0_6px_20px_rgba(249,115,22,0.12)]"
          : "border-brand-100 shadow-[0_2px_12px_rgba(249,115,22,0.06)]",
        isOutOfStock && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Image */}
      <div className="relative aspect-square w-full bg-lavender-50 overflow-hidden">
        <img
          src={product['Link hình ảnh']}
          alt={product['Tên sản phẩm']}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-red-400/90 text-white font-bold px-3 py-1 rounded-full text-sm shadow">Hết hàng</span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-2 left-2 bg-white/90 text-brand-600 text-xs font-bold px-2 py-1 rounded-full border border-brand-100 shadow-sm">
          {product['Danh mục']}
        </div>
        {/* Badge khuyến mãi */}
        {hasDiscount(product) && (
          <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            -{Math.round((1 - getEffectivePrice(product) / product['Giá bán']) * 100)}%
          </div>
        )}
        {/* Badge đã chọn */}
        {quantityInCart > 0 && (
          <div className="absolute bottom-2 right-2 bg-brand-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
            <span>Đã chọn: {quantityInCart}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h4 className="font-display text-[1rem] sm:text-[1.05rem] text-text-dark leading-tight mb-1 group-hover:text-brand-600 transition-colors line-clamp-2">
            {product['Tên sản phẩm']}
          </h4>
          <div className="flex items-center gap-1 text-xs text-text-soft mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-amber-600">{avgRating.toFixed(1)}</span>
            <span>· 120+ đánh giá</span>
          </div>
          <p className="text-xs text-text-soft">ĐVT: {product['Đơn vị tính']}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-1 gap-2">
          {hasDiscount(product) ? (
            <div className="flex flex-col min-w-0">
              <p className="text-[11px] sm:text-xs text-text-soft line-through leading-none">
                {formatGia(product['Giá bán'])}
              </p>
              <p className="font-display text-base sm:text-[1.1rem] text-pink-600 leading-tight">
                {formatGia(getEffectivePrice(product))}
              </p>
            </div>
          ) : (
            <p className="font-display text-base sm:text-[1.1rem] text-brand-600 leading-tight min-w-0">
              {formatGia(product['Giá bán'])}
            </p>
          )}

          {/* Quick Counter / Quick Add Button */}
          {quantityInCart > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-lavender-50 border border-brand-200/90 rounded-full p-0.5 shadow-sm shrink-0"
            >
              <button
                type="button"
                onClick={handleDecrease}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-brand-600 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-colors shadow-xs active:scale-90"
                aria-label="Giảm 1"
              >
                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <span className="w-6 sm:w-7 text-center text-xs sm:text-sm font-bold font-mono text-brand-700 select-none">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                disabled={isOutOfStock}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-brand-400 to-pink-500 text-white hover:opacity-95 flex items-center justify-center transition-transform shadow-xs active:scale-90 disabled:opacity-50"
                aria-label="Tăng 1"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-brand-400 to-pink-500 text-white flex items-center justify-center shadow-md hover:shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all active:scale-90 disabled:opacity-50 disabled:shadow-none shrink-0"
              title="Thêm vào giỏ"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-300 via-pink-400 to-brand-300 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

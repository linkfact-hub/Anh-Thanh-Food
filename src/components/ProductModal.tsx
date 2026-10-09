import { useState } from 'react';
import { Product, Review } from '../types';
import { formatGia, cn, getEffectivePrice, hasDiscount } from '../lib/utils';
import { X, Plus, Minus, Star, MessagesSquare } from 'lucide-react';
import { useStore } from '../store';
import { demoReviews } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart, addToast } = useStore();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({ ...product, cartItemId: Date.now().toString(), quantity: qty });
    addToast(`Đã thêm ${qty} ${product['Đơn vị tính']} x ${product['Tên sản phẩm']}`, 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-white/80 backdrop-blur-sm"
        />
        
        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-white border border-brand-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-brand-500 hover:text-white p-2 rounded-full text-text-dark transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 overflow-y-auto">
            <div className="aspect-video w-full bg-bg-base relative">
              <img src={product['Link hình ảnh']} alt={product['Tên sản phẩm']} className="w-full h-full object-cover opacity-90" />
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-dark">{product['Tên sản phẩm']}</h3>
                {hasDiscount(product) ? (
                  <div className="text-right whitespace-nowrap">
                    <p className="text-sm text-text-soft line-through leading-none">{formatGia(product['Giá bán'])}</p>
                    <p className="text-xl sm:text-2xl font-bold text-pink-600 font-mono">{formatGia(getEffectivePrice(product))}</p>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-brand-600 font-mono whitespace-nowrap">{formatGia(product['Giá bán'])}</p>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-text-soft mb-6 pb-6 border-b border-brand-100">
                <span className="px-2 py-1 bg-brand-50 text-brand-600 rounded font-medium border border-brand-100">{product['Danh mục']}</span>
                <span>Phân loại: {product['Đơn vị tính']}</span>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setActiveTab('info')}
                  className={cn("text-lg font-display font-bold pb-1 border-b-2 transition-colors", activeTab === 'info' ? "border-brand-400 text-brand-600" : "border-transparent text-text-soft hover:text-text-mid")}
                >
                  Thông tin
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={cn("text-lg font-display font-bold pb-1 border-b-2 transition-colors flex items-center gap-2", activeTab === 'reviews' ? "border-brand-400 text-brand-600" : "border-transparent text-text-soft hover:text-text-mid")}
                >
                  <MessagesSquare className="w-4 h-4" /> Đánh giá
                </button>
              </div>

              {activeTab === 'info' && (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-text-soft leading-relaxed min-h-[100px]">
                    {product['Mô tả'] || 'Hương vị trà sữa thơm ngon, đậm đà béo ngậy chuẩn vị, nguyên liệu tươi mới mỗi ngày. Món ngon không thể bỏ lỡ tại PAT Milk.'}
                  </p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="animate-in fade-in zoom-in-95 duration-200 space-y-4">
                  <div className="flex items-center gap-4 p-4 border border-brand-100 rounded-xl bg-brand-50">
                     <div className="text-4xl font-display font-bold text-brand-600">4.5</div>
                     <div>
                       <div className="flex gap-1 mb-1">
                         {[1,2,3,4,5].map(i => <Star key={i} className={cn("w-4 h-4", i <= 4 ? "fill-amber-400 text-amber-400" : i === 5 ? "fill-amber-300 text-amber-300" : "text-amber-200")} />)}
                       </div>
                       <span className="text-xs text-text-soft">Dựa trên {demoReviews.length} đánh giá</span>
                     </div>
                  </div>
                  
                  <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {demoReviews.map(r => (
                      <div key={r.ID} className="p-3 border-b border-brand-100">
                        <div className="flex items-center justify-between mb-2">
                           <span className="font-bold text-sm text-text-dark">{r['SĐT']}</span>
                           <span className="text-xs text-text-soft">{r['Thời gian']}</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {Array.from({length: 5}).map((_, i) => <Star key={i} className={cn("w-3 h-3", i < r['Sao'] ? "fill-amber-400 text-amber-400" : "text-amber-200")} />)}
                        </div>
                        <p className="text-sm text-text-soft">{r['Bình luận']}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
          
          <div className="border-t border-brand-100 p-4 sm:p-6 bg-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-bg-base rounded-full p-1 border border-brand-100">
              <button 
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="p-2 hover:bg-brand-50 rounded-full text-brand-600 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-8 text-center font-bold text-lg text-text-dark">{qty}</span>
              <button 
                onClick={() => setQty(q => q + 1)}
                className="p-2 hover:bg-brand-50 rounded-full text-brand-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-brand-500/25 transition-transform active:scale-95 text-center"
            >
              Thêm • {formatGia(getEffectivePrice(product) * qty)}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

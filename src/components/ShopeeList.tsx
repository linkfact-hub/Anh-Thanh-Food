import { ShopeeItem, StoreInfo } from '../types';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

export default function ShopeeList({ items, storeInfo }: { items: ShopeeItem[], storeInfo: StoreInfo }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-12 bg-white border-y border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <h3 className="text-3xl sm:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EE4D2D] to-[#ff9800]">
            Sản phẩm nổi bật trên Shopee
          </h3>
          <a 
            href={storeInfo['Shopee Store']} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-md text-sm font-bold bg-[#EE4D2D] text-white shadow-[0_0_15px_rgba(238,77,45,0.4)] hover:bg-[#EE4D2D]/90 hover:shadow-[0_0_20px_rgba(238,77,45,0.6)] transition-all cursor-pointer"
          >
            Shopee Mall
          </a>
        </div>
        
        <div className="flex overflow-x-auto pb-6 gap-4 snap-x hide-scrollbar">
          {items.map((item, i) => (
            <motion.div 
              key={item.ID}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[200px] w-[200px] bg-bg-base rounded-xl border border-brand-100 overflow-hidden snap-start hover:border-[#EE4D2D]/50 transition-colors group flex flex-col"
            >
              <div className="aspect-square w-full bg-white flex items-center justify-center p-2 relative">
                <img src={item['Hình ảnh']} alt={item['Tên sản phẩm']} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h4 className="text-sm font-medium text-text-dark line-clamp-2 mb-3 flex-1">
                  {item['Tên sản phẩm']}
                </h4>
                <a 
                  href={item['Link Affiliate']} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full bg-[#EE4D2D]/10 text-[#EE4D2D] hover:bg-[#EE4D2D] hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Mua ngay
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

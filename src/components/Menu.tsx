import { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface MenuProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  searchQuery: string;
  isLoading?: boolean;
}

function MenuSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-3 sm:p-4 border border-brand-100/60 shadow-sm flex flex-col">
          <div className="w-full aspect-square bg-slate-100 rounded-xl mb-3" />
          <div className="h-4 bg-slate-100 rounded-md w-3/4 mb-2" />
          <div className="h-3 bg-slate-100 rounded-md w-1/2 mb-4" />
          <div className="mt-auto flex justify-between items-center pt-2">
            <div className="h-5 bg-slate-100 rounded-md w-1/3" />
            <div className="w-8 h-8 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function getProductRating(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  return Number((4.6 + (Math.abs(hash) % 4) * 0.1).toFixed(1));
}

export default function Menu({ products, onOpenProduct, searchQuery, isLoading }: MenuProps) {
  const [activeTab, setActiveTab] = useState('Tất cả');

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p['Danh mục']));
    return ['Tất cả', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p['Tên sản phẩm'].toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeTab === 'Tất cả' || p['Danh mục'] === activeTab;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, activeTab]);

  return (
    <section id="menu-section" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Section heading */}
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-display text-gradient mb-3">Thực Đơn Hôm Nay</h2>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-brand-400" />
          <div className="w-8 h-2 rounded-full bg-gradient-to-r from-brand-400 to-brand-600" />
          <div className="w-2 h-2 rounded-full bg-brand-600" />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex overflow-x-auto pb-3 mb-8 gap-2 hide-scrollbar sticky top-16 z-30 bg-bg-base/85 backdrop-blur-md pt-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === cat
                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.25)]'
                : 'bg-white text-text-mid hover:bg-lavender-50 hover:text-brand-600 border border-brand-100 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading && products.length === 0 ? (
        <MenuSkeleton />
      ) : filteredProducts.length === 0 ? (
        <div className="py-24 text-center text-text-soft">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="font-display text-xl text-brand-400">Không tìm thấy món nào!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.ID}
              product={product}
              onClick={onOpenProduct}
              avgRating={getProductRating(product.ID)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

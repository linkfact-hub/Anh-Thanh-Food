import { ShoppingCart, Search, User } from 'lucide-react';
import { StoreInfo } from '../types';
import { useStore } from '../store';
import { useState, type ChangeEvent } from 'react';

export default function Header({ storeInfo, onOpenMember }: { storeInfo: StoreInfo; onOpenMember: () => void }) {
  const { cart, setCartOpen, member, setSearchQuery } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-brand-200/60 shadow-[0_2px_20px_rgba(249,115,22,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo & Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src={
              storeInfo['Logo URL'] && !storeInfo['Logo URL'].includes('raw.githubusercontent.com') && !storeInfo['Logo URL'].includes('linkfact-hub/pat-milk-v2')
                ? storeInfo['Logo URL']
                : `${import.meta.env.BASE_URL}Logo.png`
            }
            alt={storeInfo['Tên cửa hàng']}
            className="w-10 h-10 object-contain rounded-full drop-shadow-[0_0_8px_rgba(249,115,22,0.3)] transition-transform hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}Logo.png`;
            }}
          />
          <div className="hidden sm:block">
            <h1 className="font-display text-xl text-brand-600 leading-tight tracking-wide">
              {storeInfo['Tên cửa hàng']}
            </h1>
            <p className="text-xs text-text-soft truncate max-w-[200px]">
              {storeInfo['Slogan']}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-brand-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm món ngon..."
            value={searchValue}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 bg-lavender-50 border border-brand-200 rounded-full text-sm text-text-dark placeholder-text-soft focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenMember}
            className="flex items-center gap-2 hover:bg-brand-50 p-2 rounded-xl transition-colors border border-transparent hover:border-brand-200"
          >
            <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-1.5 rounded-full text-white">
              <User className="h-4 w-4" />
            </div>
            {member ? (
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-brand-600">{member['Điểm tích lũy']} điểm</p>
                <p className="text-[10px] text-text-soft uppercase">{member['Họ tên']}</p>
              </div>
            ) : (
              <span className="hidden md:block text-sm text-brand-600 font-semibold">Hội viên</span>
            )}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 text-brand-600 hover:text-brand-700 transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-in zoom-in shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}

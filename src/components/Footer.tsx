import { StoreInfo } from '../types';

export default function Footer({ storeInfo }: { storeInfo: StoreInfo }) {
  return (
    <footer className="border-t border-brand-100 bg-white pt-12 text-text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={
                storeInfo['Logo URL'] && !storeInfo['Logo URL'].includes('raw.githubusercontent.com') && !storeInfo['Logo URL'].includes('linkfact-hub/pat-milk-v2')
                  ? storeInfo['Logo URL']
                  : `${import.meta.env.BASE_URL}Logo.png`
              }
              alt={storeInfo['Tên cửa hàng']}
              className="w-9 h-9 object-contain rounded-full shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}Logo.png`;
              }}
            />
            <h3 className="font-display text-2xl text-brand-600">{storeInfo['Tên cửa hàng']}</h3>
          </div>
          <p className="text-sm text-text-soft max-w-sm">{storeInfo['Slogan']}</p>
        </div>

        <div className="flex gap-6 text-sm font-semibold text-text-mid">
          <a href="#" className="hover:text-brand-500 transition-colors">Trang chủ</a>
          <a href="#menu-section" className="hover:text-brand-500 transition-colors">Thực đơn</a>
          {storeInfo['Shopee Store'] && (
            <a href={storeInfo['Shopee Store']} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">Shopee</a>
          )}
        </div>
      </div>

      {/* Bottom bar with gradient */}
      <div className="border-t border-brand-50 py-5 text-center">
        <div className="h-0.5 w-32 mx-auto mb-4 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-300 rounded-full opacity-60" />
        <p className="text-xs text-text-soft">
          &copy; {new Date().getFullYear()} {storeInfo['Tên cửa hàng']}. Made with 🧡 in Vietnam.
        </p>
      </div>
    </footer>
  );
}

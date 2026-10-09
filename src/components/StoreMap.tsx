import { StoreInfo } from '../types';
import { MapPin, Phone, Clock, Facebook } from 'lucide-react';

export default function StoreMap({ storeInfo }: { storeInfo: StoreInfo }) {

  // Ưu tiên dùng embed URL nếu có, fallback tự động generate từ địa chỉ
  const getMapSrc = () => {
    if (storeInfo['Google Maps Embed URL']) {
      return storeInfo['Google Maps Embed URL'];
    }
    // Tự động tạo embed URL từ địa chỉ — không cần API key
    const encoded = encodeURIComponent(storeInfo['Địa chỉ'] || '');
    return `https://maps.google.com/maps?q=${encoded}&output=embed&z=16`;
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Info Column */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-display font-bold text-gradient mb-6">Liên Hệ Đặt Món</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 bg-white border border-brand-100 p-2.5 rounded-xl text-brand-600 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-text-dark mb-1">Địa chỉ</h4>
                <p className="text-text-soft">{storeInfo['Địa chỉ']}</p>
                {/* Nút mở Google Maps app */}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(storeInfo['Địa chỉ'] || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1 text-xs text-brand-600 hover:text-brand-500 transition-colors"
                >
                  <MapPin className="w-3 h-3" /> Mở Google Maps
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 bg-white border border-brand-100 p-2.5 rounded-xl text-brand-600 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-text-dark mb-1">Điện thoại / Zalo</h4>
                <p className="text-text-soft">
                  <a href={`tel:${storeInfo['Số điện thoại']}`} target="_top" className="hover:text-brand-500 transition-colors">
                    {storeInfo['Số điện thoại']}
                  </a>
                  {' '}—{' '}
                  <a
                    href={`https://zalo.me/${storeInfo['Zalo']?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-500 transition-colors"
                  >
                    Chat Zalo
                  </a>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 bg-white border border-brand-100 p-2.5 rounded-xl text-brand-600 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-text-dark mb-1">Giờ mở cửa</h4>
                <p className="text-text-soft">{storeInfo['Giờ mở cửa']}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-4">
            {storeInfo.Facebook && (
              <a href={storeInfo.Facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#1877F2]/10 text-[#1877F2] rounded-xl hover:bg-[#1877F2] hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
            )}
            {storeInfo['Zalo'] && (
              <a
                href={`https://zalo.me/${storeInfo['Zalo']?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-[#0068FF]/10 text-[#0068FF] font-bold rounded-xl hover:bg-[#0068FF] hover:text-white transition-colors flex items-center justify-center"
              >
                Zalo
              </a>
            )}
          </div>
        </div>

        {/* Map Column – tự động từ địa chỉ, không cần embed URL */}
        <div className="relative aspect-square sm:aspect-video lg:aspect-square bg-white rounded-2xl overflow-hidden border border-brand-100 p-1 shadow-lg">
          <iframe
            key={storeInfo['Địa chỉ']}   // re-render khi địa chỉ thay đổi
            src={getMapSrc()}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '0.75rem' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

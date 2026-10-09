import { useState, useEffect, useCallback } from 'react';
import { Promo } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, CalendarDays, Tag, ExternalLink } from 'lucide-react';

// ── Format ngày dd/mm/yyyy ─────────────────────────────────────
function fmtDate(d?: string): string {
  if (!d) return '';
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
  } catch { return d; }
}

// ── Fallback poster khi không có ảnh ──────────────────────────
const FALLBACK_ICONS: Record<string, string> = {
  khuyen_mai: '🎉',
  combo:      '🧋',
  flashsale:  '⚡',
  quatang:    '🎁',
  giamgia:    '🏷️',
};

function FallbackPoster({ promo }: { promo: Promo }) {
  const icon = FALLBACK_ICONS[promo['Loại']] ?? '🎊';
  const bg   = promo['Màu nền'] || '#ea580c';
  // Nếu Màu nền là Tailwind class, dùng gradient mặc định
  const isHex = bg.startsWith('#');

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3 select-none"
      style={isHex ? { background: `linear-gradient(135deg, ${bg}dd, ${bg}88)` } : undefined}
    >
      {/* gradient dự phòng nếu là tailwind class */}
      {!isHex && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-600" />
      )}
      <span className="text-6xl relative z-10 drop-shadow-lg">{icon}</span>
      <span className="relative z-10 text-white font-display font-bold text-lg text-center px-6 drop-shadow leading-tight">
        {promo['Tiêu đề']}
      </span>
      {promo['Nhãn nổi bật'] && (
        <span className="relative z-10 bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
          {promo['Nhãn nổi bật']}
        </span>
      )}
    </div>
  );
}

// ── Popup chi tiết sự kiện ─────────────────────────────────────
function PromoPopup({ promo, onClose }: { promo: Promo; onClose: () => void }) {
  // Đóng khi bấm Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Sheet / Card */}
        <motion.div
          className="relative z-10 w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Poster mini ở top popup */}
          <div className="relative w-full aspect-video overflow-hidden bg-brand-100">
            {promo['Hình ảnh'] ? (
              <img src={promo['Hình ảnh']} alt={promo['Tiêu đề']} className="w-full h-full object-cover" />
            ) : (
              <FallbackPoster promo={promo} />
            )}
            {/* Nút đóng */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 backdrop-blur transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nội dung */}
          <div className="p-5">
            {/* Label loại */}
            {promo['Nhãn nổi bật'] && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full mb-2">
                <Tag className="w-3 h-3" />
                {promo['Nhãn nổi bật']}
              </span>
            )}

            <h3 className="font-display font-bold text-xl text-text-dark mb-2 leading-tight">
              {promo['Tiêu đề']}
            </h3>

            <p className="text-sm text-text-soft leading-relaxed mb-4">
              {promo['Mô tả']}
            </p>

            {/* Thời gian */}
            {(promo['Ngày bắt đầu'] || promo['Ngày kết thúc']) && (
              <div className="flex flex-wrap gap-3 text-xs text-brand-500 font-medium mb-4">
                {promo['Ngày bắt đầu'] && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Từ {fmtDate(promo['Ngày bắt đầu'])}
                  </span>
                )}
                {promo['Ngày kết thúc'] && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Đến {fmtDate(promo['Ngày kết thúc'])}
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            {promo['Liên kết'] ? (
              <a
                href={promo['Liên kết']}
                className="block w-full text-center bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition text-sm"
              >
                Xem ưu đãi ngay
                <ExternalLink className="inline w-3.5 h-3.5 ml-1.5 -mt-0.5" />
              </a>
            ) : (
              <button
                onClick={onClose}
                className="block w-full text-center bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition text-sm"
              >
                Đặt món ngay 🧋
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Component chính ────────────────────────────────────────────
export default function Promos({ promos, isLoading }: { promos: Promo[]; isLoading?: boolean }) {
  const [current, setCurrent]       = useState(0);
  const [selected, setSelected]     = useState<Promo | null>(null);
  const [isPaused, setIsPaused]     = useState(false);

  const active = promos.filter(p => {
    if (!p || !p['Trạng thái']) return false;
    const status = p['Trạng thái'].trim().toLowerCase();
    const isActive = (
      status === 'đang diễn ra' ||
      status === 'active' ||
      status === 'hoạt động' ||
      status === 'áp dụng' ||
      status === 'dang dien ra'
    );
    if (!isActive) return false;

    // Kiểm tra thời hạn nếu có ngày kết thúc
    if (p['Ngày kết thúc']) {
      try {
        const endDate = new Date(p['Ngày kết thúc']);
        endDate.setHours(23, 59, 59, 999);
        if (!isNaN(endDate.getTime()) && endDate.getTime() < Date.now()) {
          return false;
        }
      } catch {
        // Bỏ qua lỗi parse
      }
    }

    // Kiểm tra ngày bắt đầu nếu có
    if (p['Ngày bắt đầu']) {
      try {
        const startDate = new Date(p['Ngày bắt đầu']);
        if (!isNaN(startDate.getTime()) && startDate.getTime() > Date.now()) {
          return false;
        }
      } catch {
        // Bỏ qua lỗi parse
      }
    }

    return true;
  });

  // Auto-advance mỗi 4s, dừng khi popup mở hoặc hover
  const next = useCallback(() => {
    setCurrent(c => (c + 1) % active.length);
  }, [active.length]);

  useEffect(() => {
    if (active.length < 2 || isPaused || selected) return;
    const tm = setInterval(next, 4000);
    return () => clearInterval(tm);
  }, [active.length, isPaused, selected, next]);

  // Ẩn hẳn section trong lúc chờ data thật từ Sheet — tránh hiện poster demo rồi đổi sang thật
  if (isLoading || !active.length) return null;

  // Bảo vệ: nếu data đổi (vd: sự kiện hết hạn bị filter ra) khiến current vượt
  // giới hạn mảng mới, dùng modulo để luôn trỏ vào 1 phần tử hợp lệ, tránh crash
  const safeIndex = current % active.length;
  const promo = active[safeIndex];

  return (
    <>
      <section className="pt-10 pb-12 bg-gradient-to-b from-bg-base via-white to-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          {/* Tiêu đề section — tạo ranh giới rõ với Hero phía trên */}
          <div className="flex items-center gap-2 mb-5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-100">
              <Tag className="w-3.5 h-3.5 text-brand-600" />
            </span>
            <h3 className="font-display font-bold text-lg text-text-dark">Sự kiện & Ưu đãi</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-brand-200 to-transparent ml-1" />
          </div>

          {/* Khung kính mờ bao ngoài — đồng bộ design language với panel Hero */}
          <div className="p-2 rounded-[26px]"
            style={{
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 8px 24px rgba(249,115,22,0.08)',
            }}>
            {/* Poster — tỷ lệ 16:9, click mở popup */}
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="relative w-full rounded-2xl overflow-hidden shadow-md cursor-pointer select-none"
              style={{ aspectRatio: '16/9' }}
              onClick={() => setSelected(promo)}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {promo['Hình ảnh'] ? (
                <img
                  src={promo['Hình ảnh']}
                  alt={promo['Tiêu đề']}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <FallbackPoster promo={promo} />
              )}

              {/* Shimmer hint "nhấn để xem" */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
            </motion.div>
          </div>

          {/* Dot indicators — chỉ hiện khi > 1 sự kiện */}
          {active.length > 1 && (
            <div className="flex justify-center gap-2 mt-3">
              {active.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === safeIndex
                      ? 'w-5 h-2 bg-brand-500'
                      : 'w-2 h-2 bg-brand-200 hover:bg-brand-300'
                  }`}
                  aria-label={`Sự kiện ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popup */}
      {selected && (
        <PromoPopup promo={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

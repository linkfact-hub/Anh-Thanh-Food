import { StoreInfo } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

// ── BLUR BACKGROUND TRICK ─────────────────────────────────────
// Layer 1: ảnh blur scale-up làm nền fill (không bị trắng 2 bên)
// Layer 2: ảnh thật object-contain căn giữa, giữ đúng tỉ lệ
// → hoạt động cho cả ảnh ngang lẫn ảnh dọc
// Đặt ở cấp module (không lồng trong Hero) để tránh re-create mỗi lần render
function SlideItem({ src, isActive }: { src: string; isActive: boolean }) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      {/* Layer 1: blur nền — fill toàn bộ khung, scale up che viền */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          filter: 'blur(18px) brightness(0.7) saturate(1.2)',
          transform: 'scale(1.08)',   // che viền blur
          pointerEvents: 'none',
        }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      {/* Layer 2: ảnh thật căn giữa, đúng tỉ lệ */}
      <img
        src={src}
        alt="Banner"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'contain',       // giữ tỉ lệ gốc, không crop
          objectPosition: 'center',
          pointerEvents: 'none',
        }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    </motion.div>
  );
}

export default function Hero({ storeInfo }: { storeInfo: StoreInfo }) {
  const isShopOpen = () => {
    const hour = new Date().getHours();
    const openTime  = storeInfo['Giờ mở cửa'] || '6:00 – 22:00';
    const openHour  = parseInt(openTime.split(':')[0]) || 6;
    const closeHour = parseInt(openTime.split('–')[1]?.trim().split(':')[0]) || 22;
    return hour >= openHour && hour < closeHour;
  };
  const isOpen = isShopOpen();

  const soSao        = storeInfo['So_Sao']         || '4.9';
  const donHomNay    = storeInfo['Don_Hom_Nay']    || '128';
  const thoiGianGiao = storeInfo['Thoi_Gian_Giao'] || '30';
  const mascotUrl    = storeInfo['Mascot URL']      ||
    'https://i.ibb.co/8nY10pXH/Chibi-girl-in-sporty-style-202606071547-removebg-preview.png';

  // ── BANNER SLIDESHOW ──────────────────────────────────────────
  // Đọc mảng banners từ Sheet (GAS đã gom Banner_1, Banner_2...)
  // Nếu không có banner nào → dùng gradient nền mặc định
  const rawBanners = storeInfo.banners;
  const banners: string[] = Array.isArray(rawBanners) && rawBanners.length > 0
    ? rawBanners.filter(Boolean)
    : (storeInfo['Hero Banner URL'] ? [storeInfo['Hero Banner URL']] : [`${import.meta.env.BASE_URL}Banner.png`]);
  const hasBanner = banners.length > 0;
  const hasVideo  = !hasBanner;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused,     setIsPaused]     = useState(false);

  // Auto-play 4 giây / slide
  useEffect(() => {
    if (!hasBanner || banners.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length, hasBanner, isPaused]);

  const goTo = (idx: number) => {
    setCurrentSlide(idx);
    setIsPaused(true);
    // Tiếp tục auto-play sau 8 giây nếu người dùng chọn tay
    setTimeout(() => setIsPaused(false), 8000);
  };
  // ─────────────────────────────────────────────────────────────

  const stats = [
    { icon: '⭐', label: 'Đánh giá',    value: `${soSao}/5 ⭐`,          bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)' },
    { icon: '🍽️', label: 'Đã phục vụ', value: `${donHomNay}+ đơn`,       bg: 'linear-gradient(135deg,#fff7ed,#ffedd5)' },
    { icon: '🚀', label: 'Giao hàng',   value: `~${thoiGianGiao} phút`, bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
  ];

  // ── BANNER MODE ───────────────────────────────────────────────
  // Khi dùng Banner.png hoặc Banner_Mode === 'poster':
  // Luôn hiển thị chế độ Poster Banner sạch sẽ, tỉ lệ 3:1, không bị các thẻ cũ và mascot cũ đè lên
  const rawBannerMode = String((storeInfo as any)['Banner_Mode'] || '').toLowerCase();
  const isUsingDefaultBanner = banners.some(b => b.includes('Banner.png') || b.includes('banner.png'));
  const isPosterMode = hasBanner && (isUsingDefaultBanner || rawBannerMode === 'poster');

  if (isPosterMode) {
    return (
      <section className="relative w-full overflow-hidden bg-bg-base pt-3 sm:pt-4 pb-2 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Banner Container - Chuẩn tỉ lệ 3:1 (2172x724) */}
          <div
            onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative w-full aspect-[2172/724] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(249,115,22,0.16)] border border-brand-200/80 cursor-pointer transition-all hover:shadow-[0_16px_45px_rgba(249,115,22,0.24)]"
            title="Bấm để xem thực đơn & đặt món ngay"
          >
            {banners.map((src, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ opacity: i === currentSlide ? 1 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full"
                style={{ pointerEvents: i === currentSlide ? 'auto' : 'none' }}
              >
                <img
                  src={src}
                  alt="Banner Tiệm Anh Thanh - PAT-FOOD"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                />
              </motion.div>
            ))}

            {/* Hiệu ứng viền bóng mờ cao cấp */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />


            {/* Gợi ý bấm xem menu */}
            <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 z-10 hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-brand-700 text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md border border-brand-100/80 group-hover:bg-brand-50 transition-colors">
              <span>Xem thực đơn ngay</span>
              <span className="text-brand-600 font-mono">↓</span>
            </div>

            {/* Dots chuyển slide nếu có nhiều banner */}
            {banners.length > 1 && (
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
                    className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-5 bg-white shadow-sm' : 'w-1.5 bg-white/60'}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Dải thông số nhanh (Đánh giá, đơn hôm nay, thời gian giao) */}
          <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-4 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-2 py-2 sm:py-2.5 px-2 bg-white rounded-xl sm:rounded-2xl border border-brand-100/80 shadow-[0_2px_10px_rgba(249,115,22,0.06)]"
              >
                <div
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-base shrink-0"
                  style={{ background: s.bg }}
                >
                  {s.icon}
                </div>
                <div className="text-left">
                  <div className="text-[10px] sm:text-xs text-text-soft font-medium leading-none">{s.label}</div>
                  <div className="text-xs sm:text-sm font-bold text-text-dark leading-tight mt-0.5">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── BACKGROUND VIDEO (chỉ dùng khi KHÔNG có banner ảnh) ────────
  // Đặt file .mp4 vào thư mục public/, ví dụ public/hero-bg.mp4
  const heroVideoUrl = `${import.meta.env.BASE_URL}hero-bg.mp4`;

  // ── BANNER BACKGROUND LAYER ───────────────────────────────────
  const BannerBg = () => {
    // Không có banner ảnh → video nền chuyển động + gradient overlay
    if (!hasBanner) {
      return (
        <>
          {/* Video nền — tự phát, loop vô hạn, không âm thanh */}
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={heroVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none'; }}
          />
          {/* Gradient overlay rất nhẹ — chỉ thêm chút tint thương hiệu, video hiện rõ phía dưới */}
          <div className="absolute inset-0 z-0"
            style={{ background: 'linear-gradient(145deg,rgba(237,231,246,0.18) 0%,rgba(243,229,245,0.15) 35%,rgba(252,228,236,0.13) 75%,rgba(255,249,196,0.10) 100%)' }} />
          <div className="absolute -top-20 -right-12 w-96 h-96 rounded-full z-0"
            style={{ background: 'radial-gradient(circle,rgba(186,104,200,0.2),transparent 70%)' }} />
          <div className="absolute -bottom-10 -left-8 w-60 h-60 rounded-full z-0"
            style={{ background: 'radial-gradient(circle,rgba(233,30,99,0.12),transparent 70%)' }} />
          <div className="absolute top-20 left-4 w-36 h-36 rounded-full z-0"
            style={{ background: 'radial-gradient(circle,rgba(255,235,59,0.18),transparent 70%)' }} />
        </>
      );
    }

    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Tất cả slides render sẵn, dùng opacity để chuyển */}
        {banners.map((src, i) => (
          <SlideItem key={i} src={src} isActive={i === currentSlide} />
        ))}

        {/* Overlay — decoration mode: gradient nhẹ giúp text đọc được */}
        {!isPosterMode && (
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right,rgba(0,0,0,0.22) 0%,rgba(0,0,0,0.05) 55%,transparent 100%)' }} />
        )}

        {/* Dots indicator */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width:  i === currentSlide ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === currentSlide
                    ? 'rgba(255,255,255,0.95)'
                    : 'rgba(255,255,255,0.45)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* POSTER MODE: badge mở cửa + CTA nhỏ góc dưới, ẩn hết còn lại */}
        {isPosterMode && (
          <>
            <div className="absolute top-4 left-4 z-20
              inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm"
              style={{ border:`1px solid ${isOpen?'rgba(76,175,80,0.3)':'rgba(239,68,68,0.3)'}` }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background:isOpen?'#4caf50':'#ef4444', animation:'pulse-dot 1.5s infinite' }}/>
              <span className="text-xs font-semibold" style={{ color:isOpen?'#2e7d32':'#b91c1c' }}>
                {isOpen?'Đang mở cửa':'Đã đóng cửa'}
              </span>
            </div>
            <motion.button
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior:'smooth' })}
              className="absolute bottom-10 right-6 z-20 flex items-center gap-2 font-bold text-white rounded-2xl px-6 py-3 text-sm"
              style={{ background:'linear-gradient(135deg,#f97316,#ea580c)',
                boxShadow:'0 6px 20px rgba(249,115,22,0.35)' }}>
              🛒 Đặt món ngay
            </motion.button>
          </>
        )}
      </div>
    );
  };
  // ─────────────────────────────────────────────────────────────

  return (
    <section className="relative w-full overflow-hidden">

      {/* NỀN — banner ảnh hoặc gradient mặc định */}
      <BannerBg />

      {/* Dot trang trí SVG (chỉ giữ khi không có banner ảnh) */}
      {!hasBanner && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
          <circle cx="60"  cy="120" r="5"   fill="rgba(156,39,176,0.1)"/>
          <circle cx="100" cy="300" r="3"   fill="rgba(233,30,99,0.08)"/>
          <circle cx="40"  cy="450" r="4"   fill="rgba(156,39,176,0.08)"/>
          <circle cx="900" cy="80"  r="4"   fill="rgba(233,30,99,0.08)"/>
          <circle cx="1100"cy="200" r="3"   fill="rgba(156,39,176,0.1)"/>
          <circle cx="1050"cy="450" r="5"   fill="rgba(233,30,99,0.08)"/>
          <circle cx="600" cy="30"  r="3.5" fill="rgba(156,39,176,0.08)"/>
        </svg>
      )}

      {/* ═══════════════════════════════
          DESKTOP LAYOUT (md+)
      ═══════════════════════════════ */}
      <div className="hidden md:flex relative z-10 max-w-6xl mx-auto px-8 items-center"
        style={{ minHeight: isPosterMode ? '560px' : '520px' }}>

        {/* Trái: Text + Stats + CTA — ẩn khi poster mode */}
        <div className={`flex-1 max-w-lg py-16 ${isPosterMode ? 'invisible' : ''}`}
          style={hasVideo ? {
            backdropFilter: 'blur(10px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(10px) saturate(1.5)',
            borderRadius: '28px',
            padding: '40px 36px',
            margin: '40px 0',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 8px 32px rgba(123,31,162,0.06)',
          } : undefined}>
          <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.4 }}
            className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-6 shadow-sm"
            style={{ border:`1px solid ${isOpen?'rgba(76,175,80,0.3)':'rgba(239,68,68,0.3)'}` }}>
            <span className="w-2 h-2 rounded-full" style={{ background:isOpen?'#4caf50':'#ef4444', animation:'pulse-dot 1.5s infinite' }}/>
            <span className="text-xs font-semibold" style={{ color:isOpen?'#2e7d32':'#b91c1c' }}>
              {isOpen?'Đang mở cửa':'Đã đóng cửa'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5,delay:0.1 }}
            className="font-display font-black mb-3"
            style={{ fontSize:'clamp(36px,4vw,56px)', lineHeight:1.1, color: '#291b12' }}>
            Trạm năng lượng<br/>
            <span style={{ background:'linear-gradient(135deg,#f97316,#ea580c)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Pat-Milk!
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5,delay:0.15 }}
            className="text-base mb-8 leading-relaxed"
            style={{ color: hasBanner ? 'rgba(255,255,255,0.85)' : '#6c472d', maxWidth:'400px' }}>
            {storeInfo['Slogan'] || 'Thanh mát vị trà, đậm đà hương sữa'}<br/>
            Nguyên liệu tươi mới mỗi ngày · Giao hàng 30 phút
          </motion.p>

          {/* Stats Desktop */}
          <motion.div
            initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5,delay:0.2 }}
            className="flex gap-3 mb-8">
            {stats.map((s,i) => (
              <div key={i} className="flex items-center gap-2 rounded-2xl px-4 py-3"
                style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(12px)',
                  border:'0.5px solid rgba(249,115,22,0.15)',
                  boxShadow:'0 2px 12px rgba(249,115,22,0.08)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background:s.bg }}>{s.icon}</div>
                <div>
                  <div className="text-[11px]" style={{ color:'#9c8273' }}>{s.label}</div>
                  <div className="text-sm font-bold" style={{ color:'#291b12' }}>{s.value}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Desktop */}
          <motion.div
            initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5,delay:0.25 }}
            className="flex gap-3">
            <motion.button
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior:'smooth' })}
              className="flex items-center gap-2 font-bold text-white rounded-2xl px-8 py-4 text-base"
              style={{ background:'linear-gradient(135deg,#f97316,#ea580c)',
                boxShadow:'0 8px 24px rgba(249,115,22,0.3)' }}>
              🛒 Đặt món ngay
            </motion.button>
            <motion.button
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior:'smooth' })}
              className="flex items-center gap-2 font-semibold rounded-2xl px-6 py-4 text-base"
              style={{ background:'rgba(255,255,255,0.8)', backdropFilter:'blur(8px)',
                border:'1px solid rgba(249,115,22,0.2)', color:'#ea580c' }}>
              Xem thực đơn →
            </motion.button>
          </motion.div>
        </div>

        {/* Phải: Mascot lớn + floating elements — ẩn khi poster mode */}
        <div className={`relative flex-shrink-0 ${isPosterMode ? 'invisible' : ''}`} style={{ width:'420px', height:'520px' }}>

          {/* Floating card: Đánh giá */}
          <motion.div
            animate={{ y:[0,-8,0] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
            className="absolute z-20 bg-white rounded-2xl px-4 py-3"
            style={{ top:'180px', left:'0px', boxShadow:'0 8px 24px rgba(156,39,176,0.15)',
              border:'0.5px solid rgba(156,39,176,0.12)' }}>
            <div className="text-[10px] mb-0.5" style={{ color:'#bdbdbd' }}>Khách hàng yêu thích</div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black" style={{ color:'#7b1fa2' }}>{soSao}</span>
              <span style={{ color:'#f59e0b', fontSize:'14px' }}>★★★★★</span>
            </div>
          </motion.div>

          {/* Floating card: Đơn hôm nay */}
          <motion.div
            animate={{ y:[0,-8,0] }} transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut', delay:1 }}
            className="absolute z-20 bg-white rounded-2xl px-4 py-3"
            style={{ top:'380px', right:'-20px', boxShadow:'0 8px 24px rgba(233,30,99,0.12)',
              border:'0.5px solid rgba(233,30,99,0.1)' }}>
            <div className="text-[10px] mb-0.5" style={{ color:'#9c8273' }}>Đã phục vụ</div>
            <div className="text-lg font-black" style={{ color:'#e11d48' }}>{donHomNay}+ đơn 🔥</div>
          </motion.div>

          {/* Speech bubble */}
          <motion.div
            animate={{ y:[0,-6,0] }} transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut', delay:0.5 }}
            className="absolute z-20 bg-white font-bold whitespace-nowrap"
            style={{ top:'50px', right:'20px', color:'#7b1fa2', fontSize:'12px',
              padding:'8px 14px', borderRadius:'16px 16px 16px 2px',
              boxShadow:'0 4px 16px rgba(156,39,176,0.15)',
              border:'0.5px solid rgba(156,39,176,0.12)' }}>
            Gọi ngay nào! 📲
          </motion.div>

          {/* Mascot */}
          <motion.img
            src={mascotUrl}
            alt="PAT Milk mascot"
            initial={{ opacity:0, scale:0.8, y:30 }}
            animate={{ opacity:1, scale:1, y:0 }}
            transition={{ type:'spring', damping:14, stiffness:100, delay:0.2 }}
            className="absolute bottom-0 right-0 z-10"
            style={{ height:'460px', width:'auto', objectFit:'contain',
              filter:'drop-shadow(0 16px 40px rgba(156,39,176,0.3)) drop-shadow(0 4px 12px rgba(233,30,99,0.2))' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }}
          />
        </div>
      </div>

      {/* ═══════════════════════════════
          MOBILE LAYOUT (< md)
      ═══════════════════════════════ */}
      <div className="flex md:hidden relative z-10 items-end px-5 pt-5 pb-0"
        style={{ minHeight: isPosterMode ? '480px' : '420px' }}>

        {/* Trái mobile — ẩn khi poster mode */}
        <div className={`flex-1 flex flex-col justify-center pb-10 pt-4 ${isPosterMode ? 'invisible' : ''}`}
          style={hasVideo ? {
            backdropFilter: 'blur(8px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(8px) saturate(1.5)',
            borderRadius: '22px',
            padding: '20px 16px',
            margin: '4px 0',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 6px 24px rgba(123,31,162,0.06)',
          } : undefined}>
          <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.4 }}
            className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 mb-3 w-fit shadow-sm"
            style={{ border:`1px solid ${isOpen?'rgba(76,175,80,0.3)':'rgba(239,68,68,0.3)'}` }}>
            <span className="w-1.5 h-1.5 rounded-full"
              style={{ background:isOpen?'#4caf50':'#ef4444', animation:'pulse-dot 1.5s infinite' }}/>
            <span className="text-[10px] font-semibold" style={{ color:isOpen?'#2e7d32':'#b91c1c' }}>
              {isOpen?'Đang mở cửa':'Phục vụ 24/7'}
            </span>
          </motion.div>

          <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.45,delay:0.1 }}>
            <h2 className="font-display font-black leading-tight mb-1.5"
              style={{ fontSize:'clamp(22px,6vw,28px)', color: hasBanner ? '#fff' : '#291b12' }}>
              Uống ngon,{' '}
              <span style={{ background:'linear-gradient(135deg,#f97316,#ea580c)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text', display:'block' }}>
                sống khoẻ!
              </span>
            </h2>
            <p className="text-xs mb-4 leading-relaxed"
              style={{ color: hasBanner ? 'rgba(255,255,255,0.8)' : '#6c472d' }}>
              {storeInfo['Slogan'] || 'Trà sữa tươi ngày · Giao 30 phút'}<br/>
              Bến Cát, Bình Dương
            </p>
          </motion.div>

          <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }}
            transition={{ duration:0.45,delay:0.2 }} className="flex flex-col gap-1.5 mb-4">
            {stats.map((s,i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl px-2.5 py-1.5"
                style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(8px)',
                  border:'0.5px solid rgba(249,115,22,0.15)' }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background:s.bg }}>{s.icon}</div>
                <span className="text-[10px] flex-1" style={{ color:'#9c8273' }}>{s.label}</span>
                <span className="text-xs font-bold" style={{ color:'#291b12' }}>{s.value}</span>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.45,delay:0.3 }}
            whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior:'smooth' })}
            className="flex items-center justify-center gap-2 font-bold text-white rounded-2xl py-3.5 text-sm"
            style={{ background:'linear-gradient(135deg,#f97316,#ea580c)',
              boxShadow:'0 6px 20px rgba(249,115,22,0.3)', maxWidth:'220px', width:'100%' }}>
            🛒 Đặt món ngay
          </motion.button>
        </div>

        {/* Phải mobile: Mascot — ẩn khi poster mode */}
        <div className={`relative flex-shrink-0 self-end ${isPosterMode ? 'invisible' : ''}`} style={{ width:'158px', marginRight:'-8px' }}>
          <motion.div animate={{ y:[0,-5,0] }} transition={{ duration:2.5,repeat:Infinity,ease:'easeInOut' }}
            className="absolute z-20 bg-white text-[9px] font-bold whitespace-nowrap px-2.5 py-1.5"
            style={{ top:'44px', left:'-72px', color:'#ea580c',
              boxShadow:'0 4px 15px rgba(249,115,22,0.15)',
              border:'0.5px solid rgba(249,115,22,0.12)',
              borderRadius:'14px 14px 14px 2px' }}>
            Gọi ngay nào! 📲
          </motion.div>
          <motion.div animate={{ y:[0,-5,0] }} transition={{ duration:3,repeat:Infinity,ease:'easeInOut',delay:0.8 }}
            className="absolute z-20 bg-white rounded-xl px-2 py-1 text-[9px] font-bold"
            style={{ top:'10px', left:'-52px', color:'#ea580c',
              boxShadow:'0 3px 10px rgba(249,115,22,0.15)',
              border:'0.5px solid rgba(249,115,22,0.1)' }}>
            ✨ Mới hôm nay
          </motion.div>
          <motion.div animate={{ y:[0,-5,0] }} transition={{ duration:3.5,repeat:Infinity,ease:'easeInOut',delay:1.5 }}
            className="absolute z-20 bg-white rounded-xl px-2 py-1 text-[9px] font-bold"
            style={{ bottom:'70px', left:'-58px', color:'#e11d48',
              boxShadow:'0 3px 10px rgba(225,29,72,0.12)',
              border:'0.5px solid rgba(225,29,72,0.1)' }}>
            🔥 Bán chạy
          </motion.div>
          <motion.img
            src={mascotUrl} alt="PAT Milk mascot"
            initial={{ opacity:0,scale:0.85 }} animate={{ opacity:1,scale:1 }}
            transition={{ type:'spring',damping:14,stiffness:120,delay:0.15 }}
            className="w-full block relative z-10"
            style={{ filter:'drop-shadow(0 8px 28px rgba(156,39,176,0.25)) drop-shadow(0 2px 8px rgba(233,30,99,0.15))' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }}
          />
        </div>
      </div>

      {/* Divider chuyển tiếp mượt — fade gradient, không méo dạng trên mọi tỷ lệ màn hình */}
      <div className="relative z-10 w-full h-10"
        style={{ background: 'linear-gradient(to bottom, transparent, #faf6f0)', marginTop:'-40px' }} />

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.7); }
        }
      `}</style>
    </section>
  );
}

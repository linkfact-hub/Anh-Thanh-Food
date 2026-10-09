import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStore } from '../store';
import { StoreInfo } from '../types';
import { formatGia, generateOrderCode, getEffectivePrice } from '../lib/utils';
import { datHang } from '../lib/api';
import {
  X,
  CheckCircle,
  Smartphone,
  Truck,
  Store,
  CreditCard,
  Banknote,
  MapPin,
  Sparkles,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  QrCode,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CUSTOMER_INFO_KEY = 'pat_customer_info';

interface SavedCustomerInfo {
  fullName: string;
  phone: string;
  method: 'giaohang' | 'tulay';
  address: string;
  note: string;
}

const getSavedCustomerInfo = (): SavedCustomerInfo | null => {
  try {
    const raw = localStorage.getItem(CUSTOMER_INFO_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore JSON error
  }
  return null;
};

const saveCustomerInfo = (info: Partial<SavedCustomerInfo>) => {
  try {
    const prev = getSavedCustomerInfo() || { fullName: '', phone: '', method: 'giaohang', address: '', note: '' };
    localStorage.setItem(CUSTOMER_INFO_KEY, JSON.stringify({ ...prev, ...info }));
  } catch {
    // Ignore storage quota error
  }
};

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ và tên"),
  phone: z.string().regex(/^(0[35789])[0-9]{8}$/, "Số điện thoại không hợp lệ (10 số)"),
  method: z.enum(['giaohang', 'tulay']),
  address: z.string().optional(),
  note: z.string().optional(),
}).refine(data => {
  if (data.method === 'giaohang' && (!data.address || !data.address.trim())) return false;
  return true;
}, {
  message: "Vui lòng nhập địa chỉ nhận hàng",
  path: ["address"]
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutModal({ storeInfo, onClose }: { storeInfo: StoreInfo; onClose: () => void }) {
  const { cart, clearCart, member, addToast } = useStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CODE' | 'CK'>('CODE');
  const [orderCode] = useState(() => generateOrderCode());
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const savedInfo = getSavedCustomerInfo();
  const [hasAutoFilled, setHasAutoFilled] = useState(() => Boolean(savedInfo?.fullName || savedInfo?.phone));

  const total = cart.reduce((sum, item) => sum + getEffectivePrice(item) * item.quantity, 0);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: savedInfo?.fullName || (member ? member['Họ tên'] : ''),
      phone: savedInfo?.phone || (member ? member['SĐT'] : ''),
      method: ((savedInfo?.method || 'giaohang') as 'giaohang' | 'tulay'),
      address: savedInfo?.address || '',
      note: savedInfo?.note || ''
    }
  });

  const methodVal = watch('method');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitOrder = async (data: CheckoutFormValues) => {
    setIsLoading(true);
    try {
      const result = await datHang({
        maDon: orderCode,
        hoTen: data.fullName,
        soDienThoai: data.phone,
        hinhThuc: data.method,
        diaChiNhanHang: data.address || '',
        ghiChu: data.note || '',
        phuongThucThanhToan: paymentMethod,
        tongTien: total,
        cart: cart.map(item => ({
          SP_id:      item.ID,
          tenSanPham: item['Tên sản phẩm'],
          danhMuc:    item['Danh mục'],
          donViTinh:  item['Đơn vị tính'],
          soLuong:    item.quantity,
          giaBan:     getEffectivePrice(item),
        })),
      });

      if (result.success) {
        // Lưu thông tin khách hàng cho lần sau
        saveCustomerInfo({
          fullName: data.fullName,
          phone: data.phone,
          method: data.method,
          address: data.address || '',
          note: data.note || '',
        });

        // Lưu đơn hàng gần nhất phục vụ tính năng "Đặt lại đơn trước"
        try {
          const lastOrderData = {
            orderCode,
            orderDate: new Date().toISOString(),
            totalPrice: total,
            items: cart.map(item => {
              const { cartItemId, ...prod } = item;
              return {
                product: prod,
                quantity: item.quantity,
              };
            }),
          };
          localStorage.setItem('pat_last_order', JSON.stringify(lastOrderData));
          localStorage.setItem('last_order', JSON.stringify(lastOrderData));
          window.dispatchEvent(new Event('pat_last_order_updated'));
        } catch {
          // Ignore storage quota error
        }

        clearCart();
        setIsSuccess(true);
      } else {
        addToast('Đặt hàng thất bại: ' + (result.error || 'Lỗi không xác định'), 'error');
      }
    } catch {
      addToast('Lỗi kết nối mạng, vui lòng thử lại nhé!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getVietQrUrl = () => {
    const bankCode = storeInfo['Mã ngân hàng'];
    const accNumber = storeInfo['Số tài khoản'];
    const accName = encodeURIComponent(storeInfo['Tên chủ TK']);
    return `https://img.vietqr.io/image/${bankCode}-${accNumber}-compact2.png?amount=${total}&addInfo=${orderCode}&accountName=${accName}`;
  };

  const handleCopyAcc = () => {
    if (storeInfo['Số tài khoản']) {
      navigator.clipboard.writeText(storeInfo['Số tài khoản']);
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(orderCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Prevent rendering if cart is empty and not in success view
  if (cart.length === 0 && !isSuccess) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-lg bg-white border border-brand-200 rounded-3xl shadow-[0_20px_60px_rgba(168,85,247,0.2)] overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-100 bg-bg-base/80 flex justify-between items-center backdrop-blur-sm">
            <div>
              <h3 className="font-display text-xl text-text-dark font-bold">
                {isSuccess ? 'Đặt Hàng Thành Công' : 'Đặt Hàng'}
              </h3>
              {!isSuccess && (
                <p className="text-xs text-text-soft mt-0.5">Xác nhận thông tin & nhận trà sữa nhanh chóng</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-brand-50 rounded-full text-text-mid hover:text-brand-600 transition-colors"
              aria-label="Đóng popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
            {!isSuccess ? (
              <form id="one-step-checkout-form" onSubmit={handleSubmit(onSubmitOrder)} className="space-y-5">
                {/* 1. Tóm tắt đơn hàng (Thu gọn / mở rộng) */}
                <div className="bg-lavender-50/70 border border-brand-200/70 rounded-2xl p-3.5 transition-all">
                  <div
                    onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-600">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-text-dark">Đơn hàng ({totalItemCount} món)</span>
                        <span className="text-xs text-text-soft block sm:inline sm:ml-2">Bấm để {isOrderSummaryOpen ? 'thu gọn' : 'xem chi tiết'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-600 text-base">{formatGia(total)}</span>
                      {isOrderSummaryOpen ? (
                        <ChevronUp className="w-4 h-4 text-text-soft" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-text-soft" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOrderSummaryOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-3 mt-3 border-t border-brand-100"
                      >
                        <div className="space-y-2 max-h-44 overflow-y-auto custom-scrollbar pr-1">
                          {cart.map(item => (
                            <div key={item.cartItemId} className="flex justify-between items-start text-xs sm:text-sm">
                              <span className="text-text-dark pr-2">
                                <strong className="text-brand-600 font-semibold">{item.quantity}x</strong> {item['Tên sản phẩm']}
                              </span>
                              <span className="text-text-mid font-mono whitespace-nowrap">
                                {formatGia(getEffectivePrice(item) * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. Thông tin liên hệ */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-brand-600 text-sm sm:text-base flex items-center gap-1.5">
                      1. Thông tin người nhận
                    </h4>
                    {hasAutoFilled && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        Đã tự điền từ đơn trước
                      </span>
                    )}
                  </div>

                  {hasAutoFilled && (
                    <div className="flex items-center justify-between px-3 py-1.5 bg-lavender-50 border border-brand-200/60 rounded-xl text-xs text-brand-700">
                      <span>Thông tin đã được lưu tự động</span>
                      <button
                        type="button"
                        onClick={() => {
                          reset({ fullName: '', phone: '', address: '', method: 'giaohang', note: '' });
                          setHasAutoFilled(false);
                        }}
                        className="text-text-soft hover:text-brand-600 underline font-medium"
                      >
                        Xóa để nhập mới
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        {...register('fullName')}
                        className={`w-full px-3.5 py-2.5 bg-bg-base border ${errors.fullName ? 'border-red-400' : 'border-brand-100'} rounded-xl text-text-dark text-sm focus:border-brand-400 outline-none transition-colors`}
                        placeholder="Họ tên người nhận *"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <input
                        {...register('phone')}
                        type="tel"
                        className={`w-full px-3.5 py-2.5 bg-bg-base border ${errors.phone ? 'border-red-400' : 'border-brand-100'} rounded-xl text-text-dark text-sm focus:border-brand-400 outline-none transition-colors`}
                        placeholder="Số điện thoại (10 số) *"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                {/* 3. Hình thức nhận hàng */}
                <div className="space-y-3 pt-2 border-t border-brand-50">
                  <h4 className="font-bold text-brand-600 text-sm sm:text-base">
                    2. Hình thức nhận hàng
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${methodVal === 'giaohang' ? 'border-brand-400 bg-lavender-50 text-brand-600 font-bold shadow-sm' : 'border-brand-100 bg-bg-base text-text-soft hover:border-brand-300'}`}>
                      <input type="radio" value="giaohang" {...register('method')} className="hidden" />
                      <Truck className="w-4 h-4" />
                      <span className="text-sm">Giao hàng</span>
                    </label>
                    <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${methodVal === 'tulay' ? 'border-brand-400 bg-lavender-50 text-brand-600 font-bold shadow-sm' : 'border-brand-100 bg-bg-base text-text-soft hover:border-brand-300'}`}>
                      <input type="radio" value="tulay" {...register('method')} className="hidden" />
                      <Store className="w-4 h-4" />
                      <span className="text-sm">Tự đến lấy</span>
                    </label>
                  </div>

                  {methodVal === 'giaohang' ? (
                    <div>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-brand-600/60" />
                        <input
                          {...register('address')}
                          className={`w-full pl-9 pr-3.5 py-2.5 bg-bg-base border ${errors.address ? 'border-red-400' : 'border-brand-100'} rounded-xl text-text-dark text-sm focus:border-brand-400 outline-none transition-colors`}
                          placeholder="Địa chỉ cụ thể / Tên xưởng, cổng nhận hàng *"
                        />
                      </div>
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>
                  ) : (
                    <div className="p-3 bg-lavender-50/80 rounded-xl border border-brand-100 text-xs sm:text-sm">
                      <p className="text-brand-500 font-medium mb-0.5">Địa chỉ nhận tại quán:</p>
                      <p className="text-text-dark font-medium">{storeInfo['Địa chỉ']}</p>
                    </div>
                  )}

                  {/* Ghi chú thêm */}
                  <div>
                    <textarea
                      {...register('note')}
                      rows={2}
                      className="w-full px-3.5 py-2 bg-bg-base border border-brand-100 rounded-xl text-text-dark text-sm focus:border-brand-400 outline-none resize-none transition-colors"
                      placeholder="Ghi chú thêm (VD: ít đá, 50% đường, đem thêm ống hút...)"
                    />
                  </div>
                </div>

                {/* 4. Phương thức thanh toán */}
                <div className="space-y-3 pt-2 border-t border-brand-50">
                  <h4 className="font-bold text-brand-600 text-sm sm:text-base">
                    3. Phương thức thanh toán
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'CODE' ? 'border-brand-400 bg-lavender-50' : 'border-brand-100 bg-bg-base hover:border-brand-200'}`}>
                      <input
                        type="radio"
                        value="CODE"
                        checked={paymentMethod === 'CODE'}
                        onChange={() => setPaymentMethod('CODE')}
                        className="hidden"
                      />
                      <Banknote className={`w-5 h-5 mt-0.5 shrink-0 ${paymentMethod === 'CODE' ? 'text-brand-600' : 'text-text-soft'}`} />
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${paymentMethod === 'CODE' ? 'text-brand-600' : 'text-text-dark'}`}>
                          Tiền mặt (COD)
                        </p>
                        <p className="text-xs text-text-soft">Nhận hàng rồi mới thanh toán</p>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'CK' ? 'border-brand-400 bg-lavender-50' : 'border-brand-100 bg-bg-base hover:border-brand-200'}`}>
                      <input
                        type="radio"
                        value="CK"
                        checked={paymentMethod === 'CK'}
                        onChange={() => setPaymentMethod('CK')}
                        className="hidden"
                      />
                      <CreditCard className={`w-5 h-5 mt-0.5 shrink-0 ${paymentMethod === 'CK' ? 'text-brand-600' : 'text-text-soft'}`} />
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${paymentMethod === 'CK' ? 'text-brand-600' : 'text-text-dark'}`}>
                          Quét mã QR / Chuyển khoản
                        </p>
                        <p className="text-xs text-text-soft">VietQR tự điền số tiền</p>
                      </div>
                    </label>
                  </div>

                  {/* Hiển thị chi tiết VietQR nếu chọn Chuyển khoản */}
                  {paymentMethod === 'CK' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-bg-base p-4 rounded-2xl border border-brand-200/80 flex flex-col items-center gap-3 text-center"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-600">
                        <QrCode className="w-4 h-4" />
                        Quét mã VietQR thanh toán nhanh
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-brand-100 shadow-sm shrink-0 w-44 h-44 sm:w-48 sm:h-48">
                        <img src={getVietQrUrl()} className="w-full h-full object-contain" alt="Mã VietQR Thanh Toán" />
                      </div>
                      <div className="text-xs sm:text-sm w-full space-y-1.5 bg-white p-3 rounded-xl border border-brand-100 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-text-soft">Ngân hàng:</span>
                          <strong className="text-text-dark">{storeInfo['Tên ngân hàng']}</strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-soft">Số tài khoản:</span>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-text-dark font-mono text-sm sm:text-base">{storeInfo['Số tài khoản']}</strong>
                            <button
                              type="button"
                              onClick={handleCopyAcc}
                              className="p-1 text-text-soft hover:text-brand-600 transition-colors"
                              title="Sao chép số tài khoản"
                            >
                              {copiedAcc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-soft">Chủ tài khoản:</span>
                          <strong className="text-text-dark uppercase">{storeInfo['Tên chủ TK']}</strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-soft">Nội dung CK:</span>
                          <strong className="text-brand-600 font-mono font-bold">{orderCode}</strong>
                        </div>
                      </div>
                      <p className="text-[11px] text-text-soft italic">
                        * Quý khách có thể quét mã thanh toán ngay hoặc sau khi xác nhận đặt hàng.
                      </p>
                    </motion.div>
                  )}
                </div>
              </form>
            ) : (
              /* Success View */
              <div className="py-6 flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-18 h-18 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600"
                >
                  <CheckCircle className="w-12 h-12" />
                </motion.div>
                <h3 className="text-2xl sm:text-3xl font-display text-gradient mb-1.5">Đặt Hàng Thành Công!</h3>
                <p className="text-text-mid text-sm mb-4 max-w-sm">
                  Cảm ơn bạn đã ủng hộ PAT Milk. Cửa hàng sẽ chuẩn bị món và liên hệ ngay!
                </p>

                <div className="w-full bg-lavender-50 border border-brand-200/80 rounded-2xl p-4 mb-5 text-left text-xs sm:text-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-text-soft">Mã đơn hàng:</span>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-brand-600 font-mono text-base font-bold">{orderCode}</strong>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="p-1 text-text-soft hover:text-brand-600 transition-colors"
                        title="Sao chép mã đơn"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-soft">Tổng tiền:</span>
                    <strong className="text-text-dark font-mono font-bold text-base">{formatGia(total)}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-soft">Thanh toán:</span>
                    <strong className="text-text-dark">
                      {paymentMethod === 'CODE' ? 'Tiền mặt khi nhận (COD)' : 'Chuyển khoản VietQR'}
                    </strong>
                  </div>
                </div>

                {/* Nếu chọn CK, nhắc quét mã QR */}
                {paymentMethod === 'CK' && (
                  <div className="w-full bg-white border border-brand-200 rounded-2xl p-4 mb-5 text-center flex flex-col items-center gap-2">
                    <p className="text-xs font-semibold text-brand-600">
                      Mã VietQR thanh toán cho đơn hàng #{orderCode}:
                    </p>
                    <div className="w-40 h-40 bg-white p-2 rounded-xl border border-brand-100 shadow-sm">
                      <img src={getVietQrUrl()} className="w-full h-full object-contain" alt="QR Code" />
                    </div>
                    <p className="text-[11px] text-text-soft">
                      Nội dung chuyển khoản: <strong className="text-brand-600 font-mono">{orderCode}</strong>
                    </p>
                  </div>
                )}

                <div className="w-full space-y-2.5">
                  <a
                    href={`tel:${storeInfo['Số điện thoại']}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-brand-500 to-pink-500 font-bold text-white rounded-xl shadow-md hover:opacity-95 transition-opacity cursor-pointer text-sm"
                  >
                    <Smartphone className="w-4 h-4" /> Gọi hotline hỗ trợ ({storeInfo['Số điện thoại']})
                  </a>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl border border-brand-200 text-brand-600 font-bold hover:bg-lavender-50 transition-colors text-sm"
                  >
                    Tiếp tục mua hàng
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Bar for 1-Step Checkout */}
          {!isSuccess && (
            <div className="border-t border-brand-100 p-3.5 sm:p-4 bg-bg-base/90 backdrop-blur-sm">
              <button
                type="submit"
                form="one-step-checkout-form"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-brand-500 to-pink-500 hover:from-brand-600 hover:to-pink-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] text-center flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý đặt hàng...</span>
                  </>
                ) : (
                  <>
                    <span>Xác nhận đặt hàng</span>
                    <span className="opacity-75">•</span>
                    <span className="font-mono">{formatGia(total)}</span>
                    <CheckCircle className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

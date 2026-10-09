import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Member } from '../types';
import { useStore } from '../store';
import { dangKyHoiVien } from '../lib/api';
import { X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const memberSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().regex(/^(0[35789])[0-9]{8}$/, "Số điện thoại không hợp lệ"),
  dob: z.string().optional(),
  gender: z.enum(['Nam', 'Nữ', 'Khác']).optional(),
  address: z.string().optional()
});

export default function MemberModal({ onClose }: { onClose: () => void }) {
  const { member, setMember, addToast } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: { fullName: '', phone: '', dob: '', gender: 'Nữ' as 'Nam' | 'Nữ' | 'Khác', address: '' }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const result = await dangKyHoiVien({
        hoTen: data.fullName, soDienThoai: data.phone,
        ngaySinh: data.dob || '', gioiTinh: data.gender || '', diaChi: data.address || '',
      });
      if (result.success) {
        const newMember: Member = {
          'Mã HV': result.maHV, 'Họ tên': data.fullName,
          'SĐT': data.phone, 'Điểm tích lũy': result.diemTichLuy || 10,
        };
        setMember(newMember);
        addToast('🎉 Đăng ký hội viên thành công!', 'success');
      } else {
        addToast(result.error || 'Đăng ký thất bại!', 'error');
      }
    } catch {
      addToast('Lỗi kết nối, thử lại sau!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setMember(null);
    addToast('Đã đăng xuất hội viên.', 'info');
  };

  // Input class helper
  const inputCls = "w-full px-4 py-2.5 bg-lavender-50 border border-brand-100 rounded-xl text-text-dark focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all outline-none";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-text-dark/30 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg bg-white border border-brand-100 rounded-3xl shadow-[0_20px_60px_rgba(249,115,22,0.15)] overflow-hidden"
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-lavender-50 hover:bg-brand-100 p-2 rounded-full text-text-mid transition-colors">
            <X className="w-5 h-5" />
          </button>

          {member ? (
            <div className="p-8">
              <h3 className="font-display text-2xl text-gradient mb-6 text-center">Thẻ Hội Viên</h3>

              {/* Member Card */}
              <div className="relative w-full aspect-[1.6/1] rounded-2xl overflow-hidden mb-8 shadow-[0_8px_30px_rgba(249,115,22,0.25)]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-orange-700" />
                {/* Decorative blobs */}
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-amber-300/30 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-brand-300/30 rounded-full blur-2xl" />
                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl m-3 pointer-events-none" />

                <div className="relative h-full flex flex-col p-6">
                  <div className="flex justify-between items-start mb-auto">
                    <h4 className="font-display text-xl text-white drop-shadow">PAT MILK</h4>
                    <span className="text-xs text-white/60 tracking-widest font-mono">MEMBER</span>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs mb-1 uppercase tracking-widest">Tên thành viên</p>
                    <p className="font-display text-2xl text-white mb-2">{member['Họ tên']}</p>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/20">
                        <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                        <span className="font-bold text-white text-lg">{member['Điểm tích lũy']}</span>
                        <span className="text-xs text-white/70">điểm</span>
                      </div>
                      <span className="font-mono text-white/40 text-xs">{member['Mã HV']}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-lavender-50 border border-brand-100 p-4 rounded-2xl text-center">
                  <p className="font-display text-2xl text-brand-600 mb-1">{member['Điểm tích lũy']}</p>
                  <p className="text-xs text-text-soft">Điểm hiện tại</p>
                </div>
                <div className="bg-pink-50 border border-pink-100 p-4 rounded-2xl text-center">
                  <p className="font-display text-2xl text-brand-600 mb-1">0</p>
                  <p className="text-xs text-text-soft">Quà đã đổi</p>
                </div>
              </div>

              <button onClick={logout} className="w-full py-3 rounded-2xl border border-red-200 text-red-400 font-semibold hover:bg-red-50 transition-colors">
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="p-8">
              <div className="text-center mb-7">
                <p className="text-3xl mb-2"></p>
                <h3 className="font-display text-3xl text-gradient mb-1">Đăng Ký Hội Viên</h3>
                <p className="text-text-soft text-sm">Nhận ngay đặc quyền & ưu đãi hấp dẫn</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-mid mb-1">Họ tên *</label>
                  <input {...register('fullName')} className={inputCls} placeholder="Nguyễn Văn A" />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-mid mb-1">Số điện thoại *</label>
                  <input {...register('phone')} type="tel" className={inputCls} placeholder="09xxxx..." />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message as string}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-mid mb-1">Ngày sinh</label>
                    <input {...register('dob')} type="date" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-mid mb-1">Giới tính</label>
                    <select {...register('gender')} className={inputCls}>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
                <div className="pt-3">
                  <button type="submit" disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold hover:from-brand-400 hover:to-brand-500 transition-colors shadow-md shadow-brand-500/25 disabled:opacity-60 flex items-center justify-center gap-2 text-lg">
                    {isLoading
                      ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      : 'Đăng ký'
                    }
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

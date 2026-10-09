import { useStore } from '../store';
import { AnimatePresence, motion } from 'motion/react';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] border backdrop-blur-md ${
              toast.type === 'success' ? 'bg-emerald-50/95 text-emerald-950 border-emerald-200' :
              toast.type === 'error' ? 'bg-rose-50/95 text-rose-950 border-rose-200' :
              'bg-white/95 text-text-dark border-brand-200 shadow-[0_8px_30px_rgba(249,115,22,0.15)]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-brand-600 shrink-0" />}
              <p className="text-sm font-semibold truncate">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-text-soft hover:text-text-dark transition-colors p-1 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

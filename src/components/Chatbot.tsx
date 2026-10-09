import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreInfo } from '../types';
import { chatAI } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot({ storeInfo, onOpenMember }: { storeInfo: StoreInfo, onOpenMember: () => void }) {
  const mascotUrl = storeInfo['Mascot URL'] && !storeInfo['Mascot URL'].includes('Chibi-girl-in-sporty-style')
    ? storeInfo['Mascot URL']
    : `${import.meta.env.BASE_URL}Logo.png`;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Xin chào! Mình là Trợ Lý PAT Milk - Bạn cần hỏi gì về ${storeInfo['Tên cửa hàng']} không?` }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputVal.trim() || isLoading) return;
    const newMsg: Message = { role: 'user', content: inputVal };
    const allMessages = [...messages, newMsg];
    setMessages(allMessages);
    setInputVal('');
    setIsLoading(true);
    try {
      const result = await chatAI(allMessages);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.reply || 'Xin lỗi, mình không hiểu. Bạn thử hỏi lại nhé!'
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Mình đang bận xíu, bạn thử lại sau nhé! 🙏'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = ["Trà sữa giá bao nhiêu?", "Ship bao lâu?", "Đăng ký hội viên"];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-full p-1 shadow-[0_4px_20px_rgba(249,115,22,0.45)] transition-transform hover:scale-110 active:scale-95 overflow-hidden"
        style={{ width: '60px', height: '60px' }}
      >
        <img
          src={mascotUrl}
          alt="Trợ lý PAT Milk"
          className="w-full h-full object-cover rounded-full"
        />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full border-2 border-brand-400 animate-ping opacity-40" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[350px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] bg-white border border-brand-100 rounded-3xl shadow-[0_8px_40px_rgba(249,115,22,0.18)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-brand-100 bg-gradient-to-r from-brand-500 to-brand-600 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white border border-white/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-white">Trợ Lý PAT Milk</h4>
                  <p className="text-[10px] text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner hội viên */}
            <div className="bg-gradient-to-r from-brand-50 to-amber-50 px-4 py-2 border-b border-brand-100 flex justify-between items-center">
              <span className="text-xs text-text-mid font-medium">✨ Đăng ký nhận ưu đãi thành viên!</span>
              <button onClick={onOpenMember} className="bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                Đăng ký
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-lavender-50/30">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-sm shadow-sm'
                      : 'bg-white text-text-dark border border-brand-100 rounded-tl-sm shadow-sm'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-brand-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 flex gap-2 overflow-x-auto hide-scrollbar border-t border-brand-50 bg-white">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => setInputVal(s)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-lavender-50 border border-brand-100 text-xs text-brand-600 hover:bg-brand-50 hover:border-brand-300 transition-colors font-medium">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-brand-100 bg-white flex items-center gap-2">
              <input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-lavender-50 border border-brand-100 rounded-full px-4 py-2 text-sm text-text-dark placeholder-text-soft focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 disabled:opacity-60"
                placeholder={isLoading ? 'Đang trả lời...' : 'Gửi tin nhắn...'}
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isLoading}
                className="p-2 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all shrink-0"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

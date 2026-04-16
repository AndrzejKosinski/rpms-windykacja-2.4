import React, { useState, useEffect, useRef } from 'react';
import { Send, X, User, ShieldCheck, MessageSquare, Loader2, Zap } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface WorkspaceChatProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const WorkspaceChat: React.FC<WorkspaceChatProps> = ({ isOpen, onClose, userName = 'Użytkowniku' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Witaj ${userName}! Jestem Twoim asystentem prawnym RPMS. W czym mogę Ci dzisiaj pomóc?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Symulacja odpowiedzi AI
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Analizuję Twoje zapytanie w kontekście aktualnych przepisów windykacyjnych. Nasi prawnicy zalecają w tej sytuacji wysłanie ostatecznego wezwania przedsądowego z pieczęcią Kancelarii RPMS, co zazwyczaj skutkuje spłatą w 72h.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-[400px] h-[600px] bg-white rounded-[var(--radius-brand-card)] shadow-[0_20px_60px_-15px_rgba(10,46,92,0.3)] border border-slate-100 flex flex-col z-[100] animate-in slide-in-from-bottom-10 duration-500 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-brand-navy text-white flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue border border-white/10">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest">Asystent RPMS</h4>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online • Ekspert Prawny</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors relative z-10">
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-[var(--radius-brand-input)] flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-brand-blue text-white' : 'bg-white text-brand-navy border border-slate-100'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Zap size={16} className="text-brand-blue" />}
              </div>
              <div className={`p-4 rounded-[var(--radius-brand-button)] text-sm font-medium leading-relaxed shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-brand-navy text-white rounded-tr-none' 
                  : 'bg-white text-slate-600 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.text}
                <div className={`text-[9px] mt-2 font-bold uppercase tracking-widest ${msg.sender === 'user' ? 'text-white/40' : 'text-slate-300'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-[var(--radius-brand-button)] rounded-tl-none shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="text-brand-blue animate-spin" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Asystent analizuje...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Napisz do asystenta..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-[var(--radius-brand-button)] outline-none focus:border-brand-blue transition-all font-bold text-sm"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-navy text-white rounded-[var(--radius-brand-button)] flex items-center justify-center hover:bg-brand-blue transition-all disabled:opacity-50 disabled:hover:bg-brand-navy"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center mt-4">
          Rozmowa jest poufna i chroniona standardami RPMS
        </p>
      </form>
    </div>
  );
};

export default WorkspaceChat;

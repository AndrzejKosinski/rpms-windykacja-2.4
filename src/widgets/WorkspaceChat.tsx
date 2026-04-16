
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Paperclip, Smile, MoreHorizontal, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

interface WorkspaceChatProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const WorkspaceChat: React.FC<WorkspaceChatProps> = ({ isOpen, onClose, userName }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      text: `Witaj ${userName}! Jestem Twoim cyfrowym asystentem w RPMS Windykacja. Posiadam dostęp do bazy wiedzy merytorycznej dotyczącej windykacji i procedur prawnych. W czym mogę pomóc?`, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Jakie są koszty zastępstwa procesowego?",
    "Jakie dokumenty są potrzebne do EPU?",
    "Ile trwa windykacja w branży TSL?",
    "Pieczęć prewencyjna - jak to działa?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      role: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ragContext = `
        Ważne informacje z bazy wiedzy RPMS Windykacja:
        - Koszty zastępstwa procesowego (ustawowe): do 500 zł: 90 zł, do 1500 zł: 270 zł, do 5000 zł: 900 zł, do 10 000 zł: 1800 zł, do 50 000 zł: 3600 zł.
        - Windykacja TSL trwa średnio 4 dni robocze dzięki blokadom na giełdach Trans.eu i Timocom.
        - EPU wymaga NIP, adresu dłużnika i daty wymagalności. Opłata sądowa: 1,25%.
        - Pieczęć kancelarii jest bezpłatna dla abonentów Premium i podnosi priorytet spłaty o ok. 40%.
        - REGUŁA TEMATYCZNA: Możemy rozmawiać wyłącznie o usłudze windykacji i powiązanych kwestiach prawnych.
      `;

      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const history = [...messages, userMessage].map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: history,
        config: {
          systemInstruction: `Jesteś asystentem merytorycznym ds. windykacji i prawa gospodarczego w firmie RPMS Windykacja. 
          TWOJA WIEDZA POCHODZI Z TEGO KONTEKSTU: ${ragContext}. 
          
          ZASADA BEZWZGLĘDNA: 
          1. Możesz rozmawiać TYLKO o usłudze windykacji i prawie gospodarczym związanym z długami. 
          2. Nie używaj słów "model językowy", "AI", "sztuczna inteligencja". Zachowuj się jak profesjonalny doradca operacyjny.
          3. Nie posiadasz dostępu do internetu - opieraj się tylko na dostarczonych dokumentach.
          
          Jeśli użytkownik zada pytanie na jakikolwiek inny temat, odpowiedz: 
          "Skupiamy się na skuteczności prawnej i windykacji Twoich faktur. Dodaj dokument do systemu RPMS, a nasi prawnicy natychmiast zajmą się Twoją sprawą :)"
          
          Odpowiadaj profesjonalnie i merytorycznie.`,
        },
      });

      const assistantMessage: Message = {
        role: 'assistant',
        text: response.text || "Przepraszam, nie mogłem przetworzyć zapytania. Spróbuj ponownie.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: 'assistant',
        text: "Wystąpił błąd podczas komunikacji. Sprawdź połączenie.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-6 bottom-6 w-[450px] h-[650px] bg-white rounded-[var(--radius-brand-card)] shadow-[0_20px_60px_-15px_rgba(10,46,92,0.3)] border border-slate-200 flex flex-col z-[100] animate-in slide-in-from-right-8 duration-300 overflow-hidden font-sans">
      <div className="bg-white border-b border-slate-100 p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-brand-blue/10 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue shadow-inner">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          <div>
            <h4 className="text-base font-black text-brand-navy flex items-center gap-2">
              Asystent RPMS
              <ShieldCheck size={16} className="text-brand-blue" />
            </h4>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Wsparcie Merytoryczne Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-[var(--radius-brand-button)] transition-colors"><MoreHorizontal size={20} /></button>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-[var(--radius-brand-button)] transition-colors"><X size={20} /></button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 bg-gradient-to-b from-slate-50/50 to-white">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">
                {msg.role === 'assistant' ? 'Asystent RPMS' : userName}
              </span>
              <span className="text-[11px] text-slate-300 font-medium">{msg.time}</span>
            </div>
            
            <div className={`group relative max-w-[90%] px-5 py-3.5 rounded-[var(--radius-brand-button)] text-[13px] font-medium leading-relaxed shadow-sm transition-all ${
              msg.role === 'user' 
              ? 'bg-brand-navy text-white rounded-tr-none' 
              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none hover:border-brand-blue/30'
            }`}>
              {msg.text.split('\n').map((line, i) => <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start">
             <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-tight italic">Przygotowywanie odpowiedzi...</span>
             </div>
             <div className="bg-white px-5 py-4 rounded-[var(--radius-brand-button)] border border-slate-100 flex gap-1.5 shadow-sm">
                <div className="w-2 h-2 bg-brand-blue/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-brand-blue/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce"></div>
             </div>
          </div>
        )}
      </div>

      <div className="p-5 bg-white border-t border-slate-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex overflow-x-auto gap-2 pb-4 mb-2 no-scrollbar">
          {quickQuestions.map((q, i) => (
            <button 
              key={i}
              onClick={() => handleSendMessage(q)}
              className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-200 text-brand-navy text-[11px] font-black rounded-[var(--radius-brand-button)] hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all uppercase tracking-tighter"
            >
              {q}
            </button>
          ))}
        </div>

        <div className={`rounded-[var(--radius-brand-button)] p-2 border transition-all ${
          isInputFocused || input.trim() 
            ? 'bg-white border-brand-blue ring-4 ring-brand-blue/5' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
            placeholder="Zadaj pytanie dotyczące windykacji lub prawa..."
            className="w-full px-4 py-3 bg-transparent outline-none text-[13px] font-medium resize-none min-h-[50px] text-slate-700 placeholder:text-slate-400"
            rows={1}
          />
          <div className="flex items-center justify-between px-2 pt-2 pb-1 border-t border-slate-200/50 mt-2">
            <div className="flex items-center gap-1">
              <button className="p-2 text-slate-400 hover:text-brand-blue transition-colors rounded-[var(--radius-brand-button)] hover:bg-white shadow-sm"><Paperclip size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-brand-blue transition-colors rounded-[var(--radius-brand-button)] hover:bg-white shadow-sm"><Smile size={18} /></button>
            </div>
            <button 
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping}
              className={`flex items-center gap-2 px-5 py-2 rounded-[var(--radius-brand-button)] font-black text-[11px] uppercase tracking-widest transition-all ${
                input.trim() && !isTyping 
                ? 'bg-brand-navy text-white shadow-lg shadow-brand-navy/20 hover:bg-brand-blue' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Wyślij <Send size={14} />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-center text-slate-400 mt-3 font-bold tracking-tight uppercase tracking-[0.1em]">Weryfikuj ważne decyzje strategiczne z prawnikiem</p>
      </div>
    </div>
  );
};

export default WorkspaceChat;

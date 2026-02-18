
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';

interface AssistantProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Assistant: React.FC<AssistantProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "I'm Savage. Tell me what you need, and I'll get the right team on it." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    const response = await chatWithAssistant(userMessage, []);
    setMessages(prev => [...prev, { role: 'model', text: response || "System busy. Email us directly." }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 md:right-24 z-[70]">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[calc(100vw-32px)] md:w-96 h-[500px] bg-[#161616] border border-[#222] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          <div className="p-5 bg-white text-black flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-lg">S</div>
              <div>
                <span className="font-syne font-bold block leading-none text-lg">Savage AI</span>
                <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Lead Specialist</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-8 h-8 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-[#0f0f0f]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-white text-black font-medium' : 'bg-[#1e1e1e] text-[#ccc] border border-[#222]'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1e1e1e] p-4 rounded-2xl border border-[#222] flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#555] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#555] rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-[#555] rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-5 border-t border-[#222] bg-[#161616]">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your reply..."
                className="flex-1 bg-black/50 border border-[#222] rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-[#444]"
              />
              <button 
                onClick={handleSend}
                className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 group border-4 border-[#0a0a0a]"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        ) : (
          <svg 
            width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            className="group-hover:rotate-12 transition-transform"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default Assistant;

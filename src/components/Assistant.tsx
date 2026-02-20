'use client';

import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '@/lib/geminiService';
import { useLanguage } from '@/lib/LanguageContext';

interface MessagePart {
  type: 'text' | 'link' | 'shortcut';
  content?: string;
  label?: string;
  url?: string;
}

interface AssistantMessage {
  role: 'user' | 'assistant';
  parts: MessagePart[];
}

interface AssistantProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Assistant: React.FC<AssistantProps> = ({ isOpen, setIsOpen }) => {
  const { t } = useLanguage();
  const [leadId, setLeadId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { 
      role: 'assistant', 
      parts: [
        { type: 'text', content: "Ready to elevate your brand? I'm Savage, your project consultant. How can we bring your vision to life today?" },
        { type: 'shortcut', label: '🚀 Request a Service' },
        { type: 'shortcut', label: '🎨 Logo Design' },
        { type: 'shortcut', label: '🌐 Web Design' },
        { type: 'shortcut', label: '🤖 AI Automation' },
        { type: 'shortcut', label: '💰 Ask for a Quote' }
      ] 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Lead on mount
  useEffect(() => {
    const initLead = async () => {
      try {
        const res = await fetch('/api/leads/init', { method: 'POST' });
        const data = await res.json();
        setLeadId(data.lead_id);
      } catch (err) {
        console.error('Failed to init lead:', err);
      }
    };
    initLead();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customMessage?: string) => {
    const userMessage = customMessage || input;
    if (!userMessage.trim()) return;

    // Build history for the API
    const history = messages.map(m => ({
      role: m.role,
      content: m.parts.map(p => p.content || p.label).join(' ')
    }));

    if (!customMessage) setInput('');
    setMessages(prev => [...prev, { role: 'user', parts: [{ type: 'text', content: userMessage }] }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history, lead_id: leadId }),
      });

      if (!response.ok) throw new Error('API failed');
      const data = await response.json();
      const rawResponse = data.text;
      let parsedResponse: { text: string; suggestions?: string[] };
      
      try {
        parsedResponse = JSON.parse(rawResponse);
      } catch (e) {
        parsedResponse = { text: rawResponse, suggestions: [] };
      }

      const newParts: MessagePart[] = [{ type: 'text', content: parsedResponse.text }];
      if (parsedResponse.suggestions) {
        parsedResponse.suggestions.forEach(s => {
          newParts.push({ type: 'shortcut', label: s });
        });
      }

      setMessages(prev => [...prev, { role: 'assistant', parts: newParts }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'assistant', parts: [{ type: 'text', content: "Connection interrupted. Please email hi@svgvisual.com directly." }] }]);
    }
    setIsTyping(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !leadId) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('lead_id', leadId);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          parts: [{ type: 'text', content: `📎 File "${file.name}" uploaded successfully! I'll include it in your project brief.` }] 
        }]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[70]">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[calc(100vw-32px)] md:w-96 h-[500px] bg-[#161616] border border-[#222] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          <div className="p-5 bg-white text-black flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-lg">SVG</div>
              <div>
                <span className="font-syne font-bold block leading-none text-lg text-black">START YOUR PROJECT</span>
                <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold text-black">SVG Project Consultant</span>
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
                  {m.parts.map((part, partIndex) => {
                    if (part.type === 'text') {
                      return <div key={partIndex}>{part.content}</div>;
                    } else if (part.type === 'link') {
                      return (
                        <a 
                          key={partIndex} 
                          href={part.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block mt-2 px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors text-center font-bold no-underline"
                        >
                          {part.label}
                        </a>
                      );
                    } else if (part.type === 'shortcut') {
                      return (
                        <button
                          key={partIndex}
                          onClick={() => handleSend(part.label)}
                          className="block w-full mt-2 px-4 py-2 bg-black/40 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors text-left text-xs font-medium"
                        >
                          {part.label}
                        </button>
                      );
                    }
                    return null;
                  })}
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
            <div className="flex gap-3 items-center">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || !leadId}
                className="w-10 h-10 flex items-center justify-center text-[#666] hover:text-white transition-colors disabled:opacity-30"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                )}
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your reply..."
                className="flex-1 bg-black/50 border border-[#222] rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-[#444]"
              />
              <button 
                onClick={() => handleSend()}
                className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className="absolute bottom-20 right-0 hidden md:block animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold shadow-2xl relative whitespace-nowrap">
            {t('assistant.invite')}
            <div className="absolute -bottom-1 right-6 w-2 h-2 bg-white rotate-45"></div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all group border-4 border-[#0a0a0a]"
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

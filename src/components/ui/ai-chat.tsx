'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/lib/i18n-context';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME: Record<string, string> = {
  he: 'שלום! אני היועץ הדיגיטלי של סטודיו טליה זלצמן 🤍\n\nאשמח לענות על שאלות לגבי השירותים שלנו, תהליך העבודה, או כל דבר אחר. כיצד אוכל לעזור?',
  en: 'Hello! I\'m the digital advisor for Talya Zaltsman Studio 🤍\n\nI\'m happy to answer your questions about our services, design process, or anything else. How can I help you?',
};

const PLACEHOLDER: Record<string, string> = {
  he: 'כתוב/י שאלה...',
  en: 'Type a question...',
};

const TITLE: Record<string, string> = {
  he: 'יועץ סטודיו',
  en: 'Studio Advisor',
};

const SUBTITLE: Record<string, string> = {
  he: 'טליה זלצמן · אדריכלות פנים',
  en: 'Talya Zaltsman · Interior Architecture',
};

export function AiChat() {
  const locale = useLocale();
  const isHe = locale === 'he';
  const dir = isHe ? 'rtl' : 'ltr';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME[isHe ? 'he' : 'en'] },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Add empty assistant placeholder
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error('Failed to fetch');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: accumulated };
          return updated;
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: isHe ? 'מצטערים, אירעה שגיאה. נסו שוב.' : 'Sorry, something went wrong. Please try again.',
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 start-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink shadow-lg shadow-ink/20 transition-all duration-300 hover:bg-ink/85 hover:shadow-xl hover:shadow-ink/25"
            aria-label={isHe ? 'פתח יועץ AI' : 'Open AI advisor'}
          >
            <MessageCircle size={22} className="text-brass" strokeWidth={1.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            dir={dir}
            className="fixed bottom-6 start-6 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-cream-50 shadow-2xl shadow-ink/15 border border-cream-200"
            style={{ height: 'min(560px, calc(100dvh - 6rem))' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-cream-200 bg-ink px-4 py-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-brass/40 bg-brass/10">
                <Bot size={16} className="text-brass" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] font-medium uppercase tracking-[0.2em] text-cream-100/90"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  {TITLE[isHe ? 'he' : 'en']}
                </p>
                <p
                  className="text-[9px] uppercase tracking-[0.15em] text-cream-100/40"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  {SUBTITLE[isHe ? 'he' : 'en']}
                </p>
              </div>
              <button
                onClick={() => {
                  abortRef.current?.abort();
                  setOpen(false);
                }}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-cream-100/40 transition-colors hover:bg-cream-100/10 hover:text-cream-100"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? (isHe ? 'justify-start' : 'justify-end') : (isHe ? 'justify-end' : 'justify-start')}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-ink text-cream-100 rounded-br-sm'
                        : 'bg-cream-200/60 text-ink rounded-bl-sm'
                    }`}
                    style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem' }}
                  >
                    {msg.content}
                    {msg.role === 'assistant' && msg.content === '' && loading && (
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-cream-200 bg-cream-50 px-3 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={PLACEHOLDER[isHe ? 'he' : 'en']}
                  disabled={loading}
                  className="flex-1 resize-none rounded-xl border border-cream-200 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brass/50 disabled:opacity-50"
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.8rem',
                    minHeight: '40px',
                    maxHeight: '96px',
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ink text-cream-100 transition-all hover:bg-ink/80 disabled:opacity-40"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={15} className={isHe ? 'scale-x-[-1]' : ''} />
                  )}
                </button>
              </div>
              <p
                className="mt-2 text-center text-[8px] uppercase tracking-[0.15em] text-ink/25"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {isHe ? 'מופעל ע"י Claude AI' : 'Powered by Claude AI'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * AIVanConcierge — Embedded Vana widget
 * Used on Videos, Marketplace, Vendors, Shop, and AI pages.
 *
 * Uses the client-side vanaRouter for instant responses + page links.
 * Drop-in replacement for the Supabase edge function version.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { routeVanaQuestion } from '@/lib/vanaRouter';

// Inline SVG van mascot
function VanIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Vana">
      <rect x="4" y="14" width="52" height="26" rx="5" fill="#F97316" />
      <rect x="8" y="8" width="32" height="10" rx="4" fill="#EA580C" />
      <rect x="10" y="10" width="14" height="8" rx="2" fill="#BAE6FD" opacity="0.9" />
      <rect x="28" y="16" width="10" height="8" rx="2" fill="#BAE6FD" opacity="0.9" />
      <rect x="42" y="16" width="8" height="8" rx="2" fill="#BAE6FD" opacity="0.9" />
      <line x1="38" y1="14" x2="38" y2="40" stroke="#EA580C" strokeWidth="1.5" />
      <circle cx="16" cy="40" r="7" fill="#1C1917" />
      <circle cx="16" cy="40" r="3.5" fill="#78716C" />
      <circle cx="48" cy="40" r="7" fill="#1C1917" />
      <circle cx="48" cy="40" r="3.5" fill="#78716C" />
      <rect x="5" y="22" width="4" height="5" rx="1" fill="#FDE68A" />
      <circle cx="22" cy="28" r="1.5" fill="#FFF7ED" />
      <circle cx="30" cy="28" r="1.5" fill="#FFF7ED" />
      <path d="M22 32 Q26 35 30 32" stroke="#FFF7ED" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  page?: string;
  pageLabel?: string;
}

interface AIVanConciergeProps {
  mode?: 'home' | 'full' | 'video' | 'marketplace' | 'mechanic' | 'shop';
  compact?: boolean;
}

const MODE_SUGGESTIONS: Record<string, string[]> = {
  home:        ['Find van lifers near me', 'Best solar setup?', 'Stealth camping tips'],
  full:        ['Find van lifers near me', 'Best solar setup?', 'Stealth camping tips'],
  video:       ['Best van build videos?', 'Solar install guide?', 'Sprinter conversion tips?'],
  marketplace: ['What should I check before buying?', 'How do I list my van?', 'Fair price for a Sprinter?'],
  mechanic:    ['Find a Sprinter mechanic', 'What certifications matter?', 'Common Sprinter issues?'],
  shop:        ['Best power station for van life?', 'What ventilation do I need?', 'Solar panel recommendations?'],
};

const AIVanConcierge: React.FC<AIVanConciergeProps> = ({ mode = 'home', compact = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback((text?: string) => {
    const query = (text ?? input).trim();
    if (!query || loading) return;
    setInput('');

    const userMsg: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    setTimeout(() => {
      const result = routeVanaQuestion(query);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: result.answer, page: result.page, pageLabel: result.pageLabel },
      ]);
      setLoading(false);
    }, 380);
  }, [input, loading]);

  const handleNavigate = useCallback((page: string) => {
    navigate(page);
  }, [navigate]);

  const suggestions = MODE_SUGGESTIONS[mode] ?? MODE_SUGGESTIONS.home;

  return (
    <Card className={`bg-card/60 border border-border/60 ${compact ? '' : 'w-full max-w-2xl mx-auto'}`}>
      <CardContent className={`${compact ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-600/15 border border-orange-500/30">
            <VanIcon size={26} />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">Vana</span>
            <p className="text-xs text-muted-foreground">AI van life guide</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>

        {/* Messages */}
        {messages.length > 0 && (
          <div className={`space-y-3 mb-4 overflow-y-auto ${compact ? 'max-h-48' : 'max-h-72'}`}>
            {messages.map((m, i) => (
              <div key={i} className="flex flex-col">
                <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-orange-600/15 border border-orange-500/20 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <VanIcon size={16} />
                    </div>
                  )}
                  <div className={`rounded-xl px-3 py-2 text-sm max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'
                  }`}>
                    {m.content}
                  </div>
                </div>
                {/* CTA link button */}
                {m.role === 'assistant' && m.page && m.pageLabel && (
                  <button
                    onClick={() => handleNavigate(m.page!)}
                    className="ml-8 mt-1.5 self-start flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-400/50 rounded-full px-3 py-1 transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {m.pageLabel}
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-orange-600/15 border border-orange-500/20 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <VanIcon size={16} />
                </div>
                <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2.5">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Quick suggestions */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-xs bg-background/50 border border-border/60 hover:border-primary/40 hover:text-foreground text-muted-foreground rounded-full px-3 py-1.5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Vana anything..."
            className="flex-1 h-9 text-sm bg-background/60"
            disabled={loading}
            maxLength={500}
          />
          <Button type="submit" size="sm" disabled={loading || !input.trim()} className="h-9 w-9 p-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIVanConcierge;

/**
 * VannaBubble — Floating Vanna AI assistant widget
 * Appears ONLY on the home page (Index.tsx)
 *
 * Uses the client-side vannaRouter for instant, zero-latency responses
 * that link users to the best Vanciety page for their question.
 * When the real AI backend is restored, swap handleSend() to call
 * the edge function and use this as a fallback.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, ExternalLink, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routeVannaQuestion } from "@/lib/vannaRouter";

interface Message {
  role: "user" | "assistant";
  content: string;
  /** Optional CTA link */
  page?: string;
  pageLabel?: string;
}

const GREETING = "Hey there! 👋 I'm Vanna, your Vanciety guide. Ask me anything — stealth camping spots, solar setups, repair help, how to connect with other van lifers, or just where to find things on the site!";

const QUICK_PROMPTS = [
  "How do I find van lifers near me?",
  "Where can I find stealth camping spots?",
  "What's the best solar setup for van life?",
  "How do I post in the community?",
];

// Vanna AI icon — gold Vanciety brand mark
function VannaIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Vanna AI">
      <circle cx="24" cy="24" r="22" fill="#c9a96e" opacity="0.15" />
      <path d="M24 10 L30 22 L42 22 L32 30 L36 42 L24 34 L12 42 L16 30 L6 22 L18 22 Z" fill="#c9a96e" opacity="0.9" />
      <circle cx="24" cy="24" r="5" fill="#0d0d0d" />
      <circle cx="24" cy="24" r="2.5" fill="#c9a96e" />
    </svg>
  );
}

export default function VannaBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Show nudge bubble after 5 seconds on page
  useEffect(() => {
    const t = setTimeout(() => setShowNudge(true), 5000);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      if (!hasGreeted) {
        setMessages([{ role: "assistant", content: GREETING }]);
        setHasGreeted(true);
      }
    }
  }, [isOpen, hasGreeted]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setShowNudge(false);
  }, []);

  const handleSend = useCallback((text?: string) => {
    const query = (text ?? input).trim();
    if (!query || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Simulate a brief "thinking" delay for natural feel
    setTimeout(() => {
      const result = routeVannaQuestion(query);
      const assistantMsg: Message = {
        role: "assistant",
        content: result.answer,
        page: result.page,
        pageLabel: result.pageLabel,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    }, 420);
  }, [input, loading]);

  const handleNavigate = useCallback((page: string) => {
    setIsOpen(false);
    navigate(page);
  }, [navigate]);

  return (
    <>
      <style>{`
        @keyframes vanBounceFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes nudgePop {
          0% { opacity: 0; transform: scale(0.8) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes chatSlideUp {
          0% { opacity: 0; transform: translateY(20px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .vanna-icon-pulse { animation: vanBounceFloat 4s ease-in-out infinite; }
        .vanna-panel-enter { animation: chatSlideUp 0.22s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .nudge-pop { animation: nudgePop 0.3s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      `}</style>

      {/* Floating button + nudge bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Nudge speech bubble */}
        {showNudge && !isOpen && (
          <div
            className="nudge-pop relative text-sm rounded-2xl rounded-br-sm px-4 py-2.5 shadow-xl max-w-[200px] cursor-pointer transition-colors"
            style={{ background: "#1a1a1a", border: "1px solid rgba(201,169,110,0.4)" }}
            onClick={handleOpen}
          >
            <p className="font-semibold" style={{ color: "#c9a96e" }}>Ask Vanna</p>
            <p className="text-xs mt-0.5" style={{ color: "#a89070" }}>Your Vanciety AI guide</p>
            <button
              className="absolute -top-1.5 -right-1.5 rounded-full w-4 h-4 flex items-center justify-center text-xs"
              style={{ background: "#2e2e2e", color: "#888" }}
              onClick={(e) => { e.stopPropagation(); setShowNudge(false); }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Vanna AI button */}
        <button
          onClick={() => isOpen ? setIsOpen(false) : handleOpen()}
          className="relative w-14 h-14 rounded-full hover:scale-105 active:scale-95 transition-all duration-150 flex items-center justify-center"
          style={{ background: "#0d0d0d", border: "2px solid rgba(201,169,110,0.6)", boxShadow: "0 4px 24px rgba(201,169,110,0.2)" }}
          aria-label={isOpen ? "Close Vanna" : "Open Vanna AI assistant"}
        >
          {isOpen ? (
            <ChevronDown className="w-5 h-5" style={{ color: "#c9a96e" }} />
          ) : (
            <VannaIcon size={36} />
          )}
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full" style={{ border: "2px solid #0d0d0d" }} />
        </button>
      </div>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="vanna-panel-enter fixed bottom-28 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          style={{ maxHeight: "min(540px, calc(100vh - 160px))" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#111", borderBottom: "1px solid #2e2e2e" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)" }}>
              <VannaIcon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Vanna</p>
              <p className="text-xs text-amber-400">Your Vanciety guide</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-800"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} w-full`}>
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5" style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)" }}>
                      <VannaIcon size={16} />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm max-w-[82%] leading-relaxed ${
                      m.role === "user"
                        ? "text-white rounded-tr-sm"
                        : "text-gray-100 rounded-tl-sm"
                    }`}
                    style={m.role === "user" ? { background: "#c9a96e", color: "#0d0d0d" } : { background: "#1e1e1e" }}
                  >
                    {m.content}
                  </div>
                </div>
                {/* CTA button for assistant messages with a page link */}
                {m.role === "assistant" && m.page && m.pageLabel && (
                  <button
                    onClick={() => handleNavigate(m.page!)}
                    className="ml-8 mt-1.5 flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1 transition-all"
                    style={{ color: "#c9a96e", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.3)" }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    {m.pageLabel}
                  </button>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5" style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)" }}>
                  <VannaIcon size={16} />
                </div>
                <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-3 py-2.5">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#c9a96e", animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#c9a96e", animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#c9a96e", animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts — only show before first user message */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="text-xs rounded-full px-3 py-1 transition-all"
                  style={{ background: "#1a1a1a", color: "#a89070", border: "1px solid #2e2e2e" }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2 px-3 py-3 border-t border-gray-800 bg-gray-900"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Vanna anything..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
            style={{ outline: "none" }}
              disabled={loading}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
              style={{ background: "#c9a96e" }}
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

/**
 * VannaBubble — Floating Vanna AI assistant widget
 * Appears ONLY on the home page (Index.tsx)
 * Shows an animated van mascot in the bottom-right corner
 * Opens a real AI chat panel powered by the vanciety-ai-concierge Edge Function
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Loader2, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING = "Hey there! 👋 I'm Vanna, your Vanciety guide. Ask me anything — where to find camp spots, how to connect with other van lifers, repair questions, gear advice, or how to get the most out of this site!";

const QUICK_PROMPTS = [
  "How do I find van lifers near me?",
  "Where can I find stealth camping spots?",
  "What's the best solar setup for van life?",
  "How do I post in the community?",
];

// Animated SVG van mascot — cute, friendly, bounces gently
function VanMascot({ size = 48, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={animated ? "van-mascot-bounce" : ""}
      aria-label="Vanna the van mascot"
    >
      {/* Van body */}
      <rect x="4" y="14" width="52" height="26" rx="5" fill="#F97316" />
      {/* Van roof */}
      <rect x="8" y="8" width="32" height="10" rx="4" fill="#EA580C" />
      {/* Windshield */}
      <rect x="10" y="10" width="14" height="8" rx="2" fill="#BAE6FD" opacity="0.9" />
      {/* Side window */}
      <rect x="28" y="16" width="10" height="8" rx="2" fill="#BAE6FD" opacity="0.9" />
      {/* Side window 2 */}
      <rect x="42" y="16" width="8" height="8" rx="2" fill="#BAE6FD" opacity="0.9" />
      {/* Door line */}
      <line x1="38" y1="14" x2="38" y2="40" stroke="#EA580C" strokeWidth="1.5" />
      {/* Wheels */}
      <circle cx="16" cy="40" r="7" fill="#1C1917" />
      <circle cx="16" cy="40" r="3.5" fill="#78716C" />
      <circle cx="48" cy="40" r="7" fill="#1C1917" />
      <circle cx="48" cy="40" r="3.5" fill="#78716C" />
      {/* Headlight */}
      <rect x="5" y="22" width="4" height="5" rx="1" fill="#FDE68A" />
      {/* Smile face on van */}
      <circle cx="22" cy="28" r="1.5" fill="#FFF7ED" />
      <circle cx="30" cy="28" r="1.5" fill="#FFF7ED" />
      <path d="M22 32 Q26 35 30 32" stroke="#FFF7ED" strokeWidth="1.5" strokeLinecap="round" fill="none" />
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

  // Show nudge bubble after 4 seconds on page
  useEffect(() => {
    const t = setTimeout(() => setShowNudge(true), 4000);
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

  const handleSend = useCallback(async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: query }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("vanciety-ai-concierge", {
        body: {
          question: query,
          mode: "home",
          history: newMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        },
      });

      const reply =
        error
          ? "Sorry, I hit a snag — please try again!"
          : (data?.answer ?? "I'm not sure about that one. Try asking in the /campfire!");

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Oops — something went wrong. Try again!" }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <>
      {/* CSS for van bounce animation */}
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
        .van-mascot-bounce {
          animation: vanBounceFloat 3s ease-in-out infinite;
        }
        .vanna-panel-enter {
          animation: chatSlideUp 0.22s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .nudge-pop {
          animation: nudgePop 0.3s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>

      {/* Floating button + nudge bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Nudge speech bubble */}
        {showNudge && !isOpen && (
          <div
            className="nudge-pop bg-gray-900 border border-orange-500/40 text-white text-sm rounded-2xl rounded-br-sm px-4 py-2.5 shadow-xl max-w-[200px] cursor-pointer hover:border-orange-400/70 transition-colors"
            onClick={handleOpen}
          >
            <p className="font-medium text-orange-300">Hi! I'm Vanna 👋</p>
            <p className="text-gray-300 text-xs mt-0.5">Need help finding something?</p>
            <button
              className="absolute -top-1.5 -right-1.5 bg-gray-700 rounded-full w-4 h-4 flex items-center justify-center text-gray-400 hover:text-white text-xs"
              onClick={(e) => { e.stopPropagation(); setShowNudge(false); }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Van mascot button */}
        <button
          onClick={() => isOpen ? setIsOpen(false) : handleOpen()}
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 shadow-lg shadow-orange-900/40 hover:shadow-orange-800/60 hover:scale-105 active:scale-95 transition-all duration-150 flex items-center justify-center border-2 border-orange-400/50"
          aria-label={isOpen ? "Close Vanna" : "Open Vanna AI assistant"}
        >
          {isOpen ? (
            <ChevronDown className="w-6 h-6 text-white" />
          ) : (
            <VanMascot size={44} animated={true} />
          )}
          {/* Online indicator */}
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-orange-700" />
        </button>
      </div>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="vanna-panel-enter fixed bottom-28 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          style={{ maxHeight: "min(520px, calc(100vh - 160px))" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
            <div className="w-8 h-8 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
              <VanMascot size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Vanna</p>
              <p className="text-xs text-green-400">Online — ask me anything</p>
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
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-orange-600/20 border border-orange-500/20 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                    <VanMascot size={16} />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3 py-2 text-sm max-w-[82%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-orange-600 text-white rounded-tr-sm"
                      : "bg-gray-800 text-gray-100 rounded-tl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-orange-600/20 border border-orange-500/20 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <VanMascot size={16} />
                </div>
                <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-3 py-2.5">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 hover:border-orange-500/50 rounded-full px-3 py-1 transition-all"
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
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-colors"
              disabled={loading}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

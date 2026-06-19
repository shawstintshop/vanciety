import { useEffect, useRef } from "react";
import { Mic, MicOff, Phone, PhoneOff, Sparkles, Volume2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVannyVoice } from "@/hooks/useVannyVoice";
import { cn } from "@/lib/utils";

interface VoiceVannyProps {
  /** Compact mode for embedding in other pages */
  compact?: boolean;
}

const stateLabel: Record<string, string> = {
  idle: "Tap to talk to Vanny",
  connecting: "Connecting…",
  listening: "Listening — speak now",
  speaking: "Vanny is speaking…",
  error: "Connection error",
};

const stateColor: Record<string, string> = {
  idle: "text-muted-foreground",
  connecting: "text-primary-glow animate-pulse",
  listening: "text-secondary",
  speaking: "text-accent",
  error: "text-destructive",
};

const VoiceVanny = ({ compact = false }: VoiceVannyProps) => {
  const { state, messages, transcript, error, isSupported, connect, disconnect, clearMessages } =
    useVannyVoice();

  const scrollRef = useRef<HTMLDivElement>(null);
  const isActive = state !== "idle" && state !== "error";

  // Auto-scroll messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, transcript]);

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Voice chat requires a browser with WebRTC support (Chrome, Edge, or Safari 15+).
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-border/80 bg-card/80 backdrop-blur transition-all duration-300",
        compact ? "gap-3 p-4" : "gap-4 p-5 md:p-6",
        isActive && "border-primary/40 shadow-[0_0_32px_rgba(var(--primary-rgb),.12)]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Animated orb */}
          <div
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-500",
              state === "idle" && "bg-primary/15 ring-1 ring-primary/30",
              state === "connecting" && "bg-primary/20 ring-2 ring-primary/50 animate-pulse",
              state === "listening" && "bg-secondary/15 ring-2 ring-secondary/60",
              state === "speaking" && "bg-accent/15 ring-2 ring-accent/60 animate-pulse",
              state === "error" && "bg-destructive/15 ring-1 ring-destructive/40"
            )}
          >
            {state === "speaking" ? (
              <Volume2 className="h-4 w-4 text-accent" />
            ) : state === "error" ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <Sparkles className={cn("h-4 w-4", state === "listening" ? "text-secondary" : "text-primary-glow")} />
            )}
            {/* Listening pulse rings */}
            {state === "listening" && (
              <>
                <span className="absolute inset-0 animate-ping rounded-full bg-secondary/25" />
                <span className="absolute -inset-1 animate-ping rounded-full bg-secondary/10 animation-delay-150" />
              </>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">Vanny</span>
              <Badge
                variant="outline"
                className="h-4 border-primary/30 px-1.5 text-[10px] text-primary-glow"
              >
                Voice AI
              </Badge>
            </div>
            <p className={cn("text-xs transition-colors", stateColor[state])}>
              {stateLabel[state]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && !isActive && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={clearMessages}
            >
              Clear
            </Button>
          )}
          <Button
            variant={isActive ? "destructive" : "hero"}
            size={compact ? "sm" : "default"}
            onClick={isActive ? disconnect : connect}
            disabled={state === "connecting"}
            className="gap-2"
          >
            {isActive ? (
              <>
                <PhoneOff className="h-4 w-4" />
                {!compact && "End"}
              </>
            ) : (
              <>
                <Phone className="h-4 w-4" />
                {!compact && "Talk to Vanny"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-3 py-2.5 text-xs text-destructive">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Conversation */}
      {(messages.length > 0 || transcript) && (
        <div
          ref={scrollRef}
          className={cn(
            "flex flex-col gap-2 overflow-y-auto rounded-xl border border-border/60 bg-background/50 p-3",
            compact ? "max-h-40" : "max-h-64"
          )}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2 text-sm",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary/15 text-foreground"
                    : "bg-card border border-border/60 text-foreground/90"
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Live transcript while speaking */}
          {transcript && (
            <div className="flex justify-start gap-2 text-sm">
              <div className="max-w-[85%] rounded-2xl border border-secondary/30 bg-secondary/8 px-3 py-2 italic leading-relaxed text-foreground/70">
                {transcript}
                <span className="ml-1 inline-block h-3 w-0.5 animate-pulse bg-secondary/60" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Idle prompt suggestions */}
      {state === "idle" && messages.length === 0 && !compact && (
        <div className="flex flex-wrap gap-2">
          {[
            "Where should I camp near Bend?",
            "My Sprinter has a P0401 code",
            "Best Victron setup for a 200Ah build?",
            "What van events are coming up?",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={connect}
              className="rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs text-foreground/65 transition hover:border-primary/50 hover:bg-primary/8 hover:text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Mic indicator when active */}
      {isActive && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          {state === "listening" ? (
            <Mic className="h-3 w-3 text-secondary" />
          ) : (
            <MicOff className="h-3 w-3" />
          )}
          <span>
            {state === "listening"
              ? "Mic active — speak naturally"
              : state === "speaking"
              ? "Vanny is responding"
              : "Processing…"}
          </span>
        </div>
      )}
    </div>
  );
};

export default VoiceVanny;

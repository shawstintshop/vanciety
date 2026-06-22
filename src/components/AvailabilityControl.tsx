/**
 * AvailabilityControl — Do Not Disturb + Soft Availability Signal
 *
 * Design: privacy-first, introvert-safe
 * - DND toggle with auto-expire options (2h / 8h / 24h / until I turn it off)
 * - Soft signal: ☀️ Open / 🌙 Resting / 🚐 On the road
 * - No live tracking — user sets manually
 * - Read receipts toggle (off by default)
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BellOff, ChevronDown, Eye, EyeOff, Sun, Moon, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AvailabilitySignal = "open" | "resting" | "on_the_road" | null;

const SIGNALS: {
  value: AvailabilitySignal;
  label: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    value: "open",
    label: "Open to chat",
    emoji: "☀️",
    icon: Sun,
    description: "Happy to receive a wave or quick message",
  },
  {
    value: "resting",
    label: "Resting",
    emoji: "🌙",
    icon: Moon,
    description: "Taking a break — no rush to respond",
  },
  {
    value: "on_the_road",
    label: "On the road",
    emoji: "🚐",
    icon: Truck,
    description: "Driving — will check messages later",
  },
];

const DND_DURATIONS = [
  { label: "2 hours", hours: 2 },
  { label: "8 hours", hours: 8 },
  { label: "24 hours", hours: 24 },
  { label: "Until I turn it off", hours: null },
];

interface Props {
  compact?: boolean;
  className?: string;
}

export function AvailabilityControl({ compact = false, className }: Props) {
  const { user } = useAuth();
  const [signal, setSignal] = useState<AvailabilitySignal>(null);
  const [dndUntil, setDndUntil] = useState<string | null>(null);
  const [readReceipts, setReadReceipts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const isDnd = dndUntil ? new Date(dndUntil) > new Date() : false;

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("availability_signal, dnd_until, read_receipts_enabled")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setSignal((data.availability_signal as AvailabilitySignal) ?? null);
          setDndUntil(data.dnd_until ?? null);
          setReadReceipts(data.read_receipts_enabled ?? false);
        }
      });
  }, [user]);

  const saveSignal = async (newSignal: AvailabilitySignal) => {
    if (!user) return;
    setSignal(newSignal);
    await supabase
      .from("profiles")
      .update({ availability_signal: newSignal })
      .eq("user_id", user.id);
  };

  const enableDnd = async (hours: number | null) => {
    if (!user) return;
    setLoading(true);
    const until = hours
      ? new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
      : new Date("2099-01-01").toISOString();
    setDndUntil(until);
    await supabase
      .from("profiles")
      .update({ dnd_until: until })
      .eq("user_id", user.id);
    setLoading(false);
    toast.success(
      hours ? `Do Not Disturb on for ${hours}h` : "Do Not Disturb on — turn off manually",
      { description: "Waves and messages are silenced." }
    );
  };

  const disableDnd = async () => {
    if (!user) return;
    setDndUntil(null);
    await supabase
      .from("profiles")
      .update({ dnd_until: null })
      .eq("user_id", user.id);
    toast.success("Do Not Disturb off");
  };

  const toggleReadReceipts = async (val: boolean) => {
    if (!user) return;
    setReadReceipts(val);
    await supabase
      .from("profiles")
      .update({ read_receipts_enabled: val })
      .eq("user_id", user.id);
    toast.success(val ? "Read receipts on" : "Read receipts off — no one can see when you've read a message");
  };

  const currentSignal = SIGNALS.find((s) => s.value === signal);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {/* DND pill */}
        {isDnd ? (
          <button
            onClick={disableDnd}
            className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400 ring-1 ring-amber-500/30 hover:bg-amber-500/30 transition-colors"
          >
            <BellOff className="h-3 w-3" />
            DND on
          </button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/60 hover:bg-card hover:text-foreground transition-colors">
                <BellOff className="h-3 w-3" />
                DND
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 border-border bg-popover text-popover-foreground">
              {DND_DURATIONS.map((d) => (
                <DropdownMenuItem key={d.label} onClick={() => enableDnd(d.hours)}>
                  {d.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Signal pill */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/60 hover:bg-card hover:text-foreground transition-colors">
              <span>{currentSignal?.emoji ?? "—"}</span>
              <span>{currentSignal?.label ?? "Set status"}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 border-border bg-popover text-popover-foreground">
            {SIGNALS.map((s) => (
              <DropdownMenuItem key={s.value} onClick={() => saveSignal(s.value)}>
                <span className="mr-2 text-base">{s.emoji}</span>
                <div>
                  <div className="font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.description}</div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => saveSignal(null)}>
              Clear status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Full panel version
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2 text-foreground", className)}>
          {isDnd ? (
            <><BellOff className="h-4 w-4 text-amber-400" /> DND On</>
          ) : (
            <><span className="text-base">{currentSignal?.emoji ?? "—"}</span> {currentSignal?.label ?? "Set status"}</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-border bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Your Availability</DialogTitle>
          <DialogDescription>
            You control when and how people can reach you. No pressure, no notifications unless you want them.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Do Not Disturb */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Do Not Disturb</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Silences all waves and messages. No explanation needed.
                </p>
              </div>
              {isDnd && (
                <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-xs">
                  Active
                </Badge>
              )}
            </div>
            {isDnd ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-amber-500/40 text-amber-400 hover:border-amber-500 hover:bg-amber-500/10"
                onClick={disableDnd}
              >
                <BellOff className="mr-2 h-4 w-4" />
                Turn Off Do Not Disturb
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {DND_DURATIONS.map((d) => (
                  <Button
                    key={d.label}
                    variant="outline"
                    size="sm"
                    className="text-foreground/80 hover:text-foreground"
                    onClick={() => enableDnd(d.hours)}
                    disabled={loading}
                  >
                    {d.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Soft Availability Signal */}
          <div>
            <p className="mb-3 font-semibold text-sm">Soft Signal</p>
            <div className="space-y-2">
              {SIGNALS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => saveSignal(s.value)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                    signal === s.value
                      ? "border-primary/60 bg-primary/10 text-foreground"
                      : "border-border/60 bg-card/40 text-muted-foreground hover:border-border hover:bg-card/80 hover:text-foreground"
                  )}
                >
                  <span className="text-xl">{s.emoji}</span>
                  <div>
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </button>
              ))}
              {signal && (
                <button
                  onClick={() => saveSignal(null)}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  Clear signal
                </button>
              )}
            </div>
          </div>

          {/* Read Receipts */}
          <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-card/40 px-4 py-3">
            <div>
              <Label htmlFor="read-receipts" className="font-semibold text-sm cursor-pointer">
                Read Receipts
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Off by default — no one sees when you've read a message.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {readReceipts ? (
                <Eye className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch
                id="read-receipts"
                checked={readReceipts}
                onCheckedChange={toggleReadReceipts}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AvailabilityControl;

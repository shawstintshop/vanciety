/**
 * TripJournals — Async Travel Logs
 *
 * Design: introvert-safe async storytelling
 * - Write and share travel logs after the fact (no live location)
 * - Single emoji reactions only (no comment threads unless enabled per post)
 * - Comments off by default
 * - Author controls reactions_enabled and comments_enabled per post
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Plus, MapPin, Clock, ArrowLeft, Loader2, Smile } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

const QUICK_REACTIONS = ["👍", "❤️", "🔥", "🙌", "🚐", "💯", "🌄", "✨"];
const COVER_EMOJIS = ["🚐", "🏕️", "🌄", "🌙", "🗺️", "🔥", "🌊", "⛰️", "🌵", "🌿"];

type Journal = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  location_label: string | null;
  cover_emoji: string | null;
  reactions_enabled: boolean;
  comments_enabled: boolean;
  created_at: string;
  profiles?: { display_name: string | null } | null;
};

type Reaction = {
  id: string;
  user_id: string;
  emoji: string;
};

export default function TripJournals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [selected, setSelected] = useState<Journal | null>(null);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newJournal, setNewJournal] = useState({
    title: "",
    body: "",
    location_label: "",
    cover_emoji: "🚐",
    reactions_enabled: true,
    comments_enabled: false,
  });

  const fetchJournals = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("trip_journals")
      .select("*, profiles(display_name)")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(50);
    setJournals((data as Journal[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchJournals(); }, [fetchJournals]);

  const fetchReactions = async (journalId: string) => {
    const { data } = await supabase
      .from("journal_reactions")
      .select("id, user_id, emoji")
      .eq("journal_id", journalId);
    setReactions((data as Reaction[]) ?? []);
    if (user) {
      const mine = (data as Reaction[])?.find((r) => r.user_id === user.id);
      setMyReaction(mine?.emoji ?? null);
    }
  };

  const openJournal = (j: Journal) => {
    setSelected(j);
    if (j.reactions_enabled) fetchReactions(j.id);
  };

  const react = async (emoji: string) => {
    if (!user) { navigate("/auth"); return; }
    if (!selected) return;
    if (myReaction === emoji) {
      // remove reaction
      await supabase
        .from("journal_reactions")
        .delete()
        .eq("journal_id", selected.id)
        .eq("user_id", user.id);
      setMyReaction(null);
      setReactions((r) => r.filter((x) => x.user_id !== user.id));
    } else {
      // upsert reaction
      await supabase.from("journal_reactions").upsert({
        journal_id: selected.id,
        user_id: user.id,
        emoji,
      }, { onConflict: "journal_id,user_id" });
      setMyReaction(emoji);
      setReactions((r) => {
        const filtered = r.filter((x) => x.user_id !== user.id);
        return [...filtered, { id: "temp", user_id: user.id, emoji }];
      });
    }
  };

  const submitJournal = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!newJournal.title.trim() || !newJournal.body.trim()) {
      toast.error("Title and body are required");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("trip_journals").insert({
      user_id: user.id,
      title: newJournal.title.trim(),
      body: newJournal.body.trim(),
      location_label: newJournal.location_label.trim() || null,
      cover_emoji: newJournal.cover_emoji,
      reactions_enabled: newJournal.reactions_enabled,
      comments_enabled: newJournal.comments_enabled,
    });
    if (error) {
      toast.error("Couldn't save journal");
    } else {
      toast.success("Journal posted 📖");
      setCreateOpen(false);
      setNewJournal({ title: "", body: "", location_label: "", cover_emoji: "🚐", reactions_enabled: true, comments_enabled: false });
      fetchJournals();
    }
    setSubmitting(false);
  };

  // Aggregate reactions by emoji
  const reactionCounts = reactions.reduce<Record<string, number>>((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] ?? 0) + 1;
    return acc;
  }, {});

  const initials = (name: string | null | undefined) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div className="min-h-screen bg-background text-foreground topo-card">
      <Header />
      <div className="container mx-auto max-w-3xl px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Trip Journals</h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-lg">
              Stories from the road — posted after the fact. No live location, no pressure. Just real experiences.
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0 gap-2">
                <Plus className="h-4 w-4" />
                Write
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg border-border bg-card text-card-foreground">
              <DialogHeader>
                <DialogTitle>Write a journal entry</DialogTitle>
                <DialogDescription>
                  Share a story from the road. No exact location required — just a city or region if you want.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>Cover emoji</Label>
                  <div className="flex flex-wrap gap-2">
                    {COVER_EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => setNewJournal((j) => ({ ...j, cover_emoji: e }))}
                        className={cn(
                          "rounded-lg px-2.5 py-1.5 text-xl transition-all",
                          newJournal.cover_emoji === e
                            ? "bg-primary/20 ring-2 ring-primary/60"
                            : "bg-card/40 hover:bg-card/80"
                        )}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="j-title">Title</Label>
                  <Input
                    id="j-title"
                    placeholder="Give it a title..."
                    value={newJournal.title}
                    onChange={(e) => setNewJournal((j) => ({ ...j, title: e.target.value }))}
                    maxLength={120}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="j-location">Location (optional)</Label>
                  <Input
                    id="j-location"
                    placeholder="e.g. Somewhere in Montana"
                    value={newJournal.location_label}
                    onChange={(e) => setNewJournal((j) => ({ ...j, location_label: e.target.value }))}
                    maxLength={100}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="j-body">Story</Label>
                  <Textarea
                    id="j-body"
                    placeholder="What happened? What did you learn? What surprised you?"
                    value={newJournal.body}
                    onChange={(e) => setNewJournal((j) => ({ ...j, body: e.target.value }))}
                    maxLength={5000}
                    rows={6}
                    className="bg-background resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">{newJournal.body.length}/5000</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="j-reactions" className="cursor-pointer text-sm">Allow emoji reactions</Label>
                    <Switch
                      id="j-reactions"
                      checked={newJournal.reactions_enabled}
                      onCheckedChange={(v) => setNewJournal((j) => ({ ...j, reactions_enabled: v }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="j-comments" className="cursor-pointer text-sm">Allow comments</Label>
                    <Switch
                      id="j-comments"
                      checked={newJournal.comments_enabled}
                      onCheckedChange={(v) => setNewJournal((j) => ({ ...j, comments_enabled: v }))}
                    />
                  </div>
                </div>
                <Button className="w-full" onClick={submitJournal} disabled={submitting}>
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Publish Journal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {selected ? (
          /* Journal detail */
          <div>
            <button
              onClick={() => setSelected(null)}
              className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to journals
            </button>

            <div className="rounded-2xl border border-border/60 bg-card/40 p-7">
              <div className="mb-5 flex items-start gap-4">
                <span className="text-5xl">{selected.cover_emoji ?? "🚐"}</span>
                <div>
                  <h2 className="text-2xl font-bold leading-tight">{selected.title}</h2>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-[8px] bg-primary/20 text-primary-glow">
                          {initials(selected.profiles?.display_name)}
                        </AvatarFallback>
                      </Avatar>
                      {selected.profiles?.display_name ?? "Member"}
                    </span>
                    {selected.location_label && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selected.location_label}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(selected.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{selected.body}</p>

              {/* Reactions */}
              {selected.reactions_enabled && (
                <div className="mt-6 border-t border-border/40 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {/* Existing reaction counts */}
                    {Object.entries(reactionCounts).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        onClick={() => react(emoji)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ring-1 transition-all",
                          myReaction === emoji
                            ? "bg-primary/20 ring-primary/60 text-foreground"
                            : "bg-card/40 ring-border/40 text-muted-foreground hover:ring-border hover:text-foreground"
                        )}
                      >
                        <span>{emoji}</span>
                        <span className="text-xs font-medium">{count}</span>
                      </button>
                    ))}
                    {/* Add reaction picker */}
                    <div className="relative group">
                      <button className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm ring-1 ring-border/40 bg-card/40 text-muted-foreground hover:ring-border hover:text-foreground transition-all">
                        <Smile className="h-3.5 w-3.5" />
                      </button>
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex gap-1 rounded-xl border border-border bg-popover p-2 shadow-lg z-10">
                        {QUICK_REACTIONS.map((e) => (
                          <button
                            key={e}
                            onClick={() => react(e)}
                            className="rounded-lg p-1.5 text-lg hover:bg-accent transition-colors"
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Journal list */
          <div>
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : journals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-primary/40" />
                <p className="text-muted-foreground text-sm">No journals yet.</p>
                <p className="text-muted-foreground text-xs mt-1">Write the first one — share a story from the road.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {journals.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => openJournal(j)}
                    className="w-full text-left rounded-2xl border border-border/50 bg-card/30 px-6 py-5 hover:border-border hover:bg-card/60 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl shrink-0">{j.cover_emoji ?? "🚐"}</span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base mb-1 group-hover:text-primary-glow transition-colors line-clamp-1">
                          {j.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{j.body}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>{j.profiles?.display_name ?? "Member"}</span>
                          {j.location_label && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {j.location_label}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(j.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

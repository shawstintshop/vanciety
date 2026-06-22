/**
 * Campfire — Async Community Boards
 *
 * Design: introvert-safe async boards
 * - No live chat, no pressure to respond immediately
 * - Topic boards: solo tips, stealth camping, gear reviews, van builds, routes, mental health, newbie, general
 * - Post + reply on your own schedule
 * - Single emoji reactions only (no comment threads unless enabled per post)
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Flame, Plus, MessageSquare, Clock, ChevronRight, ArrowLeft, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

type Board = {
  id: string;
  label: string;
  emoji: string;
  description: string;
};

const BOARDS: Board[] = [
  { id: "solo_tips", label: "Solo Tips", emoji: "🏕️", description: "Tricks for thriving alone on the road" },
  { id: "stealth_camping", label: "Stealth Camping", emoji: "🌙", description: "Finding safe, quiet spots" },
  { id: "gear_reviews", label: "Gear Reviews", emoji: "🔧", description: "Honest reviews, no fluff" },
  { id: "van_builds", label: "Van Builds", emoji: "🚐", description: "Build inspiration and advice" },
  { id: "routes", label: "Routes", emoji: "🗺️", description: "Where to go, what to skip" },
  { id: "mental_health", label: "Mental Health", emoji: "🌿", description: "The real talk — loneliness, anxiety, PTSD, joy" },
  { id: "newbie", label: "Newbie Corner", emoji: "🌱", description: "No dumb questions here" },
  { id: "general", label: "General", emoji: "💬", description: "Everything else" },
];

const QUICK_REACTIONS = ["👍", "❤️", "🔥", "🙌", "🚐", "💯"];

type Post = {
  id: string;
  user_id: string;
  board: string;
  title: string;
  body: string;
  reply_count: number;
  created_at: string;
  profiles?: { display_name: string | null; avatar_url: string | null } | null;
};

type Reply = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles?: { display_name: string | null } | null;
};

export default function Campfire() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeBoard, setActiveBoard] = useState<string>("general");
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", board: "general" });
  const [newReply, setNewReply] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("campfire_posts")
      .select("*, profiles(display_name, avatar_url)")
      .eq("board", activeBoard)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(40);
    setPosts((data as Post[]) ?? []);
    setLoading(false);
  }, [activeBoard]);

  useEffect(() => {
    fetchPosts();
    setSelectedPost(null);
  }, [fetchPosts]);

  const fetchReplies = async (postId: string) => {
    setReplyLoading(true);
    const { data } = await supabase
      .from("campfire_replies")
      .select("*, profiles(display_name)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    setReplies((data as Reply[]) ?? []);
    setReplyLoading(false);
  };

  const openPost = (post: Post) => {
    setSelectedPost(post);
    fetchReplies(post.id);
  };

  const submitPost = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!newPost.title.trim() || !newPost.body.trim()) {
      toast.error("Title and body are required");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("campfire_posts").insert({
      user_id: user.id,
      board: newPost.board,
      title: newPost.title.trim(),
      body: newPost.body.trim(),
    });
    if (error) {
      toast.error("Couldn't post — try again");
    } else {
      toast.success("Posted to the campfire 🔥");
      setCreateOpen(false);
      setNewPost({ title: "", body: "", board: activeBoard });
      if (newPost.board === activeBoard) fetchPosts();
    }
    setSubmitting(false);
  };

  const submitReply = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!selectedPost || !newReply.trim()) return;
    const { error } = await supabase.from("campfire_replies").insert({
      post_id: selectedPost.id,
      user_id: user.id,
      body: newReply.trim(),
    });
    if (error) {
      toast.error("Couldn't send reply");
    } else {
      setNewReply("");
      fetchReplies(selectedPost.id);
      // bump reply count locally
      setSelectedPost((p) => p ? { ...p, reply_count: p.reply_count + 1 } : p);
    }
  };

  const initials = (name: string | null | undefined) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  const currentBoard = BOARDS.find((b) => b.id === activeBoard);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="container mx-auto max-w-5xl px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Flame className="h-7 w-7 text-orange-400" />
              <h1 className="text-3xl font-bold tracking-tight">Campfire</h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-lg">
              Async community boards — post and reply on your own schedule. No live chat, no pressure.
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0 gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg border-border bg-card text-card-foreground">
              <DialogHeader>
                <DialogTitle>Start a conversation</DialogTitle>
                <DialogDescription>
                  Write something useful, honest, or just real. No performance required.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="post-board">Board</Label>
                  <Select value={newPost.board} onValueChange={(v) => setNewPost((p) => ({ ...p, board: v }))}>
                    <SelectTrigger id="post-board" className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BOARDS.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.emoji} {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="post-title">Title</Label>
                  <Input
                    id="post-title"
                    placeholder="What's on your mind?"
                    value={newPost.title}
                    onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                    maxLength={120}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="post-body">Body</Label>
                  <Textarea
                    id="post-body"
                    placeholder="Share the full story, tip, or question..."
                    value={newPost.body}
                    onChange={(e) => setNewPost((p) => ({ ...p, body: e.target.value }))}
                    maxLength={3000}
                    rows={5}
                    className="bg-background resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">{newPost.body.length}/3000</p>
                </div>
                <Button className="w-full" onClick={submitPost} disabled={submitting}>
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Post to Campfire
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          {/* Board sidebar */}
          <nav className="space-y-1">
            {BOARDS.map((b) => (
              <button
                key={b.id}
                onClick={() => { setActiveBoard(b.id); setSelectedPost(null); }}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-all",
                  activeBoard === b.id
                    ? "bg-primary/15 text-primary-glow font-medium"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                )}
              >
                <span className="text-base shrink-0">{b.emoji}</span>
                <span>{b.label}</span>
              </button>
            ))}
          </nav>

          {/* Main content */}
          <div>
            {selectedPost ? (
              /* Post detail + replies */
              <div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to {currentBoard?.label}
                </button>

                <div className="rounded-2xl border border-border/60 bg-card/40 p-6 mb-4">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary-glow text-xs">
                        {initials(selectedPost.profiles?.display_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{selectedPost.profiles?.display_name ?? "Member"}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(selectedPost.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mb-3">{selectedPost.title}</h2>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{selectedPost.body}</p>
                </div>

                {/* Replies */}
                <div className="space-y-3 mb-4">
                  {replyLoading ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : replies.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-6">
                      No replies yet — be the first to respond.
                    </p>
                  ) : (
                    replies.map((r) => (
                      <div key={r.id} className="flex gap-3 rounded-xl border border-border/40 bg-card/20 px-4 py-3">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback className="bg-secondary/20 text-secondary text-xs">
                            {initials(r.profiles?.display_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">{r.profiles?.display_name ?? "Member"}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/90 whitespace-pre-wrap">{r.body}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Reply box */}
                {user ? (
                  <div className="flex gap-3">
                    <Textarea
                      placeholder="Reply on your own time — no pressure..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      maxLength={1000}
                      rows={3}
                      className="bg-card/40 resize-none flex-1"
                    />
                    <Button
                      size="icon"
                      className="self-end shrink-0"
                      onClick={submitReply}
                      disabled={!newReply.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
                    Sign in to reply
                  </Button>
                )}
              </div>
            ) : (
              /* Post list */
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-2xl">{currentBoard?.emoji}</span>
                  <div>
                    <h2 className="font-bold text-lg">{currentBoard?.label}</h2>
                    <p className="text-xs text-muted-foreground">{currentBoard?.description}</p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center">
                    <Flame className="mx-auto mb-3 h-8 w-8 text-orange-400/40" />
                    <p className="text-muted-foreground text-sm">No posts yet in this board.</p>
                    <p className="text-muted-foreground text-xs mt-1">Be the first to start a conversation.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {posts.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => openPost(post)}
                        className="w-full text-left rounded-xl border border-border/50 bg-card/30 px-5 py-4 hover:border-border hover:bg-card/60 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm mb-1 group-hover:text-primary-glow transition-colors line-clamp-1">
                              {post.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {post.body}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-foreground transition-colors" />
                        </div>
                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post.reply_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                          <span>{post.profiles?.display_name ?? "Member"}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

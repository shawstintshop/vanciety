/**
 * Member Tips — Weekly Community Knowledge Share
 *
 * Van lifers sharing local knowledge, tips, and experience with the community.
 * No matching, no dating language — pure community wisdom sharing.
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, Users, CheckCircle2, Loader2, RefreshCw, Compass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format, startOfISOWeek, addDays } from "date-fns";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { useNavigate } from "react-router-dom";

// Weekly questions — all about sharing van life knowledge and local tips
const WEEKLY_QUESTIONS = [
  "What's a hidden camping spot you'd share with a fellow Vanciety member passing through your area?",
  "What's the best local diner or food spot near where you're parked right now?",
  "What road or route would you warn other van lifers to avoid — and why?",
  "What's one piece of advice you'd give someone new to van life in your region?",
  "What's a free overnight spot you've used that most people don't know about?",
  "What's the best truck stop, rest area, or Walmart lot you've slept at?",
  "What's a local mechanic or shop you'd trust with your van — and where are they?",
  "What's the most useful thing a local member ever told you when you were passing through?",
  "What's a state or national forest road that's worth the drive?",
  "What's a city or town that's surprisingly van-life friendly?",
  "What's a spot to avoid for stealth camping and why?",
  "What's the best dump station, water fill, or propane spot in your area?",
];

function getWeekKey(date: Date = new Date()): string {
  const monday = startOfISOWeek(date);
  return format(monday, "yyyy-'W'II");
}

function getWeekQuestion(weekKey: string): string {
  let hash = 0;
  for (let i = 0; i < weekKey.length; i++) {
    hash = (hash * 31 + weekKey.charCodeAt(i)) % WEEKLY_QUESTIONS.length;
  }
  return WEEKLY_QUESTIONS[Math.abs(hash) % WEEKLY_QUESTIONS.length];
}

function getNextMonday(): Date {
  const now = new Date();
  const monday = startOfISOWeek(now);
  return addDays(monday, 7);
}

type SpotlightAnswer = {
  id: string;
  user_id: string;
  week_key: string;
  question: string;
  answer: string;
  is_opted_in: boolean;
  created_at: string;
  profiles?: { display_name: string | null } | null;
};

export default function Icebreaker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const weekKey = getWeekKey();
  const question = getWeekQuestion(weekKey);
  const nextMonday = getNextMonday();

  const [myAnswer, setMyAnswer] = useState<SpotlightAnswer | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [communityAnswers, setCommunityAnswers] = useState<SpotlightAnswer[]>([]);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [totalAnswers, setTotalAnswers] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("icebreaker_answers")
      .select("*, profiles(display_name)")
      .eq("user_id", user.id)
      .eq("week_key", weekKey)
      .maybeSingle()
      .then(({ data }) => {
        setMyAnswer(data as SpotlightAnswer | null);
        if (data) setAnswerText(data.answer);
        setLoading(false);
      });

    supabase
      .from("icebreaker_answers")
      .select("id", { count: "exact", head: true })
      .eq("week_key", weekKey)
      .eq("is_opted_in", true)
      .then(({ count }) => setTotalAnswers(count ?? 0));
  }, [user, weekKey]);

  const submitAnswer = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!answerText.trim()) { toast.error("Share something with the community first"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("icebreaker_answers").upsert({
      user_id: user.id,
      week_key: weekKey,
      question,
      answer: answerText.trim(),
      is_opted_in: true,
    }, { onConflict: "user_id,week_key" });
    if (error) {
      toast.error("Couldn't save your tip");
    } else {
      toast.success("Your local knowledge is now shared with the community 🚐");
      const { data } = await supabase
        .from("icebreaker_answers")
        .select("*, profiles(display_name)")
        .eq("user_id", user.id)
        .eq("week_key", weekKey)
        .maybeSingle();
      setMyAnswer(data as SpotlightAnswer | null);
    }
    setSubmitting(false);
  };

  const loadCommunityAnswers = async () => {
    setAnswersLoading(true);
    const { data } = await supabase
      .from("icebreaker_answers")
      .select("*, profiles(display_name)")
      .eq("week_key", weekKey)
      .eq("is_opted_in", true)
      .neq("user_id", user?.id ?? "")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!data || data.length === 0) {
      toast.info("No community tips yet this week — be the first to share!");
    } else {
      setCommunityAnswers(data as SpotlightAnswer[]);
    }
    setAnswersLoading(false);
  };

  const initials = (name: string | null | undefined) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "VL";

  return (
    <div className="min-h-screen bg-background text-foreground topo-card">
      <Header />

      {/* Hero */}
      <HeroSection image="/images/vans-neighborhood-meetup.jpg" badge="Member Tips" title="One question." accent="Real local knowledge." subtitle="Every week the Vanciety community answers a single question." />

      <div className="container mx-auto max-w-2xl px-4 pt-12 pb-16">

        {/* Week info */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="border-orange-500/40 text-orange-400 gap-1.5">
            <Clock className="h-3 w-3" />
            Week of {format(startOfISOWeek(new Date()), "MMM d")}
          </Badge>
          <Badge variant="outline" className="border-border/60 text-muted-foreground gap-1.5">
            <Users className="h-3 w-3" />
            {totalAnswers} {totalAnswers === 1 ? "member" : "members"} shared this week
          </Badge>
          <span className="text-xs text-muted-foreground">
            New question {format(nextMonday, "EEE, MMM d")}
          </span>
        </div>

        {/* Question card */}
        <div className="mb-6 rounded-2xl border border-orange-500/30 bg-orange-500/5 px-6 py-5">
          <p className="text-xs font-medium text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            This week's community question
          </p>
          <p className="text-xl font-bold leading-snug">{question}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-dashed border-border/60 py-12 text-center">
            <Compass className="mx-auto mb-3 h-8 w-8 text-orange-400/40" />
            <p className="text-muted-foreground text-sm mb-2 font-medium">Members only</p>
            <p className="text-muted-foreground text-xs mb-4 max-w-xs mx-auto">
              Sign in to share your local knowledge and read tips from other van lifers in the community.
            </p>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </div>
        ) : myAnswer ? (
          /* Already shared */
          <div className="space-y-4">
            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <p className="font-semibold text-sm text-green-400">Your tip is live this week</p>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{myAnswer.answer}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Other members passing through your area can see this. Thank you for sharing.
              </p>
            </div>

            {/* Edit */}
            <div className="rounded-xl border border-border/40 bg-card/30 px-5 py-4">
              <p className="text-sm font-medium mb-3">Update your tip</p>
              <Textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                maxLength={300}
                rows={3}
                className="bg-background resize-none mb-3"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{answerText.length}/300</span>
                <Button size="sm" onClick={submitAnswer} disabled={submitting}>
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Update Tip
                </Button>
              </div>
            </div>

            {/* Read community tips */}
            <div className="rounded-2xl border border-border/50 bg-card/30 px-6 py-5">
              <p className="font-semibold text-sm mb-1">What other members shared</p>
              <p className="text-xs text-muted-foreground mb-4">
                Real tips from van lifers across the country — spots, routes, warnings, and local knowledge.
              </p>

              {communityAnswers.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {communityAnswers.map((a) => (
                    <div key={a.id} className="rounded-xl border border-border/40 bg-background/50 px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-orange-500/20 text-orange-400 text-xs">
                            {initials(a.profiles?.display_name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium">{a.profiles?.display_name ?? "Vanciety Member"}</p>
                      </div>
                      <p className="text-sm text-foreground/85 whitespace-pre-wrap">{a.answer}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              <Button
                variant={communityAnswers.length > 0 ? "outline" : "default"}
                className="w-full gap-2"
                onClick={loadCommunityAnswers}
                disabled={answersLoading}
              >
                {answersLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : communityAnswers.length > 0 ? (
                  <><RefreshCw className="h-4 w-4" /> Refresh tips</>
                ) : (
                  <><Compass className="h-4 w-4" /> Read community tips</>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Share form */
          <div className="rounded-2xl border border-border/50 bg-card/30 px-6 py-6">
            <p className="text-sm font-medium mb-1">Share your local knowledge</p>
            <p className="text-xs text-muted-foreground mb-4">
              Your tip will be visible to Vanciety members passing through your area. Be specific — the more detail, the more useful it is to someone who's never been there.
            </p>
            <Textarea
              placeholder="e.g. There's a great free spot off Forest Rd 45 near Bend, OR — pull past the gate about a mile, flat ground, no cell but peaceful. Avoid weekends in summer."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              maxLength={300}
              rows={5}
              className="bg-background resize-none mb-3"
            />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground">{answerText.length}/300</span>
            </div>
            <Button className="w-full" onClick={submitAnswer} disabled={submitting || !answerText.trim()}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Share with the Community
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

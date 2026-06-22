/**
 * Icebreaker — Weekly One-Question Matching
 *
 * Design: low-pressure, opt-in, one exchange at a time
 * - Weekly question changes every Monday
 * - Answer once, get matched with one other member who answered similarly
 * - One message exchange, no ongoing obligation
 * - Opt out any time
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Clock, Users, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, startOfISOWeek, addDays } from "date-fns";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

// Weekly questions — rotate by week number
const WEEKLY_QUESTIONS = [
  "What's the best solo camping spot you've ever found?",
  "What's one thing van life taught you about yourself?",
  "What's the most useful piece of gear you own under $30?",
  "What's a place you'd go back to immediately if you could?",
  "What's your go-to meal when you're parked somewhere beautiful?",
  "What's the hardest part of van life that no one talks about?",
  "What's one skill you wish you'd learned before hitting the road?",
  "What's the most unexpected thing you love about living in a van?",
  "What's a route or road you'd recommend to any van lifer?",
  "What does a perfect slow day on the road look like for you?",
  "What's something you carry that most people wouldn't think of?",
  "What's the most important thing you do for your mental health on the road?",
];

function getWeekKey(date: Date = new Date()): string {
  const monday = startOfISOWeek(date);
  return format(monday, "yyyy-'W'II");
}

function getWeekQuestion(weekKey: string): string {
  // Hash the week key to pick a question
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

type IcebreakerAnswer = {
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

  const [myAnswer, setMyAnswer] = useState<IcebreakerAnswer | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [optedIn, setOptedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [match, setMatch] = useState<IcebreakerAnswer | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [totalAnswers, setTotalAnswers] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Fetch my answer for this week
    supabase
      .from("icebreaker_answers")
      .select("*, profiles(display_name)")
      .eq("user_id", user.id)
      .eq("week_key", weekKey)
      .maybeSingle()
      .then(({ data }) => {
        setMyAnswer(data as IcebreakerAnswer | null);
        if (data) {
          setAnswerText(data.answer);
          setOptedIn(data.is_opted_in);
        }
        setLoading(false);
      });

    // Count total answers this week (for social proof)
    supabase
      .from("icebreaker_answers")
      .select("id", { count: "exact", head: true })
      .eq("week_key", weekKey)
      .eq("is_opted_in", true)
      .then(({ count }) => setTotalAnswers(count ?? 0));
  }, [user, weekKey]);

  const submitAnswer = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!answerText.trim()) { toast.error("Write something first"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("icebreaker_answers").upsert({
      user_id: user.id,
      week_key: weekKey,
      question,
      answer: answerText.trim(),
      is_opted_in: optedIn,
    }, { onConflict: "user_id,week_key" });
    if (error) {
      toast.error("Couldn't save answer");
    } else {
      toast.success(optedIn ? "Answer submitted — you might get a match this week ✨" : "Answer saved (not in matching pool)");
      // Refresh my answer
      const { data } = await supabase
        .from("icebreaker_answers")
        .select("*, profiles(display_name)")
        .eq("user_id", user.id)
        .eq("week_key", weekKey)
        .maybeSingle();
      setMyAnswer(data as IcebreakerAnswer | null);
    }
    setSubmitting(false);
  };

  const findMatch = async () => {
    if (!user || !myAnswer) return;
    setMatchLoading(true);
    // Simple matching: find another opted-in answer from this week that isn't mine
    const { data } = await supabase
      .from("icebreaker_answers")
      .select("*, profiles(display_name)")
      .eq("week_key", weekKey)
      .eq("is_opted_in", true)
      .neq("user_id", user.id)
      .limit(10);

    if (!data || data.length === 0) {
      toast.info("No matches found yet — check back later as more members answer");
      setMatchLoading(false);
      return;
    }
    // Pick a random one from results
    const randomMatch = data[Math.floor(Math.random() * data.length)] as IcebreakerAnswer;
    setMatch(randomMatch);
    setMatchLoading(false);
  };

  const initials = (name: string | null | undefined) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="container mx-auto max-w-2xl px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-7 w-7 text-violet-400" />
            <h1 className="text-3xl font-bold tracking-tight">Icebreaker</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-lg">
            One question. One match. One optional exchange. No ongoing obligation — just a gentle way to meet someone new.
          </p>
        </div>

        {/* Week info */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="border-violet-500/40 text-violet-400 gap-1.5">
            <Clock className="h-3 w-3" />
            Week of {format(startOfISOWeek(new Date()), "MMM d")}
          </Badge>
          <Badge variant="outline" className="border-border/60 text-muted-foreground gap-1.5">
            <Users className="h-3 w-3" />
            {totalAnswers} {totalAnswers === 1 ? "member" : "members"} answered this week
          </Badge>
          <span className="text-xs text-muted-foreground">
            New question {format(nextMonday, "EEE, MMM d")}
          </span>
        </div>

        {/* Question card */}
        <div className="mb-6 rounded-2xl border border-violet-500/30 bg-violet-500/5 px-6 py-5">
          <p className="text-xs font-medium text-violet-400 uppercase tracking-wider mb-3">This week's question</p>
          <p className="text-xl font-bold leading-snug">{question}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-dashed border-border/60 py-12 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-violet-400/40" />
            <p className="text-muted-foreground text-sm mb-4">Sign in to answer and get matched</p>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </div>
        ) : myAnswer ? (
          /* Already answered */
          <div className="space-y-4">
            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <p className="font-semibold text-sm text-green-400">Your answer this week</p>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{myAnswer.answer}</p>
              <div className="mt-3 flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    myAnswer.is_opted_in
                      ? "border-violet-500/40 text-violet-400"
                      : "border-border/60 text-muted-foreground"
                  )}
                >
                  {myAnswer.is_opted_in ? "In matching pool" : "Not in matching pool"}
                </Badge>
              </div>
            </div>

            {/* Edit answer */}
            <div className="rounded-xl border border-border/40 bg-card/30 px-5 py-4">
              <p className="text-sm font-medium mb-3">Update your answer</p>
              <Textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                maxLength={300}
                rows={3}
                className="bg-background resize-none mb-3"
              />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Switch id="opted-in" checked={optedIn} onCheckedChange={setOptedIn} />
                  <Label htmlFor="opted-in" className="cursor-pointer text-sm text-muted-foreground">
                    Include me in matching
                  </Label>
                </div>
                <span className="text-xs text-muted-foreground">{answerText.length}/300</span>
              </div>
              <Button size="sm" onClick={submitAnswer} disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Answer
              </Button>
            </div>

            {/* Find a match */}
            {myAnswer.is_opted_in && (
              <div className="rounded-2xl border border-border/50 bg-card/30 px-6 py-5">
                <p className="font-semibold text-sm mb-1">Find your match</p>
                <p className="text-xs text-muted-foreground mb-4">
                  See another member's answer. One exchange, no obligation. You can wave them from the Find Members page.
                </p>

                {match ? (
                  <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 px-5 py-4 mb-3">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xs">
                          {initials(match.profiles?.display_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{match.profiles?.display_name ?? "A member"}</p>
                        <p className="text-xs text-muted-foreground">answered this week</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap italic">"{match.answer}"</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      If you'd like to connect, find them on the Member Map and send a wave.
                    </p>
                  </div>
                ) : null}

                <Button
                  variant={match ? "outline" : "default"}
                  className="w-full gap-2"
                  onClick={findMatch}
                  disabled={matchLoading}
                >
                  {matchLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : match ? (
                    <><RefreshCw className="h-4 w-4" /> Find another match</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Find a match</>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Answer form */
          <div className="rounded-2xl border border-border/50 bg-card/30 px-6 py-6">
            <p className="text-sm font-medium mb-3">Your answer</p>
            <Textarea
              placeholder="Take your time — there's no right answer..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              maxLength={300}
              rows={4}
              className="bg-background resize-none mb-3"
            />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Switch id="opted-in-new" checked={optedIn} onCheckedChange={setOptedIn} />
                <Label htmlFor="opted-in-new" className="cursor-pointer text-sm text-muted-foreground">
                  Include me in matching
                </Label>
              </div>
              <span className="text-xs text-muted-foreground">{answerText.length}/300</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Matching is opt-in. If included, you might be shown to one other member who answered similarly. No obligation to respond.
            </p>
            <Button className="w-full" onClick={submitAnswer} disabled={submitting || !answerText.trim()}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Answer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

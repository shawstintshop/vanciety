import { useMemo, useState } from "react";
import { Brain, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  aiModeConfig,
  aiSourceLinks,
  buildConciergeContext,
  fallbackSuggestions,
  type AiConciergeMode,
} from "@/data/aiConcierge";

interface AIVanConciergeProps {
  mode?: AiConciergeMode;
  compact?: boolean;
}

const typeLabel: Record<string, string> = {
  event: "Event",
  video: "Video",
  vendor: "Vendor",
  marketplace: "Marketplace",
  forum: "Forum",
  gear: "Gear",
  mechanic: "Service",
};

const modeSourcePriority: Record<AiConciergeMode, string[]> = {
  home: ["event", "video", "vendor", "gear", "marketplace"],
  trip: ["event", "vendor", "forum", "video", "marketplace"],
  build: ["gear", "video", "vendor", "forum", "mechanic"],
  marketplace: ["marketplace", "gear", "vendor", "video", "forum"],
  video: ["video", "gear", "vendor", "event", "forum"],
  community: ["forum", "event", "vendor", "video", "marketplace"],
  mechanic: ["mechanic", "vendor", "gear", "video", "forum"],
};

const AIVanConcierge = ({ mode = "home", compact = false }: AIVanConciergeProps) => {
  const config = aiModeConfig[mode];
  const [question, setQuestion] = useState(config.quickActions[0]?.prompt ?? "");
  const [answer, setAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [answerSource, setAnswerSource] = useState<"ai" | "guide" | null>(null);
  const sourceLinks = useMemo(() => {
    const priority = modeSourcePriority[mode];
    return [...aiSourceLinks]
      .sort((a, b) => priority.indexOf(a.type) - priority.indexOf(b.type))
      .slice(0, compact ? 6 : 10);
  }, [compact, mode]);

  const askConcierge = async () => {
    const trimmed = question.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setAnswer("");
    setAnswerSource(null);

    try {
      const { data, error } = await supabase.functions.invoke("vanciety-ai-concierge", {
        body: {
          question: trimmed,
          mode,
          context: buildConciergeContext(mode),
        },
      });

      if (error) throw error;
      const reply = typeof data?.answer === "string" ? data.answer.trim() : "";
      if (!reply) throw new Error("AI assistant returned an empty response.");

      setAnswer(reply);
      setAnswerSource("ai");
    } catch (error) {
      const suggestions = fallbackSuggestions(mode, trimmed);
      setAnswer(
        [
          "Vanciety AI is in guide mode right now, so it is giving you a source-aware path instead of a generated answer.",
          "Try this next:",
          ...suggestions.map((item, index) => `${index + 1}. ${item}`),
        ].join("\n\n")
      );
      setAnswerSource("guide");
      console.info("Vanciety AI concierge fallback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={compact ? "py-8" : "py-14"}>
      <Card className="vanciety-topo-card overflow-hidden border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 shadow-card">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">
              <Sparkles className="mr-1 h-3 w-3" />
              {config.eyebrow}
            </Badge>
            <Badge variant="secondary">Page-aware</Badge>
            <Badge variant="outline">Source-aware</Badge>
            <Badge variant="outline">Trip planning</Badge>
            <Badge variant="outline">Build research</Badge>
            <Badge variant="outline">Gear checks</Badge>
          </div>
          <div>
            <CardTitle className={compact ? "text-xl" : "text-2xl md:text-3xl"}>{config.title}</CardTitle>
            <CardDescription className="mt-2 max-w-3xl text-sm md:text-base">
              {config.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {config.quickActions.map((action) => (
                <Button
                  key={action.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuestion(action.prompt)}
                >
                  {action.label}
                </Button>
              ))}
            </div>

            <Textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={config.placeholder}
              className="min-h-[120px] bg-background/80"
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button onClick={askConcierge} disabled={isLoading || !question.trim()} className="sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                Ask Vanciety AI
              </Button>
              <p className="text-xs text-muted-foreground">
                Uses the page you are on plus Vanciety source links to guide the answer.
              </p>
            </div>

            {answer && (
              <div className="rounded-xl border bg-background/80 p-4 text-sm leading-relaxed whitespace-pre-line">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant={answerSource === "ai" ? "default" : "secondary"}>
                    {answerSource === "ai" ? "AI response" : "Guide mode"}
                  </Badge>
                </div>
                {answer}
              </div>
            )}
          </div>

          <div className="space-y-3 rounded-xl border bg-background/60 p-4">
            <h3 className="text-sm font-semibold">Good links to open next</h3>
            <div className="space-y-2">
              {sourceLinks.map((link) => (
                <a
                  key={`${link.type}-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-3 rounded-lg border bg-card/80 p-3 text-sm transition-colors hover:border-primary/60"
                >
                  <span>
                    <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
                      {typeLabel[link.type] ?? link.type}
                    </span>
                    <span className="line-clamp-2 font-medium">{link.label}</span>
                  </span>
                  <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary" />
                </a>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AIVanConcierge;

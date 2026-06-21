import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Send, Loader2, MapPin, Wrench, Video, Users } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIVanConciergeProps {
  mode?: 'home' | 'full';
  compact?: boolean;
}

const SUGGESTIONS = [
  { icon: MapPin, text: 'Best camp spots near me' },
  { icon: Wrench, text: '2022 Sprinter V6 diesel EGR valve cleaning' },
  { icon: Video, text: 'Van build videos to watch' },
  { icon: Users, text: 'Find van lifers in my area' },
];

const GUIDE_CARDS = [
  {
    title: '2022 Sprinter VS30 V6 Diesel EGR Valve',
    description: 'Diagnose, clean, remove, inspect, and verify the EGR valve with real videos and official references.',
    to: '/van-intelligence?guide=egr-v6-diesel',
    image: '/images/vanciety-van-tech-mechanics.jpg',
  },
  {
    title: 'Van events and real meetups',
    description: 'Jump to official events, shows, and trip-planning sources first.',
    to: '/events',
    image: '/images/vanciety-large-van-event.jpg',
  },
  {
    title: 'Driveway meetups and member help',
    description: 'Use the friend-finder path for member-based help and driveway style meetups.',
    to: '/friend-finder',
    image: '/images/vanciety-driveway-meetup.jpg',
  },
  {
    title: 'Builds, community, and questions',
    description: 'Open the forum-style path for questions, build feedback, and member discussion.',
    to: '/forum',
    image: '/images/vanciety-group-collage.jpg',
  },
  {
    title: 'Watch real videos',
    description: 'Go straight to the video library for real install and maintenance videos.',
    to: '/videos',
    image: '/images/vanciety-image-library.jpg',
  },
  {
    title: 'About the platform',
    description: 'See what Vanciety is and how the system is organized.',
    to: '/about',
    image: '/images/vanciety-about-image-library.jpg',
  },
];

const AIVanConcierge: React.FC<AIVanConciergeProps> = ({ compact = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    // Simulated response — replace with real AI endpoint when ready
    await new Promise(r => setTimeout(r, 900));
    const reply = getLocalReply(query);
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  const getLocalReply = (q: string): string => {
    const lower = q.toLowerCase();
    if (lower.includes('solar') || lower.includes('electric')) {
      return "For a Sprinter van, a common solar setup is 400W panels + a 100Ah LiFePO4 battery + a Victron MPPT controller. Check our Videos page for step-by-step build guides from top creators like Will Prowse and Build A Green RV.";
    }
    if (lower.includes('camp') || lower.includes('spot') || lower.includes('sleep')) {
      return "Check our Map page for verified camp spots, driveways, and boondocking locations contributed by the Vanciety community. We have 18+ Pacific Northwest locations and growing.";
    }
    if (lower.includes('video') || lower.includes('build') || lower.includes('watch')) {
      return "Head to our Videos page — we have 21+ real van life videos from channels like Eamon & Bec, Kara and Nate, and Will Prowse, with more added regularly.";
    }
    if (lower.includes('friend') || lower.includes('meet') || lower.includes('community')) {
      return "Use Friend Finder to connect with van lifers near you. It's privacy-first — approximate city-level sharing only, opt-in. Sign up to access it.";
    }
    return "Great question! Vanciety is your all-in-one van life hub. You can find camp spots on the Map, watch build videos, post in the Forum, and connect with other van lifers. What specifically can I help you with?";
  };

  return (
    <Card className={`bg-card/60 border border-border/60 ${compact ? '' : 'w-full max-w-2xl mx-auto'}`}>
      <CardContent className={`${compact ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
            <img
              src="/images/vanciety-sprinter-society.png"
              alt="Vana mascot"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Vana — van life assistant</span>
          </div>
        </div>

        {/* Messages */}
        {messages.length > 0 && (
          <div className={`space-y-3 mb-4 overflow-y-auto ${compact ? 'max-h-48' : 'max-h-72'}`}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-xl px-3 py-2 text-sm max-w-[85%] ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-xl px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Suggestions */}
        {messages.length === 0 && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {SUGGESTIONS.map(({ icon: Icon, text }) => (
                <button
                  key={text}
                  onClick={() => handleSend(text)}
                  className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-left text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  {text}
                </button>
              ))}
            </div>

            <div className="mb-4 grid gap-3">
              {GUIDE_CARDS.map((guide) => (
                <a
                  key={guide.title}
                  href={guide.to}
                  className="group overflow-hidden rounded-2xl border border-border/60 bg-background/60 transition hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={guide.image} alt={guide.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-foreground">{guide.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{guide.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        {/* Input */}
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about van life..."
            className="flex-1 h-9 text-sm bg-background/60"
            disabled={loading}
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

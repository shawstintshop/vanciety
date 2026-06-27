// Waitlist page — invite request for Vanciety
// Cinematic matte black/gold design matching the site aesthetic
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Users, Loader2, CheckCircle2, Flame } from 'lucide-react';

const HERO_IMG = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=80';

const Waitlist = () => {
  const [form, setForm] = useState({ name: '', email: '', van_model: '', why_join: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: form.email,
        source_page: 'waitlist',
        status: 'waitlist',
        interest: ['waitlist', form.van_model].filter(Boolean),
        user_agent: `name:${form.name}|van:${form.van_model}|why:${form.why_join}`,
      });
      if (error && error.code !== '23505') throw error; // ignore duplicate
      setSubmitted(true);
      toast.success("You're on the list! We'll reach out soon.");
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Header />

      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[55vh] pt-20">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0d0d0d]" />
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#c9a96e]/10 border border-[#c9a96e]/30 rounded-full px-4 py-1.5 mb-6">
            <Flame className="w-3.5 h-3.5 text-[#c9a96e]" />
            <span className="text-[#c9a96e] text-xs font-bold uppercase tracking-widest">Invite Only</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-4 leading-none">
            Request<br />
            <span className="text-[#c9a96e]">Access</span>
          </h1>
          <p className="text-lg text-white/70 max-w-lg mx-auto">
            Vanciety is invite-only right now. Join the waitlist and we'll send your invite code when a spot opens up.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-[#111] border-y border-[#c9a96e]/20 py-4">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Members Waiting', value: '2,847' },
            { label: 'Active Members', value: '412' },
            { label: 'Avg Wait Time', value: '~2 weeks' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl font-black text-[#c9a96e]">{s.value}</div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <section className="max-w-xl mx-auto px-4 py-16">
        {submitted ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-[#c9a96e]" />
              </div>
            </div>
            <h2 className="text-3xl font-black uppercase">{"You're on the list!"}</h2>
            <p className="text-white/60 text-lg">
              {"We'll email your invite code to "}<strong className="text-white">{form.email}</strong>{" when a spot opens up. Keep an eye on your inbox."}
            </p>
            <div className="bg-[#111] border border-[#c9a96e]/20 rounded-xl p-6 text-left space-y-3">
              <p className="text-sm font-semibold text-[#c9a96e] uppercase tracking-wider">While you wait</p>
              <ul className="text-sm text-white/60 space-y-2">
                <li>→ Follow us <strong className="text-white">@vanciety.co</strong> on Instagram & TikTok</li>
                <li>→ Check out the <strong className="text-white">Vanciety Merch Store</strong> — gear for the lifestyle</li>
                <li>→ Watch van build videos on our YouTube channel</li>
              </ul>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 mb-4">
                <Users className="w-7 h-7 text-[#c9a96e]" />
              </div>
              <h2 className="text-2xl font-black uppercase">Join the Waitlist</h2>
              <p className="text-white/50 text-sm mt-1">Takes 30 seconds. No spam, ever.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/80">Full Name *</Label>
              <Input
                id="name" name="name" value={form.name} onChange={handleChange}
                placeholder="Your name" required
                className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-white/30 focus:border-[#c9a96e]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email Address *</Label>
              <Input
                id="email" name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required
                className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-white/30 focus:border-[#c9a96e]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="van_model" className="text-white/80">Your Van (or dream van)</Label>
              <Input
                id="van_model" name="van_model" value={form.van_model} onChange={handleChange}
                placeholder="e.g. 2022 Mercedes Sprinter 170"
                className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-white/30 focus:border-[#c9a96e]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="why_join" className="text-white/80">Why do you want to join?</Label>
              <Textarea
                id="why_join" name="why_join" value={form.why_join} onChange={handleChange}
                placeholder="Tell us a bit about your van life journey..."
                rows={3}
                className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-white/30 focus:border-[#c9a96e] resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a96e] hover:bg-[#b8935a] text-black font-black uppercase tracking-widest py-6 text-base"
            >
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
              Request My Invite
            </Button>

            <p className="text-xs text-center text-white/30">
              By submitting, you agree to receive occasional emails from Vanciety. Unsubscribe anytime.
            </p>
          </form>
        )}
      </section>

      <SiteFooter />
    </div>
  );
};

export default Waitlist;

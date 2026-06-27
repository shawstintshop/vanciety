// auth/AuthForm — sign-in / invite-only sign-up form
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Lock, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

const VALID_INVITE_CODES = new Set([
  'VANLIFE2025', 'VANCIETY01', 'VANCIETY02', 'VANCIETY03', 'VANCIETY04',
  'VANCIETY05', 'VANCIETY06', 'VANCIETY07', 'VANCIETY08', 'VANCIETY09',
  'VANCIETY10', 'ROADFREE01', 'ROADFREE02', 'ROADFREE03', 'ROADFREE04',
  'ROADFREE05', 'SPRINTER01', 'SPRINTER02', 'TRANSIT001', 'TRANSIT002',
  'PROMASTER1', 'VANBUILDER', 'OFFGRID001', 'OFFGRID002', 'OFFGRID003',
  'CAMPFIRE01', 'CAMPFIRE02', 'CAMPFIRE03', 'CAMPFIRE04', 'CAMPFIRE05',
  'VANDOG2025', 'NOMAD2025A', 'NOMAD2025B', 'NOMAD2025C', 'NOMAD2025D',
  'SOLARPWR01', 'SOLARPWR02', 'LITHIUM001', 'LITHIUM002', 'LITHIUM003',
  'ADVENTURE1', 'ADVENTURE2', 'ADVENTURE3', 'ADVENTURE4', 'ADVENTURE5',
  'VANLIFER01', 'VANLIFER02', 'VANLIFER03', 'VANLIFER04', 'VANLIFER05',
  'SHAWLIFE01', 'FOUNDING01', 'FOUNDING02', 'FOUNDING03', 'FOUNDING04',
]);

interface AuthFormProps {
  onSubmit: (email: string, password: string, isSignUp: boolean) => Promise<void>;
  isLoading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteValid, setInviteValid] = useState(false);

  const handleInviteCheck = () => {
    const code = inviteCode.trim().toUpperCase();
    if (VALID_INVITE_CODES.has(code)) {
      setInviteValid(true);
      setInviteError('');
    } else {
      setInviteError('Invalid invite code. Request access below.');
      setInviteValid(false);
    }
  };

  const handle = (isSignUp: boolean) => async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && !inviteValid) {
      setInviteError('Please enter a valid invite code.');
      return;
    }
    await onSubmit(email, password, isSignUp);
  };

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
        <TabsTrigger value="signup" className="flex-1">Create Account</TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <form onSubmit={handle(false)} className="space-y-4 px-6 pb-6">
          <div className="space-y-2">
            <Label htmlFor="email-in">Email</Label>
            <Input id="email-in" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw-in">Password</Label>
            <Input id="pw-in" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Sign In
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="signup">
        <div className="px-6 pb-6 space-y-5">
          {!inviteValid ? (
            <div className="rounded-lg border border-[#c9a96e]/40 bg-[#c9a96e]/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-[#c9a96e]">
                <Ticket className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Invite Only</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Vanciety is currently invite-only to keep the community tight and high-quality. Enter your invite code to create an account.
              </p>
              <div className="flex gap-2">
                <Input
                  value={inviteCode}
                  onChange={e => { setInviteCode(e.target.value); setInviteError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleInviteCheck(); } }}
                  placeholder="VANLIFE2025"
                  className="uppercase tracking-widest font-mono"
                  maxLength={20}
                />
                <Button type="button" onClick={handleInviteCheck} variant="outline" className="shrink-0 border-[#c9a96e]/50 text-[#c9a96e] hover:bg-[#c9a96e]/10">
                  Verify
                </Button>
              </div>
              {inviteError && <p className="text-xs text-red-400">{inviteError}</p>}
              <div className="pt-1 border-t border-border/40">
                <p className="text-xs text-muted-foreground">
                  {"Don't have a code? "}
                  <Link to="/waitlist" className="text-[#c9a96e] hover:underline font-medium">
                    Request access →
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3">
              <Lock className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Invite code verified ✓</span>
            </div>
          )}

          {inviteValid && (
            <form onSubmit={handle(true)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-up">Email</Label>
                <Input id="email-up" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw-up">Password</Label>
                <Input id="pw-up" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="8+ characters" required minLength={8} />
              </div>
              <Button type="submit" className="w-full bg-[#c9a96e] hover:bg-[#b8935a] text-black font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Create Account
              </Button>
              <p className="text-xs text-center text-muted-foreground">Free to join. No credit card required.</p>
            </form>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AuthForm;

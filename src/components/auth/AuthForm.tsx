// auth/AuthForm — standalone sign-in / sign-up form component
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  onSubmit: (email: string, password: string, isSignUp: boolean) => Promise<void>;
  isLoading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handle = (isSignUp: boolean) => async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password, isSignUp);
  };

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
        <TabsTrigger value="signup" className="flex-1">Create Account</TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <form onSubmit={handle(false)} className="space-y-4">
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
        <form onSubmit={handle(true)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-up">Email</Label>
            <Input id="email-up" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw-up">Password</Label>
            <Input id="pw-up" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="8+ characters" required minLength={8} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Create Account
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default AuthForm;

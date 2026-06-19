
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  onEmailPasswordSubmit: (email: string, password: string, isSignUp: boolean, displayName?: string) => Promise<void>;
  onSocialSignIn: (provider: 'google' | 'apple') => Promise<void>;
  isLoading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onEmailPasswordSubmit, onSocialSignIn, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(''); // For signup
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onEmailPasswordSubmit(email, password, tab === 'signup', displayName);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSocialClick = async (provider: 'google' | 'apple') => {
    try {
      await onSocialSignIn(provider);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader className="text-center">
        <CardTitle>Welcome to Vanciety</CardTitle>
        <CardDescription>Join the community of van enthusiasts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={(value) => setTab(value as 'login' | 'signup')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email-login">Email</Label>
                  <Input id="email-login" type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="flex flex-col space-y-1.5 mt-2">
                  <Label htmlFor="password-login">Password</Label>
                  <Input id="password-login" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Login
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input id="display-name" placeholder="Your display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                </div>
                <div className="flex flex-col space-y-1.5 mt-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="flex flex-col space-y-1.5 mt-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input id="password-signup" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign Up
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button variant="outline" className="w-full" onClick={() => handleSocialClick('google')} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Google
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleSocialClick('apple')} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Apple
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;

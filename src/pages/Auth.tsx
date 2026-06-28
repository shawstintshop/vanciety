import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import VancietyLogo from '@/components/VancietyLogo';
import AuthForm from '@/components/auth/AuthForm'; // Import the new AuthForm component

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleEmailPasswordSubmit = async (email: string, password: string, isSignUp: boolean) => {
    setIsLoading(true);

    try {
      if (isSignUp) {
        // displayName is not collected here; users set it later on /profile
        await signUpWithEmail(email, password, '');
        toast.success('Account created! Please check your email to verify your account.');
      } else {
        await signInWithEmail(email, password);
        // AuthContext's onAuthStateChange handles the post-sign-in redirect
      }
    } catch {
      // AuthContext already surfaces the error via toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vanciety-page vanciety-page--auth min-h-screen bg-background">
      <Header />
      <main className="relative isolate flex min-h-screen items-center justify-center px-4 pb-12 pt-16 sm:pt-20">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/sprinter-red-rocks-arch.png)" }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
        <Card className="relative z-10 w-full max-w-md border-border/80 bg-card/95 shadow-hero">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <VancietyLogo className="h-14 w-[260px] max-w-full sm:h-16 sm:w-[300px]" />
            </div>
            <div className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-glow">
              <ShieldCheck className="h-3.5 w-3.5" />
              Account-powered member tools
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to Vanciety</CardTitle>
            <CardDescription>Join the van life community to unlock posting, listings, Van Cards, and opt-in GPS features.</CardDescription>
          </CardHeader>
          <AuthForm onSubmit={handleEmailPasswordSubmit} isLoading={isLoading} />
        </Card>
      </main>
    </div>
  );
};

export default Auth;
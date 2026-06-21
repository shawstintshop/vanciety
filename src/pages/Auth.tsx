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
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailPasswordSubmit = async (email: string, password: string, isSignUp: boolean) => {
    setIsLoading(true);

    if (isSignUp) {
      // For now, displayName is not handled by AuthForm, so we'll pass an empty string
      const { error } = await signUp(email, password, '');
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created! Please check your email to verify your account.');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back!');
        navigate('/');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="vanciety-page vanciety-page--auth min-h-screen bg-background">
      <Header />
      <main className="vanciety-hero-topo flex min-h-screen items-center justify-center px-4 pb-12 pt-28">
        <Card className="vanciety-topo-card w-full max-w-md border-border/80 bg-card/95 shadow-hero">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <VancietyLogo className="h-16 w-[260px] max-w-full sm:h-18 sm:w-[280px]" />
            </div>
            <div className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-glow">
              <ShieldCheck className="h-3.5 w-3.5" />
              Account-powered member tools
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to Vanciety</CardTitle>
            <CardDescription>Join the van life community to unlock posting, listings, Van Cards, and opt-in GPS features.</CardDescription>
          </CardHeader>
          <AuthForm onEmailPasswordSubmit={handleEmailPasswordSubmit} isLoading={isLoading} />
        </Card>
      </main>
    </div>
  );
};

export default Auth;
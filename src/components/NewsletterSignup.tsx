import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Check, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewsletterSignupProps {
  variant?: "inline" | "modal" | "card";
  defaultInterest?: string[];
  sourcePage?: string;
}

export default function NewsletterSignup({ 
  variant = "card", 
  defaultInterest = ["general"],
  sourcePage = "homepage"
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [interest, setInterest] = useState<string[]>(defaultInterest);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (smsOptIn && !phone) {
      toast.error("Phone number is required for SMS notifications");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: email.toLowerCase().trim(),
          phone: phone.trim() || null,
          email_opt_in: emailOptIn,
          sms_opt_in: smsOptIn,
          interest,
          source_page: sourcePage,
          ip_address: null, // Server-side enrichment
          user_agent: navigator.userAgent,
        });

      if (error) {
        if (error.code === "23505") {
          // Duplicate email
          toast.success("You're already on the list! We'll notify you when we launch.");
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        toast.success("Welcome to Vanciety! We'll keep you posted on the latest van news.");
      }
    } catch (error: any) {
      console.error("Newsletter signup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (value: string) => {
    setInterest((prev) =>
      prev.includes(value)
        ? prev.filter((i) => i !== value)
        : [...prev, value]
    );
  };

  if (isSuccess) {
    return (
      <Card className="border-green-500/50 bg-green-50/50">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-green-900">You're On The List!</h3>
          <p className="text-sm text-green-700">
            {emailOptIn && "We'll email you "}
            {emailOptIn && smsOptIn && "and text you "}
            {!emailOptIn && smsOptIn && "We'll text you "}
            when Vanciety launches, plus daily van news, events, and community updates.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Phone Number (optional)
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="text-base"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Get Notified About:</Label>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="email-opt-in"
            checked={emailOptIn}
            onCheckedChange={(checked) => setEmailOptIn(checked as boolean)}
          />
          <label htmlFor="email-opt-in" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Email updates (daily van news, events, new features)
          </label>
        </div>

        {phone && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sms-opt-in"
              checked={smsOptIn}
              onCheckedChange={(checked) => setSmsOptIn(checked as boolean)}
            />
            <label htmlFor="sms-opt-in" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              SMS alerts (launch announcement, urgent community updates)
            </label>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">I'm Interested In:</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "member", label: "Community" },
            { value: "manufacturer", label: "Listing Products" },
            { value: "coordinator", label: "Hosting Events" },
            { value: "general", label: "Van News" },
          ].map((option) => (
            <Badge
              key={option.value}
              variant={interest.includes(option.value) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleInterest(option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        variant="hero"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Join The Vanciety Community
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        We respect your privacy. Unsubscribe anytime. No spam, ever.
      </p>
    </form>
  );

  if (variant === "inline") {
    return <div className="max-w-md">{formContent}</div>;
  }

  return (
    <Card className="shadow-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Join Vanciety Early Access
        </CardTitle>
        <CardDescription>
          Be the first to know when we launch. Get daily van news, event updates, and exclusive community features.
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}

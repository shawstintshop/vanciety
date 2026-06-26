import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CoordinatorApplication: React.FC = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [pastEvents, setPastEvents] = useState('');
  const [references, setReferences] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('coordinator_applications' as any)
        .insert({
          name: organizationName,
          email: contactEmail,
          organization_type: organizationType,
          experience: pastEvents,
          social_links: references,
          region: null,
          status: 'pending',
        });

      if (insertError) {
        setError('Something went wrong submitting your application. Please try again, or email hello@vanciety.com directly.');
        setStatus('error');
        return;
      }

      // Fire-and-forget the confirmation email. A failure here must not block success.
      supabase.functions
        .invoke('send-coordinator-confirmation', {
          body: { name: organizationName, email: contactEmail },
        })
        .catch((err) => {
          console.error('Confirmation email failed:', err);
        });

      setSubmittedEmail(contactEmail);
      setStatus('success');
      setOrganizationName('');
      setOrganizationType('');
      setContactEmail('');
      setPastEvents('');
      setReferences('');
    } catch (err) {
      setError('Something went wrong submitting your application. Please try again, or email hello@vanciety.com directly.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background topo-card">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-12 max-w-lg">

          {status === 'success' ? (
            <div className="text-center py-16">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
              <p className="text-muted-foreground mb-6">
                Thanks — your coordinator application has been received. A confirmation email is on its way to{' '}
                <span className="text-foreground font-medium">{submittedEmail}</span>. Our team reviews all applications within 5 business days. Questions? Reach us at{' '}
                <a href="mailto:hello@vanciety.com" className="text-primary hover:underline">
                  hello@vanciety.com
                </a>
                .
              </p>
              <Button variant="outline" onClick={() => setStatus('idle')}>
                Submit Another Application
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Become a Vanciety Event Coordinator
                </CardTitle>
                <CardDescription className="text-center">
                  Fill out the form below to apply. Your application will be reviewed by the Vanciety team and we'll follow up within 5 business days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="organizationName">Organization or Your Name</Label>
                    <Input
                      id="organizationName"
                      type="text"
                      placeholder="e.g. Pacific Northwest Van Collective"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="contactEmail">Your Email Address</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="you@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="organizationType">Organization Type</Label>
                    <Select onValueChange={setOrganizationType} value={organizationType} required>
                      <SelectTrigger id="organizationType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="non-profit">Non-Profit</SelectItem>
                        <SelectItem value="for-profit">For-Profit Business</SelectItem>
                        <SelectItem value="community-group">Community Group</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="pastEvents">Event Experience</Label>
                    <Textarea
                      id="pastEvents"
                      placeholder="Describe events you've organized — types, approximate attendance, and your role."
                      value={pastEvents}
                      onChange={(e) => setPastEvents(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="references">References <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                    <Textarea
                      id="references"
                      placeholder="Contact info for anyone who can speak to your event coordination experience."
                      value={references}
                      onChange={(e) => setReferences(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {error && (
                    <p className="text-destructive text-sm">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    We'll email a confirmation and review within 5 business days.
                  </p>

                </form>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
};

export default CoordinatorApplication;

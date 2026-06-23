import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import { CheckCircle2 } from 'lucide-react';

const CoordinatorApplication: React.FC = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [pastEvents, setPastEvents] = useState('');
  const [references, setReferences] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    // Build a mailto: link so the application goes directly to the Vanciety team inbox
    // until a backend form handler is wired up
    const subject = encodeURIComponent(`Coordinator Application: ${organizationName}`);
    const body = encodeURIComponent(
      `Organization Name: ${organizationName}\n` +
      `Organization Type: ${organizationType}\n` +
      `Contact Email: ${contactEmail}\n\n` +
      `Past Events / Experience:\n${pastEvents}\n\n` +
      `References:\n${references || 'None provided'}`
    );

    try {
      window.location.href = `mailto:hello@vanciety.com?subject=${subject}&body=${body}`;
      setStatus('success');
      setOrganizationName('');
      setOrganizationType('');
      setContactEmail('');
      setPastEvents('');
      setReferences('');
    } catch {
      setError('Unable to open your email client. Please email hello@vanciety.com directly with your application details.');
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
              <h2 className="text-2xl font-bold mb-2">Application Ready to Send</h2>
              <p className="text-muted-foreground mb-6">
                Your email client should have opened with your application pre-filled. Send it to complete your submission. If it didn't open, email us directly at{' '}
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
                    {status === 'submitting' ? 'Preparing...' : 'Submit Application'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Clicking submit will open your email client with your application pre-filled. We review all applications within 5 business days.
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

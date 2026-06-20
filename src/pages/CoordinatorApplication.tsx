import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CoordinatorApplication: React.FC = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [pastEvents, setPastEvents] = useState('');
  const [references, setReferences] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    // In a real application, this would involve an API call to Supabase.
    // For now, we'll simulate a successful submission.
    try {
      console.log('Submitting Coordinator Application:', {
        organizationName,
        organizationType,
        pastEvents,
        references,
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate success
      setStatus('success');
      setOrganizationName('');
      setOrganizationType('');
      setPastEvents('');
      setReferences('');

      // In a real app, you might navigate or show a success message
      alert('Application submitted successfully! We will review it shortly.');

    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit application. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Become a Vanciety Event Coordinator</CardTitle>
          <CardDescription className="text-center">
            Fill out the form below to apply to become an event coordinator. Your application will be reviewed by our team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                type="text"
                placeholder="Your Organization Name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
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
              <Label htmlFor="pastEvents">Description of Past Events / Experience</Label>
              <Textarea
                id="pastEvents"
                placeholder="Describe your experience organizing events, including types of events, attendance, and your role."
                value={pastEvents}
                onChange={(e) => setPastEvents(e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="references">References (Optional)</Label>
              <Textarea
                id="references"
                placeholder="Provide contact information for any references who can speak to your event coordination experience."
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                rows={3}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoordinatorApplication;

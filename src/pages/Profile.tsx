import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Crown, Loader2, LogOut, MapPin, MessageSquare, Save, ShoppingBag, Video, User } from 'lucide-react';

interface ProfileForm {
  display_name: string;
  van_type: string;
  location: string;
  instagram_handle: string;
  bio: string;
  avatar_url: string;
}

const EMPTY_FORM: ProfileForm = {
  display_name: '',
  van_type: '',
  location: '',
  instagram_handle: '',
  bio: '',
  avatar_url: '',
};

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Load the user's profile row (created on signup by the handle_new_user trigger).
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, van_type, location, instagram_handle, bio, avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;
      if (error) {
        toast.error('Could not load your profile.');
      } else if (data) {
        setForm({
          display_name: data.display_name ?? '',
          van_type: data.van_type ?? '',
          location: data.location ?? '',
          instagram_handle: data.instagram_handle ?? '',
          bio: data.bio ?? '',
          avatar_url: data.avatar_url ?? '',
        });
      } else {
        // No row yet — seed display_name from auth metadata as a sensible default.
        setForm((prev) => ({
          ...prev,
          display_name: user.user_metadata?.display_name ?? '',
        }));
      }
      setLoadingProfile(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const setField = (key: keyof ProfileForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: user.id,
          display_name: form.display_name.trim() || null,
          van_type: form.van_type.trim() || null,
          location: form.location.trim() || null,
          instagram_handle: form.instagram_handle.trim().replace(/^@/, '') || null,
          bio: form.bio.trim() || null,
          avatar_url: form.avatar_url.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );

    setSaving(false);
    if (error) {
      toast.error('Failed to save profile. Please try again.');
    } else {
      toast.success('Profile saved.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || (user && loadingProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = form.display_name || user.email?.split('@')[0] || 'Van Lifer';
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12 max-w-3xl">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center overflow-hidden">
              {form.avatar_url ? (
                <img src={form.avatar_url} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">Member since {joinDate}</p>
            </div>
            <Badge variant="outline" className="ml-auto">Free Member</Badge>
          </div>
        </div>

        {/* Edit Profile */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display name</Label>
                <Input
                  id="display_name"
                  value={form.display_name}
                  onChange={(e) => setField('display_name')(e.target.value)}
                  placeholder="Van Lifer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="van_type">Van type</Label>
                <Input
                  id="van_type"
                  value={form.van_type}
                  onChange={(e) => setField('van_type')(e.target.value)}
                  placeholder="Sprinter 144 4x4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setField('location')(e.target.value)}
                  placeholder="Denver, CO"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_handle">Instagram</Label>
                <Input
                  id="instagram_handle"
                  value={form.instagram_handle}
                  onChange={(e) => setField('instagram_handle')(e.target.value)}
                  placeholder="@yourhandle"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar image URL</Label>
              <Input
                id="avatar_url"
                value={form.avatar_url}
                onChange={(e) => setField('avatar_url')(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setField('bio')(e.target.value)}
                placeholder="Tell the community about your build and travels…"
                rows={4}
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Video, label: 'Videos', path: '/videos' },
            { icon: MapPin, label: 'Map', path: '/map' },
            { icon: MessageSquare, label: 'Forum', path: '/forum' },
            { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace' },
          ].map(({ icon: Icon, label, path }) => (
            <Button
              key={label}
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate(path)}
            >
              <Icon className="w-6 h-6" />
              <span>{label}</span>
            </Button>
          ))}
        </div>

        {/* Upgrade Card */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-primary" />
              <span>Upgrade to Premium</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Unlock 10K+ camp spots, 4K video streaming, exclusive events, and direct messaging for just $9.99/month.
            </p>
            <Button variant="hero" className="w-full sm:w-auto">
              Start 7-Day Free Trial
              <Crown className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleSignOut} className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

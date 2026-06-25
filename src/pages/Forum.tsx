import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Users, 
  Pin, 
  TrendingUp, 
  Clock,
  ThumbsUp,
  Eye,
  Crown,
  Search,
  Plus,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

const Forum = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadIssue, setLoadIssue] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const forumCategories = [
    { id: "all", name: "All Topics", icon: MessageSquare },
    { id: "builds", name: "Van Builds", icon: MessageSquare },
    { id: "electrical", name: "Electrical & Solar", icon: MessageSquare },
    { id: "mechanical", name: "Mechanical", icon: MessageSquare },
    { id: "travel", name: "Travel & Routes", icon: MessageSquare },
    { id: "tips", name: "Tips & Tricks", icon: MessageSquare },
    { id: "marketplace", name: "Buy/Sell", icon: MessageSquare },
    { id: "meetups", name: "Meetups", icon: Users },
    { id: "newbie", name: "Newbie Corner", icon: MessageSquare }
  ];

  useEffect(() => {
    fetchForumPosts();
  }, [selectedCategory]);

  const fetchForumPosts = async () => {
    setIsLoading(true);
    setLoadIssue(null);
    let query = supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      setForumPosts([]);
      setLoadIssue('Unable to load forum posts right now. Please try refreshing the page.');
    } else {
      setForumPosts(data || []);
    }
    setIsLoading(false);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to create a post');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from('forum_posts')
      .insert({
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        user_id: user.id,
      });

    if (error) {
      toast.error('Failed to create post');
      console.error('Error creating post:', error);
    } else {
      toast.success('Post created successfully!');
      setNewPost({ title: "", content: "", category: "" });
      setIsCreateOpen(false);
      fetchForumPosts();
    }
    setIsSubmitting(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const liveStats = [
    { label: "Topics", value: isLoading ? "—" : forumPosts.length.toString() },
    { label: "Categories", value: forumCategories.length.toString() },
    { label: "Active Filter", value: selectedCategory === "all" ? "All" : forumCategories.find((category) => category.id === selectedCategory)?.name || selectedCategory },
    { label: "Status", value: isLoading ? "Loading..." : loadIssue ? "Offline" : "Live" },
  ];

  return (
    <div className="min-h-screen bg-background topo-card">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection
          image="/images/vans-neighborhood-meetup.jpg"
          badge="Community Forum"
          title="Ask anything."
          accent="Get real answers."
          subtitle="Thousands of van lifers sharing builds, advice, and road stories."
        />

        <section className="bg-background border-b border-border py-14">
          <div className="container mx-auto px-4">
            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-4">
              {liveStats.map((stat) => (
                <div key={stat.label} className="text-center rounded-xl border bg-card/70 p-4">
                  <div className="text-2xl font-bold text-foreground truncate">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="max-w-2xl mx-auto mb-8 rounded-xl border bg-card/70 p-3 text-center text-sm text-muted-foreground">
              {loadIssue
                ? loadIssue
                : "Ask questions, share your build, and get real answers from the van life community."}
            </div>

            {/* Search and New Topic */}
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics, posts, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Topic
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Create New Topic</DialogTitle>
                    <DialogDescription>
                      Share your knowledge and start a discussion with the community.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreatePost}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter topic title..."
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {forumCategories.filter(cat => cat.id !== 'all').map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          placeholder="Share your thoughts, questions, or knowledge..."
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          rows={6}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Topic
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {forumCategories.map((category) => {
                  const Icon = category.icon;
                  const categoryPosts = selectedCategory === category.id || category.id === 'all' ? forumPosts : forumPosts.filter(post => post.category === category.id);
                  const count = category.id === 'all' ? forumPosts.length : categoryPosts.length;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "hero" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span className="flex-1 text-left">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Topics List */}
          <div className="lg:col-span-3 space-y-4">
            {isLoading ? (
              <div className="grid gap-4">
                {[...Array(4)].map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                        <div className="flex-1 space-y-3">
                          <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-full animate-pulse rounded bg-muted" />
                          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : forumPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No posts in this lane yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to ask a question, share a fix, or start a van build discussion.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {user ? (
                      <Button variant="hero" onClick={() => setIsCreateOpen(true)}>
                        Create First Post
                      </Button>
                    ) : (
                      <Button variant="hero" onClick={() => window.location.assign('/auth')}>
                        Join Free to Post
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setSelectedCategory('all')}>
                      Browse All Categories
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Forum Posts */}
                {forumPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-glow transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{post.profiles?.display_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary cursor-pointer">
                                {post.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-muted-foreground">
                                  by {post.profiles?.display_name || 'Anonymous'}
                                </span>
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {post.category}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {post.content}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {post.replies_count || 0} replies
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {post.likes_count || 0} likes
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTimeAgo(post.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Load More */}
                <div className="text-center pt-8">
                  <Button variant="outline" size="lg">
                    Load More Topics
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Forum;
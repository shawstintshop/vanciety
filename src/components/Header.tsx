import { Button } from "@/components/ui/button";
import { Search, Menu, Bell, MessageSquare, MapPin, Video, Calendar, ShoppingBag, Crown, User, LogOut, Satellite } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            VanLife Community
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/videos" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <Video className="w-4 h-4" />
            <span>Videos</span>
          </Link>
          <Link to="/map" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <MapPin className="w-4 h-4" />
            <span>Map</span>
          </Link>
          <Link to="/forum" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>Forum</span>
          </Link>
          <Link to="/news" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <Calendar className="w-4 h-4" />
            <span>Events</span>
          </Link>
          <Link to="/marketplace" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <ShoppingBag className="w-4 h-4" />
            <span>Shop</span>
          </Link>
          <Link to="/gps" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <Satellite className="w-4 h-4" />
            <span>GPS</span>
          </Link>
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center bg-muted rounded-lg px-3 py-2 w-64">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Search vans, spots, videos..."
              className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-muted-foreground"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full"></span>
          </Button>

          <Button variant="hero" size="sm" className="hidden sm:flex items-center space-x-2" onClick={() => navigate('/auth')}>
            <Crown className="w-4 h-4" />
            <span>Go Premium</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link to="/videos" className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              <Video className="w-5 h-5" />
              <span className="font-medium">Videos</span>
            </Link>
            <Link to="/map" className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Map</span>
            </Link>
            <Link to="/forum" className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Forum</span>
            </Link>
            <Link to="/news" className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Events</span>
            </Link>
            <Link to="/marketplace" className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium">Shop</span>
            </Link>
            <Link to="/gps" className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              <Satellite className="w-5 h-5" />
              <span className="font-medium">GPS Tracking</span>
            </Link>
            <div className="pt-3 border-t border-border">
              <Button variant="hero" className="w-full mb-2" onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}>
                <Crown className="w-4 h-4 mr-2" />
                Go Premium
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
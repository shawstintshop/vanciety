import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Menu,
  Video,
  Calendar,
  ShoppingBag,
  Crown,
  User,
  LogOut,
  Satellite,
  Brain,
  Users,
  Sparkles,
  Wrench,
  MessageSquare,
  ChevronDown,
  FileCode,
  Layers,
  BookOpen,
  Star,
  Tag,
  PlusCircle,
  Package,
  Flame,
  MapPin,
  Zap,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import VancietyLogo from "./VancietyLogo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteSearch, setSiteSearch] = useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSiteSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = siteSearch.trim();
    if (!query) return;
    navigate(`/van-intelligence?topic=${encodeURIComponent(query)}`);
    setSiteSearch("");
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (paths: string[]) => paths.some((p) => location.pathname.startsWith(p));

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-primary/15 text-primary-glow"
        : "text-foreground/80 hover:bg-primary/10 hover:text-primary-glow"
    }`;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/80 bg-background/88 shadow-[0_10px_40px_rgba(0,0,0,.24)] backdrop-blur-xl">
      <div className="container mx-auto flex min-h-16 items-center justify-between gap-4 px-4 py-2">
        <VancietyLogo className="h-12 w-[180px] max-w-[200px] sm:h-14 sm:w-[220px] md:h-16 md:w-[240px]" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary navigation">

          {/* Explore dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={navLinkClass(isGroupActive(["/marketplace", "/shop", "/vendors", "/van-intelligence", "/videos"]))}>
                <ShoppingBag className="h-4 w-4" />
                Explore
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 border-border bg-popover text-popover-foreground">
              <DropdownMenuItem onClick={() => navigate("/marketplace")}>
                <Package className="mr-2 h-4 w-4 text-primary-glow" />
                Marketplace
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/vendors")}>
                <Wrench className="mr-2 h-4 w-4 text-secondary" />
                Vendors
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/van-intelligence")}>
                <Brain className="mr-2 h-4 w-4 text-accent" />
                Van Intelligence
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/videos")}>
                <Video className="mr-2 h-4 w-4 text-muted-foreground" />
                How-To Videos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Events — now lives on the merged map */}
          <Link to="/events" className={navLinkClass(isActive("/events"))}>
            <Calendar className="h-4 w-4" />
            Events
          </Link>

          {/* Community dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={navLinkClass(isGroupActive(["/forum", "/map", "/van-cards", "/dashboard", "/friend-finder", "/campfire", "/journals", "/resources", "/icebreaker"]))}>
                <Users className="h-4 w-4" />
                Community
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 border-border bg-popover text-popover-foreground">
              <DropdownMenuItem onClick={() => navigate("/forum")}>
                <MessageSquare className="mr-2 h-4 w-4 text-primary-glow" />
                Forum
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/friend-finder")}>
                <Users className="mr-2 h-4 w-4 text-secondary" />
                Find Members
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/van-cards")}>
                <Satellite className="mr-2 h-4 w-4 text-muted-foreground" />
                Van Cards
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/campfire")}>
                <Flame className="mr-2 h-4 w-4 text-orange-400" />
                Campfire Boards
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/journals")}>
                <BookOpen className="mr-2 h-4 w-4 text-emerald-400" />
                Trip Journals
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/resources")}>
                <MapPin className="mr-2 h-4 w-4 text-green-400" />
                Resource Board
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/icebreaker")}>
                <Zap className="mr-2 h-4 w-4 text-violet-400" />
                Icebreaker
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Vana — direct */}
          <Link to="/ai" className={navLinkClass(isActive("/ai"))}>
            <Sparkles className="h-4 w-4" />
            Vana
          </Link>

        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 lg:gap-3">
          <form
            onSubmit={handleSiteSearch}
            className="hidden items-center rounded-full border border-border/80 bg-card/80 px-3 py-2 shadow-sm ring-1 ring-white/5 focus-within:border-primary/60 sm:flex lg:w-56"
          >
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={siteSearch}
              onChange={(event) => setSiteSearch(event.target.value)}
              placeholder="Search parts, guides, gear..."
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search Vanciety"
            />
          </form>

          {/* Sell CTA */}
          <Button
            variant="outline"
            size="sm"
            className="hidden items-center gap-2 sm:flex text-foreground border-secondary/50 hover:border-secondary hover:text-secondary"
            onClick={() => navigate("/shop")}
          >
            <PlusCircle className="h-4 w-4" />
            Sell
          </Button>

          <Button
            variant="hero"
            size="sm"
            className="hidden items-center gap-2 sm:flex"
            onClick={() => navigate(user ? "/dashboard" : "/auth")}
          >
            <Crown className="h-4 w-4" />
            {user ? "My Account" : "Join Free"}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-border bg-popover text-popover-foreground">
                <DropdownMenuItem onClick={() => navigate("/van-cards")}>My Listings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/van-cards")}>Van Cards</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground md:flex xl:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-border/80 bg-background/96 backdrop-blur-xl xl:hidden">
          <nav className="container mx-auto px-4 py-4" aria-label="Mobile navigation">

            <div className="mb-3 text-[11px] uppercase tracking-widest text-muted-foreground">Explore</div>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {[
                { label: "Marketplace", to: "/marketplace", icon: Package },
                { label: "Vendors", to: "/vendors", icon: Wrench },
                { label: "Van Intelligence", to: "/van-intelligence", icon: Brain },
                { label: "How-To Videos", to: "/videos", icon: Video },
                { label: "Sell an Item", to: "/shop", icon: PlusCircle },
              ].map(({ label, to, icon: Icon }) => (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-primary/10 hover:text-primary-glow"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="mb-3 text-[11px] uppercase tracking-widest text-muted-foreground">Community</div>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {[
                { label: "Events", to: "/events", icon: Calendar },
                { label: "Forum", to: "/forum", icon: MessageSquare },
                { label: "Find Members", to: "/friend-finder", icon: Users },
                { label: "Campfire", to: "/campfire", icon: Flame },
                { label: "Trip Journals", to: "/journals", icon: BookOpen },
                { label: "Resources", to: "/resources", icon: MapPin },
                { label: "Icebreaker", to: "/icebreaker", icon: Zap },
                { label: "Vana AI", to: "/ai", icon: Sparkles },
              ].map(({ label, to, icon: Icon }) => (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-primary/10 hover:text-primary-glow"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                className="w-full border-secondary/50 text-foreground"
                onClick={() => { navigate("/shop"); setIsMenuOpen(false); }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Sell an Item
              </Button>
              <Button
                variant="hero"
                className="w-full"
                onClick={() => { navigate(user ? "/van-cards" : "/auth"); setIsMenuOpen(false); }}
              >
                <Crown className="mr-2 h-4 w-4" />
                {user ? "My Account" : "Join Free"}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

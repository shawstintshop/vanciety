/**
 * Header — Vanciety Global Navigation
 * Design: Matches reference merch page layout
 * - Gold announcement bar at very top
 * - Matte black nav bar (#0d0d0d)
 * - Large logo top-left (badge variant)
 * - Nav links in gold (#c9a96e) with dropdown menus
 * - Search, Sell, Join Free on right
 * - Mobile hamburger menu
 */
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
  BookOpen,
  PlusCircle,
  Package,
  Flame,
  MapPin,
  Compass,
  Shirt,
  X,
  Hammer,
  Printer,
  Rss,
} from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useLatestVideos } from "@/hooks/useLatestVideos";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteSearch, setSiteSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { newCount: newVideoCount } = useLatestVideos();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

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
    `flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold tracking-[0.12em] uppercase transition-all duration-150 ${
      active
        ? "text-[#c9a96e] border-b-2 border-[#c9a96e]"
        : "text-[#e8dcc8]/80 hover:text-[#c9a96e]"
    }`;

  const ddItem = "hover:bg-[#1a1a1a] hover:text-[#c9a96e] focus:bg-[#1a1a1a] focus:text-[#c9a96e] cursor-pointer";

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      {/* Main Nav Bar */}
      <nav style={{ background: scrolled ? "rgba(13,13,13,0.97)" : "#0d0d0d", borderBottom: "1px solid rgba(46,46,46,0.8)", backdropFilter: scrolled ? "blur(12px)" : "none", transition: "background 0.2s ease" }}>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 md:px-6" style={{ height: "64px" }}>

          {/* Logo — large, top-left */}
          <Link to="/" className="flex shrink-0 items-center" aria-label="Vanciety Home">
            <img src="/images/vanciety-logo-badge.png" alt="Vanciety" style={{ height: "48px", width: "auto", objectFit: "contain" }} />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center xl:flex" style={{ gap: "2px" }}>

            {/* SHOP dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={navLinkClass(isGroupActive(["/marketplace", "/shop", "/vendors", "/van-intelligence", "/videos", "/merch", "/makers", "/3d-files"]))}>
                  SHOP <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 border-[#2e2e2e] bg-[#0d0d0d] text-[#e8dcc8]">
                <DropdownMenuItem onClick={() => navigate("/marketplace")} className={ddItem}>
                  <Package className="mr-2 h-4 w-4 text-[#c9a96e]" /> Marketplace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/vendors")} className={ddItem}>
                  <Wrench className="mr-2 h-4 w-4 text-[#c9a96e]" /> Vendors
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/van-intelligence")} className={ddItem}>
                  <Brain className="mr-2 h-4 w-4 text-[#c9a96e]" /> Van Intelligence
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/videos")} className={ddItem}>
                  <Video className="mr-2 h-4 w-4 text-[#c9a96e]" /> How-To Videos
                  {newVideoCount > 0 && (
                    <span className="ml-auto min-w-[18px] h-[18px] bg-[#c9a96e] text-[10px] font-bold text-black rounded-full flex items-center justify-center px-1">{newVideoCount}</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#2e2e2e]" />
                <DropdownMenuItem onClick={() => navigate("/makers")} className={ddItem}>
                  <Hammer className="mr-2 h-4 w-4 text-[#c9a96e]" /> Maker Marketplace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/3d-files")} className={ddItem}>
                  <Printer className="mr-2 h-4 w-4 text-[#c9a96e]" /> 3D Print Files
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#2e2e2e]" />
                <DropdownMenuItem onClick={() => navigate("/merch")} className={ddItem}>
                  <Shirt className="mr-2 h-4 w-4 text-[#c9a96e]" /> Merch Store
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/shop")} className={ddItem}>
                  <ShoppingBag className="mr-2 h-4 w-4 text-[#c9a96e]" /> Van Gear Shop
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* DIRECTORY dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={navLinkClass(isGroupActive(["/directory", "/manufacturers", "/companies", "/resources"]))}>
                  DIRECTORY <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 border-[#2e2e2e] bg-[#0d0d0d] text-[#e8dcc8]">
                <DropdownMenuItem onClick={() => navigate("/directory")} className={ddItem}>
                  <Wrench className="mr-2 h-4 w-4 text-[#c9a96e]" /> Business Directory
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/resources")} className={ddItem}>
                  <MapPin className="mr-2 h-4 w-4 text-[#c9a96e]" /> Resource Board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* EVENTS */}
            <Link to="/events" className={navLinkClass(isActive("/events"))}>EVENTS</Link>

            {/* COMMUNITY dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={navLinkClass(isGroupActive(["/forum", "/map", "/van-cards", "/friend-finder", "/campfire", "/journals", "/icebreaker", "/spots", "/feed"]))}>
                  COMMUNITY <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 border-[#2e2e2e] bg-[#0d0d0d] text-[#e8dcc8]">
                <DropdownMenuItem onClick={() => navigate("/feed")} className={ddItem}>
                  <Rss className="mr-2 h-4 w-4 text-[#c9a96e]" /> Social Feed Hub
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#2e2e2e]" />
                <DropdownMenuItem onClick={() => navigate("/forum")} className={ddItem}>
                  <MessageSquare className="mr-2 h-4 w-4 text-[#c9a96e]" /> Forum
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/friend-finder")} className={ddItem}>
                  <Users className="mr-2 h-4 w-4 text-[#c9a96e]" /> Find Members
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/van-cards")} className={ddItem}>
                  <Satellite className="mr-2 h-4 w-4 text-[#c9a96e]" /> Van Cards
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#2e2e2e]" />
                <DropdownMenuItem onClick={() => navigate("/campfire")} className={ddItem}>
                  <Flame className="mr-2 h-4 w-4 text-orange-400" /> Campfire Boards
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/journals")} className={ddItem}>
                  <BookOpen className="mr-2 h-4 w-4 text-[#c9a96e]" /> Trip Journals
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/spots")} className={ddItem}>
                  <MapPin className="mr-2 h-4 w-4 text-[#c9a96e]" /> Van Life Spots
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/icebreaker")} className={ddItem}>
                  <Compass className="mr-2 h-4 w-4 text-[#c9a96e]" /> Member Tips
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ABOUT */}
            <Link to="/about" className={navLinkClass(isActive("/about"))}>ABOUT</Link>

            {/* JOIN THE CREW */}
            <Link to="/auth" className={navLinkClass(isActive("/auth"))}>JOIN THE CREW</Link>

            {/* VANA AI */}
            <Link to="/ai" className={navLinkClass(isActive("/ai"))}>
              <Sparkles className="h-3.5 w-3.5" /> VANA AI
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <form onSubmit={handleSiteSearch} className="hidden items-center rounded border border-[#2e2e2e] bg-[#1a1a1a] px-3 py-1.5 focus-within:border-[#c9a96e]/60 sm:flex lg:w-48">
              <Search className="mr-2 h-3.5 w-3.5 text-[#777]" />
              <input type="search" value={siteSearch} onChange={(e) => setSiteSearch(e.target.value)} placeholder="Search..." className="min-w-0 flex-1 bg-transparent text-xs text-[#e8dcc8] outline-none placeholder:text-[#555]" aria-label="Search Vanciety" />
            </form>

            {/* Sell */}
            <button onClick={() => navigate("/shop")} className="hidden items-center gap-1.5 rounded border border-[#2e2e2e] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8dcc8] transition-colors hover:border-[#c9a96e] hover:text-[#c9a96e] sm:flex">
              <PlusCircle className="h-3.5 w-3.5" /> Sell
            </button>

            {/* Join Free / My Account */}
            <button
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              style={{ background: "#c9a96e", color: "#0d0d0d", border: "none", padding: "7px 16px", fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.15s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#d4b87a"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#c9a96e"; }}
              className="hidden sm:block"
            >
              {user ? "My Account" : "Join Free"}
            </button>

            {/* Account dropdown (signed in) */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded border border-[#2e2e2e] px-2 py-1.5 text-[#e8dcc8] transition-colors hover:border-[#c9a96e] hover:text-[#c9a96e]">
                    <User className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-[#2e2e2e] bg-[#0d0d0d] text-[#e8dcc8]">
                  <DropdownMenuItem onClick={() => navigate("/profile")} className={ddItem}>My Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className={ddItem}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/van-cards")} className={ddItem}>Van Cards</DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#2e2e2e]" />
                  <DropdownMenuItem onClick={handleSignOut} className="hover:bg-[#1a1a1a] hover:text-red-400 focus:bg-[#1a1a1a] focus:text-red-400 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center justify-center rounded border border-[#2e2e2e] p-2 text-[#e8dcc8] transition-colors hover:border-[#c9a96e] hover:text-[#c9a96e] xl:hidden" aria-expanded={isMenuOpen} aria-label="Toggle navigation">
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

      </nav>
      {/* Mobile Menu — rendered outside nav to avoid overflow clipping */}
      {isMenuOpen && (
        <div style={{ background: "#0d0d0d", borderTop: "1px solid #2e2e2e", maxHeight: "calc(100dvh - 64px)", overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", position: "absolute", top: "64px", left: 0, right: 0, zIndex: 48, boxShadow: "0 8px 32px rgba(0,0,0,0.7)" }}>
          <div style={{ display: "contents" }}>
            <div className="mx-auto max-w-[1400px] px-4 py-5">
              <form onSubmit={handleSiteSearch} className="mb-5 flex items-center rounded border border-[#2e2e2e] bg-[#1a1a1a] px-3 py-2">
                <Search className="mr-2 h-4 w-4 text-[#777]" />
                <input type="search" value={siteSearch} onChange={(e) => setSiteSearch(e.target.value)} placeholder="Search parts, guides, gear..." className="min-w-0 flex-1 bg-transparent text-sm text-[#e8dcc8] outline-none placeholder:text-[#555]" />
              </form>

              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a96e]">Explore</div>
              <div className="mb-5 grid grid-cols-2 gap-2">
                {[
                  { label: "Marketplace", to: "/marketplace", icon: Package },
                  { label: "Directory", to: "/directory", icon: Wrench },
                  { label: "Maker Market", to: "/makers", icon: Hammer },
                  { label: "3D Print Files", to: "/3d-files", icon: Printer },
                  { label: "Van Intelligence", to: "/van-intelligence", icon: Brain },
                  { label: "How-To Videos", to: "/videos", icon: Video },
                  { label: "Merch Store", to: "/merch", icon: Shirt },
                  { label: "Van Gear Shop", to: "/shop", icon: ShoppingBag },
                ].map(({ label, to, icon: Icon }) => (
                  <Link key={label} to={to} className="flex items-center gap-2 rounded border border-[#2e2e2e] px-3 py-2.5 text-xs font-semibold text-[#e8dcc8] transition-colors hover:border-[#c9a96e] hover:text-[#c9a96e]" onClick={() => setIsMenuOpen(false)}>
                    <Icon className="h-4 w-4 shrink-0 text-[#c9a96e]" /> {label}
                  </Link>
                ))}
              </div>

              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a96e]">Community</div>
              <div className="mb-5 grid grid-cols-2 gap-2">
                {[
                  { label: "Social Feed", to: "/feed", icon: Rss },
                  { label: "Events", to: "/events", icon: Calendar },
                  { label: "Forum", to: "/forum", icon: MessageSquare },
                  { label: "Van Life Spots", to: "/spots", icon: MapPin },
                  { label: "Find Members", to: "/friend-finder", icon: Users },
                  { label: "Campfire", to: "/campfire", icon: Flame },
                  { label: "Trip Journals", to: "/journals", icon: BookOpen },
                  { label: "Resources", to: "/resources", icon: MapPin },
                  { label: "Member Tips", to: "/icebreaker", icon: Compass },
                  { label: "Vana AI", to: "/ai", icon: Sparkles },
                ].map(({ label, to, icon: Icon }) => (
                  <Link key={label} to={to} className="flex items-center gap-2 rounded border border-[#2e2e2e] px-3 py-2.5 text-xs font-semibold text-[#e8dcc8] transition-colors hover:border-[#c9a96e] hover:text-[#c9a96e]" onClick={() => setIsMenuOpen(false)}>
                    <Icon className="h-4 w-4 shrink-0 text-[#c9a96e]" /> {label}
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => { navigate("/shop"); setIsMenuOpen(false); }} className="flex items-center justify-center gap-2 rounded border border-[#2e2e2e] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#e8dcc8] transition-colors hover:border-[#c9a96e] hover:text-[#c9a96e]">
                  <PlusCircle className="h-4 w-4" /> Sell an Item
                </button>
                <button onClick={() => { navigate(user ? "/van-cards" : "/auth"); setIsMenuOpen(false); }} style={{ background: "#c9a96e", color: "#0d0d0d", border: "none", fontWeight: 800, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }} className="flex items-center justify-center gap-2 rounded px-3 py-2.5">
                  <Crown className="h-4 w-4" /> {user ? "My Account" : "Join Free"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

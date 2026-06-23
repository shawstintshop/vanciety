import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Videos from "./pages/Videos";
import News from "./pages/News";
import Map from "./pages/Map";
import Forum from "./pages/Forum";
import Marketplace from "./pages/Marketplace";
import Vendors from "./pages/Vendors";
import VendorSignup from "./pages/VendorSignup";
import Manufacturers from "./pages/Manufacturers";
import ManufacturerDetail from "./pages/ManufacturerDetail";
import Companies from "./pages/Companies";
import CompanyProfile from "./pages/CompanyProfile";
import VendorDashboard from "./pages/VendorDashboard";
import ForVendors from "./pages/ForVendors";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import GPSTracking from "./pages/GPSTracking";
import VanCards from "./pages/VanCards";
import VanIntelligence from "./pages/VanIntelligence";
import FriendFinder from "./pages/FriendFinder";
import AIConcierge from "./pages/AIConcierge";
import About from "./pages/About";
import VancietyShop from "./pages/VancietyShop";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Accessibility from "./pages/Accessibility";
import Campfire from "./pages/Campfire";
import TripJournals from "./pages/TripJournals";
import ResourceBoard from "./pages/ResourceBoard";
import Icebreaker from "./pages/Icebreaker";
import VanLifeSpots from "./pages/VanLifeSpots";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import SiteFooter from "./components/SiteFooter";

const queryClient = new QueryClient();

// Pages that use a fixed full-screen layout must suppress the global footer
// to prevent the footer logo from bleeding through the map overlay.
const FULL_SCREEN_ROUTES = ["/events", "/map"];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isFullScreen = FULL_SCREEN_ROUTES.includes(location.pathname);
  return (
    <div className="vanciety-content-shell">
      {children}
      {!isFullScreen && <SiteFooter />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/news" element={<News />} />
              <Route path="/map" element={<Map />} />
              <Route path="/spots" element={<VanLifeSpots />} />
              <Route path="/events" element={<Map />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/shop" element={<VancietyShop />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/vendor-signup" element={<VendorSignup />} />
              <Route path="/manufacturers" element={<Manufacturers />} />
              <Route path="/manufacturers/:slug" element={<ManufacturerDetail />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/companies/:slug" element={<CompanyProfile />} />
              <Route path="/for-vendors" element={<ForVendors />} />
              <Route path="/dashboard/vendor" element={<VendorDashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/gps" element={<GPSTracking />} />
              <Route path="/van-cards" element={<VanCards />} />
              <Route path="/van-intelligence" element={<VanIntelligence />} />
              <Route path="/friend-finder" element={<FriendFinder />} />
              <Route path="/ai" element={<AIConcierge />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/campfire" element={<Campfire />} />
              <Route path="/journals" element={<TripJournals />} />
              <Route path="/resources" element={<ResourceBoard />} />
              <Route path="/icebreaker" element={<Icebreaker />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

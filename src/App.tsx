import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Videos from "./pages/Videos";
import News from "./pages/News";
import Map from "./pages/Map";
import Forum from "./pages/Forum";
import Marketplace from "./pages/Marketplace";
import Vendors from "./pages/Vendors";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import GPSTracking from "./pages/GPSTracking";
import VanCards from "./pages/VanCards";
import VanIntelligence from "./pages/VanIntelligence";
import FriendFinder from "./pages/FriendFinder";
import AIConcierge from "./pages/AIConcierge";
import About from "./pages/About";
import VancietyShop from "./pages/VancietyShop";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import VancietyTopoSystem from "./components/VancietyTopoSystem";
import SiteFooter from "./components/SiteFooter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <VancietyTopoSystem />
          <div className="vanciety-content-shell">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/news" element={<News />} />
              <Route path="/map" element={<Map />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/shop" element={<VancietyShop />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/gps" element={<GPSTracking />} />
              <Route path="/van-cards" element={<VanCards />} />
              <Route path="/van-intelligence" element={<VanIntelligence />} />
              <Route path="/friend-finder" element={<FriendFinder />} />
              <Route path="/ai" element={<AIConcierge />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SiteFooter />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
// Trigger Vercel redeploy

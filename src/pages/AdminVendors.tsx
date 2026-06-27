import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Check, X, ExternalLink, Search, RefreshCw, Shield,
  Building, MapPin, Globe, Phone, Mail, Clock
} from "lucide-react";

const ADMIN_EMAILS = ["shaw@vanciety.com", "admin@vanciety.com"];

type Vendor = {
  id: string;
  business_name: string;
  category: string;
  description: string;
  location: string;
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  logo_url: string | null;
  status: string;
  subscription_tier: string;
  created_at: string;
  services: string[] | null;
};

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminVendors() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Simple admin gate
  const isAdmin = user && (ADMIN_EMAILS.includes(user.email || "") || user.email?.endsWith("@vanciety.com"));

  const fetchVendors = async () => {
    setLoading(true);
    try {
      let q = (supabase as any).from("vendors").select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      setVendors(data ?? []);
    } catch (err: any) {
      toast({ title: "Error loading vendors", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchVendors();
  }, [user, filter]);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setActionLoading(id);
    try {
      const { error } = await (supabase as any)
        .from("vendors")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      toast({ title: status === "approved" ? "✅ Vendor approved" : "❌ Vendor rejected", description: "Status updated." });
      setVendors((prev) => prev.map((v) => v.id === id ? { ...v, status } : v));
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = vendors.filter((v) =>
    !search || v.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    v.category?.toLowerCase().includes(search.toLowerCase()) ||
    v.location?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    all: vendors.length,
    pending: vendors.filter((v) => v.status === "pending").length,
    approved: vendors.filter((v) => v.status === "approved").length,
    rejected: vendors.filter((v) => v.status === "rejected").length,
  };

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-bold">Access Restricted</h1>
            <p className="text-muted-foreground">This page is only accessible to Vanciety admins.</p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="w-7 h-7 text-primary" />
                Vendor Approvals
              </h1>
              <p className="text-muted-foreground mt-1">Review and approve vendor listings before they go live.</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchVendors} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {(["all", "pending", "approved", "rejected"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  filter === s ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="text-2xl font-bold">{counts[s]}</p>
                <p className="text-sm text-muted-foreground capitalize">{s}</p>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Vendor list */}
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading vendors...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Building className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No vendors found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Logo */}
                      <div className="w-full md:w-24 h-24 bg-muted flex items-center justify-center shrink-0">
                        {vendor.logo_url ? (
                          <img src={vendor.logo_url} alt={vendor.business_name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <Building className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-wrap items-start gap-2 mb-2">
                          <h3 className="font-bold text-lg">{vendor.business_name}</h3>
                          <Badge className={`text-xs border ${statusColor[vendor.status] || ""}`}>
                            {vendor.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">{vendor.category}</Badge>
                          <Badge variant="outline" className="text-xs">{vendor.subscription_tier}</Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{vendor.description}</p>

                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          {vendor.location && (
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{vendor.location}</span>
                          )}
                          {vendor.website_url && (
                            <a href={vendor.website_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline">
                              <Globe className="w-3 h-3" />{vendor.website_url.replace(/^https?:\/\//, "")}
                            </a>
                          )}
                          {vendor.contact_email && (
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{vendor.contact_email}</span>
                          )}
                          {vendor.contact_phone && (
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{vendor.contact_phone}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(vendor.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {vendor.services && vendor.services.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {vendor.services.slice(0, 5).map((s) => (
                              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2 p-4 border-t md:border-t-0 md:border-l border-border justify-end md:justify-center">
                        {vendor.website_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={vendor.website_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3.5 h-3.5 mr-1" /> Visit
                            </a>
                          </Button>
                        )}
                        {vendor.status !== "approved" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateStatus(vendor.id, "approved")}
                            disabled={actionLoading === vendor.id}
                          >
                            <Check className="w-3.5 h-3.5 mr-1" /> Approve
                          </Button>
                        )}
                        {vendor.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateStatus(vendor.id, "rejected")}
                            disabled={actionLoading === vendor.id}
                          >
                            <X className="w-3.5 h-3.5 mr-1" /> Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

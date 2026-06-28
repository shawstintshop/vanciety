/**
 * ResourceBoard — Utility Resource Sharing
 *
 * Design: pure utility, zero social required
 * - Browse water, dump stations, overnight parking, mechanics, propane, laundry, wifi
 * - Add spots by city/state — no exact GPS stored
 * - Upvote useful spots
 * - Filter by category and free/paid
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Droplets, Trash2, ParkingSquare, Wrench, Flame, WashingMachine, Wifi,
  Plus, ThumbsUp, MapPin, Loader2, Package
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { useNavigate } from "react-router-dom";

type Category = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

const CATEGORIES: Category[] = [
  { id: "water", label: "Water Fill", icon: Droplets, color: "text-primary" },
  { id: "dump_station", label: "Dump Station", icon: Trash2, color: "text-primary" },
  { id: "overnight_parking", label: "Overnight Parking", icon: ParkingSquare, color: "text-primary" },
  { id: "mechanic", label: "Mechanic", icon: Wrench, color: "text-primary" },
  { id: "propane", label: "Propane", icon: Flame, color: "text-primary" },
  { id: "laundry", label: "Laundry", icon: WashingMachine, color: "text-primary" },
  { id: "wifi", label: "Free WiFi", icon: Wifi, color: "text-primary" },
  { id: "other", label: "Other", icon: Package, color: "text-muted-foreground" },
];

type Spot = {
  id: string;
  user_id: string;
  category: string;
  label: string;
  description: string | null;
  city: string;
  state_region: string | null;
  country: string;
  is_free: boolean;
  upvotes: number;
  created_at: string;
};

export default function ResourceBoard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [newSpot, setNewSpot] = useState({
    category: "water",
    label: "",
    description: "",
    city: "",
    state_region: "",
    country: "US",
    is_free: true,
  });

  const fetchSpots = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("resource_spots")
      .select("*")
      .eq("is_active", true)
      .order("upvotes", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(60);

    if (activeCategory !== "all") query = query.eq("category", activeCategory);
    if (freeOnly) query = query.eq("is_free", true);
    if (searchCity.trim()) query = query.ilike("city", `%${searchCity.trim()}%`);

    const { data } = await query;
    setSpots((data as Spot[]) ?? []);
    setLoading(false);
  }, [activeCategory, freeOnly, searchCity]);

  useEffect(() => { fetchSpots(); }, [fetchSpots]);

  const submitSpot = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!newSpot.label.trim() || !newSpot.city.trim()) {
      toast.error("Name and city are required");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("resource_spots").insert({
      user_id: user.id,
      category: newSpot.category,
      label: newSpot.label.trim(),
      description: newSpot.description.trim() || null,
      city: newSpot.city.trim(),
      state_region: newSpot.state_region.trim() || null,
      country: newSpot.country,
      is_free: newSpot.is_free,
    });
    if (error) {
      toast.error("Couldn't add spot");
    } else {
      toast.success("Spot added — thanks for helping the community 🙌");
      setCreateOpen(false);
      setNewSpot({ category: "water", label: "", description: "", city: "", state_region: "", country: "US", is_free: true });
      fetchSpots();
    }
    setSubmitting(false);
  };

  const upvote = async (spot: Spot) => {
    if (!user) { navigate("/auth"); return; }
    const { error } = await supabase
      .from("resource_spots")
      .update({ upvotes: spot.upvotes + 1 })
      .eq("id", spot.id);
    if (!error) {
      setSpots((prev) => prev.map((s) => s.id === spot.id ? { ...s, upvotes: s.upvotes + 1 } : s));
    }
  };

  const getCat = (id: string) => CATEGORIES.find((c) => c.id === id);

  return (
    <div className="min-h-screen bg-background text-foreground topo-card">
      <Header />
      <div className="container mx-auto max-w-5xl px-4 pt-16 sm:pt-20 pb-16">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Resource Board</h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-lg">
              Crowd-sourced utility spots — water, dump stations, parking, mechanics and more. Pure utility, no social required.
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0 gap-2">
                <Plus className="h-4 w-4" />
                Add Spot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg border-border bg-card text-card-foreground">
              <DialogHeader>
                <DialogTitle>Add a resource spot</DialogTitle>
                <DialogDescription>
                  City and state only — no exact address or GPS needed. Help fellow van lifers find what they need.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={newSpot.category} onValueChange={(v) => setNewSpot((s) => ({ ...s, category: v }))}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="spot-label">Name / Description</Label>
                  <Input
                    id="spot-label"
                    placeholder="e.g. Walmart Supercenter — free water spigot outside"
                    value={newSpot.label}
                    onChange={(e) => setNewSpot((s) => ({ ...s, label: e.target.value }))}
                    maxLength={100}
                    className="bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="spot-city">City</Label>
                    <Input
                      id="spot-city"
                      placeholder="Portland"
                      value={newSpot.city}
                      onChange={(e) => setNewSpot((s) => ({ ...s, city: e.target.value }))}
                      maxLength={80}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="spot-state">State / Region</Label>
                    <Input
                      id="spot-state"
                      placeholder="OR"
                      value={newSpot.state_region}
                      onChange={(e) => setNewSpot((s) => ({ ...s, state_region: e.target.value }))}
                      maxLength={80}
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="spot-desc">Notes (optional)</Label>
                  <Textarea
                    id="spot-desc"
                    placeholder="Hours, tips, anything useful..."
                    value={newSpot.description}
                    onChange={(e) => setNewSpot((s) => ({ ...s, description: e.target.value }))}
                    maxLength={400}
                    rows={3}
                    className="bg-background resize-none"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="spot-free" className="cursor-pointer text-sm">Free to use</Label>
                  <Switch
                    id="spot-free"
                    checked={newSpot.is_free}
                    onCheckedChange={(v) => setNewSpot((s) => ({ ...s, is_free: v }))}
                  />
                </div>
                <Button className="w-full" onClick={submitSpot} disabled={submitting}>
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Add to Resource Board
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search by city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="w-48 bg-card/40"
          />
          <div className="flex items-center gap-2">
            <Switch id="free-only" checked={freeOnly} onCheckedChange={setFreeOnly} />
            <Label htmlFor="free-only" className="cursor-pointer text-sm text-muted-foreground">Free only</Label>
          </div>
        </div>

        {/* Category tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              activeCategory === "all"
                ? "bg-primary/20 text-primary-glow ring-1 ring-primary/40"
                : "bg-card/40 text-muted-foreground hover:bg-card/80 hover:text-foreground ring-1 ring-border/40"
            )}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                activeCategory === c.id
                  ? "bg-primary/20 text-primary-glow ring-1 ring-primary/40"
                  : "bg-card/40 text-muted-foreground hover:bg-card/80 hover:text-foreground ring-1 ring-border/40"
              )}
            >
              <c.icon className={cn("h-3 w-3", c.color)} />
              {c.label}
            </button>
          ))}
        </div>

        {/* Spots grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : spots.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center">
            <MapPin className="mx-auto mb-3 h-8 w-8 text-primary/40" />
            <p className="text-muted-foreground text-sm">No spots found.</p>
            <p className="text-muted-foreground text-xs mt-1">Add the first one and help the community.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {spots.map((spot) => {
              const cat = getCat(spot.category);
              const CatIcon = cat?.icon ?? Package;
              return (
                <div
                  key={spot.id}
                  className="rounded-xl border border-border/50 bg-card/30 px-5 py-4 hover:border-border hover:bg-card/60 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <CatIcon className={cn("h-5 w-5 shrink-0 mt-0.5", cat?.color ?? "text-muted-foreground")} />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm line-clamp-1">{spot.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {spot.city}{spot.state_region ? `, ${spot.state_region}` : ""} · {spot.country}
                        </p>
                        {spot.description && (
                          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{spot.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs px-2 py-0",
                              spot.is_free
                                ? "border-primary/40 text-primary"
                                : "border-border/60 text-muted-foreground"
                            )}
                          >
                            {spot.is_free ? "Free" : "Paid"}
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0 border-border/40 text-muted-foreground">
                            {cat?.label ?? spot.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => upvote(spot)}
                      className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary-glow transition-all shrink-0"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-xs font-medium">{spot.upvotes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

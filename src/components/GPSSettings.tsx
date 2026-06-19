import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  MapPin,
  Navigation,
  Shield,
  ShieldAlert,
  Timer,
  Truck,
  Wifi,
  WifiOff,
  Radio,
} from "lucide-react";
import { useVanLocation, type SharingVisibility, type SharingPrecision, type SharingDuration } from "@/hooks/useVanLocation";
import { useAuth } from "@/contexts/AuthContext";

const GPSSettings = () => {
  const { user } = useAuth();
  const {
    settings,
    saveSettings,
    isTracking,
    currentPosition,
    locationError,
    settingsLoading,
    toggleSharing,
    emergencyStop,
  } = useVanLocation();

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
          <p className="text-muted-foreground">
            You need to be signed in to use GPS tracking features.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (settingsLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading GPS settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Master Toggle */}
      <Card className={isTracking ? "border-primary/50 shadow-glow" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isTracking ? (
                <div className="relative">
                  <Radio className="w-6 h-6 text-primary animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                </div>
              ) : (
                <WifiOff className="w-6 h-6 text-muted-foreground" />
              )}
              <div>
                <CardTitle>Van GPS Tracking</CardTitle>
                <CardDescription>
                  {isTracking
                    ? "Your van area is being shared with members"
                    : "Share your approximate van area with members"
                  }
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={settings.sharing_enabled}
              onCheckedChange={(checked) => toggleSharing(checked)}
            />
          </div>
        </CardHeader>

        {isTracking && currentPosition && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <MapPin className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Shared area</p>
                <p className="text-sm font-medium">City/area only</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Shield className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Exact GPS</p>
                <p className="text-sm font-medium">Hidden in UI</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Navigation className="w-4 h-4 mx-auto mb-1 text-accent" />
                <p className="text-xs text-muted-foreground">Speed</p>
                <p className="text-sm font-mono font-medium">
                  {currentPosition.coords.speed
                    ? `${(currentPosition.coords.speed * 2.237).toFixed(0)} mph`
                    : "Parked"
                  }
                </p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Wifi className="w-4 h-4 mx-auto mb-1 text-green-500" />
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="text-sm font-mono font-medium">
                  {currentPosition.coords.accuracy
                    ? `${currentPosition.coords.accuracy.toFixed(0)}m`
                    : "N/A"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        )}

        {locationError && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{locationError}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Privacy Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy Controls
          </CardTitle>
          <CardDescription>
            Control who sees your location and how precise it is
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visibility */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Who can see my location
            </Label>
            <Select
              value={settings.default_visibility}
              onValueChange={(v) => saveSettings({ default_visibility: v as SharingVisibility })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friends_only">
                  <span className="flex items-center gap-2">
                    Vanciety members only
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Precision */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              {settings.default_precision === 'exact' ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              Location precision
            </Label>
            <Select
              value={settings.default_precision}
              onValueChange={(v) => saveSettings({ default_precision: v as SharingPrecision })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approximate">City / area only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Friend Finder uses approximate member areas only. Exact GPS is used locally to create a safe area marker and is not shown in the UI.
            </p>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Share duration
            </Label>
            <Select
              value={settings.default_duration}
              onValueChange={(v) => saveSettings({ default_duration: v as SharingDuration })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="until_off">Until I turn it off</SelectItem>
                <SelectItem value="24h">24 hours</SelectItem>
                <SelectItem value="1_week">1 week</SelectItem>
                <SelectItem value="forever">Always on</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto-pause */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Auto-pause after inactivity
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[settings.auto_pause_hours]}
                onValueChange={([v]) => saveSettings({ auto_pause_hours: v })}
                min={0}
                max={24}
                step={1}
                className="flex-1"
              />
              <Badge variant="secondary" className="min-w-[80px] justify-center">
                {settings.auto_pause_hours === 0
                  ? "Disabled"
                  : `${settings.auto_pause_hours}h`
                }
              </Badge>
            </div>
          </div>

          {/* Update interval */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Update frequency
            </Label>
            <Select
              value={String(settings.update_interval_sec)}
              onValueChange={(v) => saveSettings({ update_interval_sec: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Every 15 seconds (high battery use)</SelectItem>
                <SelectItem value="30">Every 30 seconds (recommended)</SelectItem>
                <SelectItem value="60">Every 60 seconds (battery saver)</SelectItem>
                <SelectItem value="300">Every 5 minutes (minimal)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Hardware Tracker Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Hardware GPS Trackers
          </CardTitle>
          <CardDescription>
            For always-on tracking even when your phone is off
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Popular van-friendly GPS trackers planned for Vanciety hardware integrations (coming soon):
          </p>
          <div className="grid gap-3">
            {[
              { name: "Bouncie", desc: "OBD-II plug-in tracker, real-time GPS + diagnostics", tag: "Recommended" },
              { name: "Spytec GL300", desc: "Mini portable tracker, 2-week battery life", tag: "Portable" },
              { name: "LandAirSea 54", desc: "Magnetic waterproof tracker, easy mount", tag: "Rugged" },
            ].map((tracker) => (
              <div
                key={tracker.name}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{tracker.name}</p>
                  <p className="text-xs text-muted-foreground">{tracker.desc}</p>
                </div>
                <Badge variant="outline" className="text-xs">{tracker.tag}</Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Hardware tracker integration via webhook/API is on our roadmap.
            For now, use browser-based tracking above.
          </p>
        </CardContent>
      </Card>

      {/* Emergency Stop */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="w-5 h-5" />
            Safety
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Instantly stop all location sharing and delete your location data.
            Use this if you feel unsafe or want to go completely off-grid.
          </p>
          <Button
            variant="destructive"
            onClick={emergencyStop}
            className="w-full"
          >
            <ShieldAlert className="w-4 h-4 mr-2" />
            Emergency Stop &mdash; Delete All Location Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GPSSettings;

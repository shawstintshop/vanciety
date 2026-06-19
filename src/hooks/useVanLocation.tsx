import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type SharingVisibility = 'public' | 'friends_only' | 'event' | 'private';
export type SharingPrecision = 'exact' | 'approximate';
export type SharingDuration = 'forever' | '24h' | '1_week' | 'until_off' | 'custom';

export interface GPSSettings {
  sharing_enabled: boolean;
  default_visibility: SharingVisibility;
  default_precision: SharingPrecision;
  default_duration: SharingDuration;
  auto_pause_hours: number;
  update_interval_sec: number;
}

const DEFAULT_SETTINGS: GPSSettings = {
  sharing_enabled: false,
  default_visibility: 'friends_only',
  default_precision: 'approximate',
  default_duration: 'until_off',
  auto_pause_hours: 8,
  update_interval_sec: 30,
};

const normalizeGPSSettings = (settings: Partial<GPSSettings> | null | undefined): GPSSettings => ({
  ...DEFAULT_SETTINGS,
  ...settings,
  // Friend Finder is members-only. Do not let legacy public/exact database defaults
  // become the runtime sharing mode for new location updates.
  default_visibility: 'friends_only',
  default_precision: settings?.default_precision === 'exact'
    ? 'approximate'
    : settings?.default_precision ?? DEFAULT_SETTINGS.default_precision,
});

export const useVanLocation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<GPSSettings>(DEFAULT_SETTINGS);
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSentRef = useRef<number>(0);

  // Load user GPS settings from Supabase
  const loadSettings = useCallback(async () => {
    if (!user) {
      setSettingsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('gps_sharing_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(normalizeGPSSettings({
          sharing_enabled: data.sharing_enabled,
          default_visibility: data.default_visibility as SharingVisibility,
          default_precision: data.default_precision as SharingPrecision,
          default_duration: data.default_duration as SharingDuration,
          auto_pause_hours: data.auto_pause_hours,
          update_interval_sec: data.update_interval_sec,
        }));
      }
    } catch (err) {
      console.error('Error loading GPS settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  }, [user]);

  // Save settings to Supabase
  const saveSettings = useCallback(async (newSettings: Partial<GPSSettings>) => {
    if (!user) return;

    const merged = normalizeGPSSettings({ ...settings, ...newSettings });
    setSettings(merged);

    try {
      const { error } = await supabase
        .from('gps_sharing_settings')
        .upsert({
          user_id: user.id,
          sharing_enabled: merged.sharing_enabled,
          default_visibility: merged.default_visibility,
          default_precision: merged.default_precision,
          default_duration: merged.default_duration,
          auto_pause_hours: merged.auto_pause_hours,
          update_interval_sec: merged.update_interval_sec,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
    } catch (err) {
      console.error('Error saving GPS settings:', err);
      toast({
        title: 'Settings Error',
        description: 'Failed to save GPS settings.',
        variant: 'destructive',
      });
    }
  }, [user, settings, toast]);

  // Compute expiry timestamp from duration setting
  const computeExpiry = useCallback((duration: SharingDuration): string | null => {
    const now = new Date();
    switch (duration) {
      case '24h':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case '1_week':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'forever':
      case 'until_off':
      default:
        return null;
    }
  }, []);

  // Send position to Supabase
  const sendPosition = useCallback(async (position: GeolocationPosition) => {
    if (!user) return;

    // Throttle: don't send more often than update_interval_sec
    const now = Date.now();
    if (now - lastSentRef.current < settings.update_interval_sec * 1000) return;
    lastSentRef.current = now;

    try {
      const safeSettings = normalizeGPSSettings(settings);
      const { error } = await supabase.rpc('upsert_van_location', {
        p_user_id: user.id,
        p_lat: position.coords.latitude,
        p_lng: position.coords.longitude,
        p_speed: position.coords.speed,
        p_heading: position.coords.heading,
        p_accuracy: position.coords.accuracy,
        p_visibility: safeSettings.default_visibility,
        p_precision: safeSettings.default_precision,
        p_expires_at: computeExpiry(safeSettings.default_duration),
        p_status: (position.coords.speed ?? 0) > 1 ? 'traveling' : 'parked',
        p_message: null,
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error sending van location:', err);
    }
  }, [user, settings, computeExpiry]);

  // Start watching position
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      toast({
        title: 'Not Supported',
        description: 'Your browser does not support GPS location.',
        variant: 'destructive',
      });
      return;
    }

    setLocationError(null);
    setIsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentPosition(position);
        sendPosition(position);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setLocationError(err.message);
        toast({
          title: 'Location Error',
          description: err.message,
          variant: 'destructive',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );

    toast({
      title: 'GPS Tracking Active',
      description: 'Your van location is now being shared.',
    });
  }, [sendPosition, toast]);

  // Stop watching
  const stopTracking = useCallback(async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsTracking(false);
    setCurrentPosition(null);

    // Delete the user's location row so they disappear from map
    if (user) {
      await supabase
        .from('van_locations')
        .delete()
        .eq('user_id', user.id);
    }

    toast({
      title: 'GPS Tracking Stopped',
      description: 'Your location is no longer shared.',
    });
  }, [user, toast]);

  // Emergency stop — also wipes location history
  const emergencyStop = useCallback(async () => {
    await stopTracking();
    await saveSettings({ sharing_enabled: false });
    toast({
      title: 'Emergency Stop',
      description: 'All location sharing has been stopped and your data deleted.',
      variant: 'destructive',
    });
  }, [stopTracking, saveSettings, toast]);

  // Toggle sharing on/off
  const toggleSharing = useCallback(async (enabled: boolean) => {
    await saveSettings({ sharing_enabled: enabled });
    if (enabled) {
      startTracking();
    } else {
      await stopTracking();
    }
  }, [saveSettings, startTracking, stopTracking]);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Auto-start if settings say sharing_enabled
  useEffect(() => {
    if (!settingsLoading && settings.sharing_enabled && user && !isTracking) {
      startTracking();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsLoading, settings.sharing_enabled, user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    settings,
    saveSettings,
    isTracking,
    currentPosition,
    locationError,
    settingsLoading,
    startTracking,
    stopTracking,
    toggleSharing,
    emergencyStop,
  };
};

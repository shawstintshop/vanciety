import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserLocation {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  status: string;
  message?: string;
  last_seen: string;
  is_public: boolean;
}

const toAreaCoordinate = (value: number) => Math.round(value * 20) / 20; // ~3-5 km grid, latitude dependent
const isValidCoordinate = (latitude: number, longitude: number) => (
  Number.isFinite(latitude) &&
  Number.isFinite(longitude) &&
  latitude >= -90 &&
  latitude <= 90 &&
  longitude >= -180 &&
  longitude <= 180
);

export const useRealtimePresence = () => {
  const [memberLocations, setMemberLocations] = useState<UserLocation[]>([]);
  const [onlineMembers] = useState<Record<string, never>>({});
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch existing member areas from the secured Friend Finder location table.
  // The legacy user_locations table stores exact coordinates and is deprecated.
  // Realtime presence is intentionally not used for location data because presence
  // payloads are client-controlled and not protected by table RLS.
  const fetchMemberLocations = useCallback(async () => {
    if (!user) {
      setMemberLocations([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('van_locations')
        .select('id,user_id,latitude,longitude,status,message,updated_at,expires_at')
        .eq('visibility', 'friends_only')
        .eq('precision', 'approximate')
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setMemberLocations((data || [])
        .filter((row) => isValidCoordinate(row.latitude, row.longitude))
        .map((row) => ({
          id: row.id,
          user_id: row.user_id,
          latitude: toAreaCoordinate(row.latitude),
          longitude: toAreaCoordinate(row.longitude),
          status: row.status || 'parked',
          message: row.message || undefined,
          last_seen: row.updated_at,
          is_public: false,
        })));
    } catch (error) {
      console.error('Error fetching member locations:', error);
    }
  }, [user]);

  // Share current approximate member area through the hardened RPC only.
  const shareLocation = async (location: { latitude: number; longitude: number }, status: string, message?: string) => {
    if (!user) return;

    if (!isValidCoordinate(location.latitude, location.longitude)) {
      toast({
        title: "Location Error",
        description: "Invalid location coordinates. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('upsert_van_location', {
        p_user_id: user.id,
        p_lat: location.latitude,
        p_lng: location.longitude,
        p_speed: null,
        p_heading: null,
        p_accuracy: null,
        p_visibility: 'friends_only',
        p_precision: 'approximate',
        p_expires_at: null,
        p_status: status,
        p_message: message || null,
      });

      if (error) throw error;

      setIsSharing(true);
      toast({
        title: "Area Shared",
        description: "Your approximate area is visible to signed-in Vanciety members.",
      });

      await fetchMemberLocations();
    } catch (error) {
      console.error('Error sharing location:', error);
      toast({
        title: "Error",
        description: "Failed to share approximate area. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Stop sharing location
  const stopSharing = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('van_locations')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setIsSharing(false);
      setMemberLocations((current) => current.filter((row) => row.user_id !== user.id));
      toast({
        title: "Location Sharing Stopped",
        description: "Your area is no longer visible to other members.",
      });

    } catch (error) {
      console.error('Error stopping location sharing:', error);
    }
  };

  // Get user's current position
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      });
    });
  };

  // Auto-share approximate area (if user has enabled it)
  const startLocationSharing = async (status: string, message?: string) => {
    try {
      const position = await getCurrentPosition();
      await shareLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }, status, message);
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: "Location Error",
        description: "Unable to get your current location. Please enable location services.",
        variant: "destructive",
      });
    }
  };

  // Set up database-change subscription for secured van area rows only.
  useEffect(() => {
    fetchMemberLocations();

    if (!user) return;

    const locationChanges = supabase
      .channel('van_locations_changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'van_locations',
          filter: 'visibility=eq.friends_only'
        },
        () => {
          fetchMemberLocations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(locationChanges);
    };
  }, [fetchMemberLocations, user]);

  return {
    memberLocations,
    onlineMembers,
    isSharing,
    shareLocation,
    stopSharing,
    startLocationSharing,
    getCurrentPosition,
  };
};
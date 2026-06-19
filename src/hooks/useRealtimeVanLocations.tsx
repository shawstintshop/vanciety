import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveVan {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  speed: number | null;
  heading: number | null;
  accuracy: number | null;
  visibility: string;
  status: string;
  message: string | null;
  updated_at: string;
  display_name?: string;
}

const toAreaCoordinate = (value: number) => Math.round(value * 20) / 20; // ~3-5 km grid, latitude dependent

export const useRealtimeVanLocations = (enabled = true) => {
  const [liveVans, setLiveVans] = useState<LiveVan[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated member-visible van areas only.
  // Exact locations must never be used for Friend Finder/member map rendering.
  const fetchVanLocations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('van_locations')
        .select('id,user_id,latitude,longitude,speed,heading,accuracy,visibility,status,message,updated_at')
        .eq('visibility', 'friends_only')
        .eq('precision', 'approximate')
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Fetch display names for each user
      const userIds = (data || []).map(v => v.user_id);
      let profileMap: Record<string, string> = {};

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', userIds);

        if (profiles) {
          profileMap = Object.fromEntries(
            profiles.map(p => [p.user_id, p.display_name || 'Anonymous'])
          );
        }
      }

      setLiveVans(
        (data || []).map(v => ({
          id: v.id,
          user_id: v.user_id,
          latitude: toAreaCoordinate(v.latitude),
          longitude: toAreaCoordinate(v.longitude),
          speed: null,
          heading: null,
          accuracy: null,
          visibility: v.visibility,
          status: v.status || 'traveling',
          message: v.message,
          updated_at: v.updated_at,
          display_name: profileMap[v.user_id] || 'Sprinter',
        }))
      );
    } catch (err) {
      console.error('Error fetching van locations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Find approximate member-visible vans near a specific point.
  const findNearbyVans = useCallback(async (lat: number, lng: number, radiusMeters = 80467) => {
    try {
      const { data, error } = await supabase.rpc('nearby_member_van_areas', {
        p_lat: lat,
        p_lng: lng,
        p_radius: radiusMeters,
      });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error finding nearby vans:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    fetchVanLocations();

    // Subscribe to realtime changes on van_locations
    const channel = supabase
      .channel('van_locations_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'van_locations',
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setLiveVans(prev => prev.filter(v => v.id !== (payload.old as any).id));
          } else {
            // For INSERT/UPDATE, refetch to get display names
            fetchVanLocations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, fetchVanLocations]);

  return {
    liveVans,
    loading,
    fetchVanLocations,
    findNearbyVans,
  };
};

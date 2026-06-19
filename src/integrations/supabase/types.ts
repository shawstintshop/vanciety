export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      forum_posts: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          likes_count: number | null
          replies_count: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          replies_count?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          replies_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          amenities: string[] | null
          contact_info: Json | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          latitude: number
          longitude: number
          name: string
          rating: number | null
          reviews_count: number | null
          type: string
          updated_at: string
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          amenities?: string[] | null
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          latitude: number
          longitude: number
          name: string
          rating?: number | null
          reviews_count?: number | null
          type?: string
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          amenities?: string[] | null
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number
          longitude?: number
          name?: string
          rating?: number | null
          reviews_count?: number | null
          type?: string
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      marketplace_items: {
        Row: {
          category: string
          condition: string
          created_at: string
          description: string
          id: string
          images: string[] | null
          is_sold: boolean | null
          location: string | null
          price: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          condition: string
          created_at?: string
          description: string
          id?: string
          images?: string[] | null
          is_sold?: boolean | null
          location?: string | null
          price?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string
          description?: string
          id?: string
          images?: string[] | null
          is_sold?: boolean | null
          location?: string | null
          price?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          instagram_handle: string | null
          location: string | null
          updated_at: string
          user_id: string
          van_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          instagram_handle?: string | null
          location?: string | null
          updated_at?: string
          user_id: string
          van_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          instagram_handle?: string | null
          location?: string | null
          updated_at?: string
          user_id?: string
          van_type?: string | null
        }
        Relationships: []
      }
      gps_sharing_settings: {
        Row: {
          auto_pause_hours: number
          created_at: string
          default_duration: string
          default_precision: Database["public"]["Enums"]["sharing_precision"]
          default_visibility: Database["public"]["Enums"]["sharing_visibility"]
          id: string
          sharing_enabled: boolean
          update_interval_sec: number
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_pause_hours?: number
          created_at?: string
          default_duration?: string
          default_precision?: Database["public"]["Enums"]["sharing_precision"]
          default_visibility?: Database["public"]["Enums"]["sharing_visibility"]
          id?: string
          sharing_enabled?: boolean
          update_interval_sec?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_pause_hours?: number
          created_at?: string
          default_duration?: string
          default_precision?: Database["public"]["Enums"]["sharing_precision"]
          default_visibility?: Database["public"]["Enums"]["sharing_visibility"]
          id?: string
          sharing_enabled?: boolean
          update_interval_sec?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_locations: {
        Row: {
          created_at: string
          id: string
          is_public: boolean | null
          last_seen: string
          latitude: number
          longitude: number
          message: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_public?: boolean | null
          last_seen?: string
          latitude: number
          longitude: number
          message?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_public?: boolean | null
          last_seen?: string
          latitude?: number
          longitude?: number
          message?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      van_locations: {
        Row: {
          accuracy: number | null
          created_at: string
          expires_at: string | null
          geom: unknown
          heading: number | null
          id: string
          latitude: number
          longitude: number
          message: string | null
          precision: Database["public"]["Enums"]["sharing_precision"]
          speed: number | null
          status: string | null
          updated_at: string
          user_id: string
          visibility: Database["public"]["Enums"]["sharing_visibility"]
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          expires_at?: string | null
          geom?: unknown
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          message?: string | null
          precision?: Database["public"]["Enums"]["sharing_precision"]
          speed?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
          visibility?: Database["public"]["Enums"]["sharing_visibility"]
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          expires_at?: string | null
          geom?: unknown
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          message?: string | null
          precision?: Database["public"]["Enums"]["sharing_precision"]
          speed?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
          visibility?: Database["public"]["Enums"]["sharing_visibility"]
        }
        Relationships: []
      }
      vendors: {
        Row: {
          business_name: string
          category: string
          created_at: string
          description: string
          email: string | null
          id: string
          location: string | null
          phone: string | null
          rating: number | null
          reviews_count: number | null
          updated_at: string
          user_id: string
          verified: boolean | null
          website_url: string | null
        }
        Insert: {
          business_name: string
          category: string
          created_at?: string
          description: string
          email?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          rating?: number | null
          reviews_count?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          website_url?: string | null
        }
        Update: {
          business_name?: string
          category?: string
          created_at?: string
          description?: string
          email?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          rating?: number | null
          reviews_count?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          website_url?: string | null
        }
        Relationships: []
      }
      youtube_videos: {
        Row: {
          category: string
          channel_id: string
          channel_title: string
          created_at: string
          description: string | null
          duration: string | null
          id: string
          is_featured: boolean | null
          like_count: number | null
          published_at: string
          tags: string[] | null
          thumbnail_url: string
          title: string
          updated_at: string
          view_count: number | null
          youtube_id: string
        }
        Insert: {
          category?: string
          channel_id: string
          channel_title: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          is_featured?: boolean | null
          like_count?: number | null
          published_at: string
          tags?: string[] | null
          thumbnail_url: string
          title: string
          updated_at?: string
          view_count?: number | null
          youtube_id: string
        }
        Update: {
          category?: string
          channel_id?: string
          channel_title?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          is_featured?: boolean | null
          like_count?: number | null
          published_at?: string
          tags?: string[] | null
          thumbnail_url?: string
          title?: string
          updated_at?: string
          view_count?: number | null
          youtube_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      nearby_member_van_areas: {
        Args: {
          p_lat: number
          p_lng: number
          p_radius?: number
        }
        Returns: Database["public"]["Tables"]["van_locations"]["Row"][]
      }
      nearby_vans: {
        Args: {
          p_lat: number
          p_lng: number
          p_radius?: number
        }
        Returns: Database["public"]["Tables"]["van_locations"]["Row"][]
      }
      upsert_van_location: {
        Args: {
          p_accuracy?: number | null
          p_expires_at?: string | null
          p_heading?: number | null
          p_lat: number
          p_lng: number
          p_message?: string | null
          p_precision?: Database["public"]["Enums"]["sharing_precision"]
          p_speed?: number | null
          p_status?: string | null
          p_user_id: string
          p_visibility?: Database["public"]["Enums"]["sharing_visibility"]
        }
        Returns: Database["public"]["Tables"]["van_locations"]["Row"]
      }
    }
    Enums: {
      sharing_precision: "exact" | "approximate"
      sharing_visibility: "public" | "friends_only" | "event" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

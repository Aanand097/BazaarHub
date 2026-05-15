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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ad_reports: {
        Row: {
          ad_id: string
          created_at: string
          description: string | null
          id: string
          reason: string
          reporter_id: string
          status: string | null
        }
        Insert: {
          ad_id: string
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          reporter_id: string
          status?: string | null
        }
        Update: {
          ad_id?: string
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_reports_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_inquiries: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      ads: {
        Row: {
          boosted: boolean | null
          category_id: string | null
          condition: string | null
          created_at: string
          currency: string | null
          description: string | null
          expires_at: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          location: string | null
          negotiable: boolean | null
          price: number
          reports_count: number | null
          status: string | null
          subcategory_id: string | null
          title: string
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          boosted?: boolean | null
          category_id?: string | null
          condition?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          location?: string | null
          negotiable?: boolean | null
          price: number
          reports_count?: number | null
          status?: string | null
          subcategory_id?: string | null
          title: string
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          boosted?: boolean | null
          category_id?: string | null
          condition?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          location?: string | null
          negotiable?: boolean | null
          price?: number
          reports_count?: number | null
          status?: string | null
          subcategory_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ads_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ads_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          ad_id: string | null
          created_at: string
          created_by: string
          description: string | null
          expires_at: string | null
          expiry_days: number | null
          id: string
          image_url: string
          is_active: boolean
          link_url: string | null
          sort_order: number
          starts_at: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          ad_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          expires_at?: string | null
          expiry_days?: number | null
          id?: string
          image_url: string
          is_active?: boolean
          link_url?: string | null
          sort_order?: number
          starts_at?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          ad_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          expires_at?: string | null
          expiry_days?: number | null
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string | null
          sort_order?: number
          starts_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "banners_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          seen: boolean | null
          sender_id: string
          thread_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          seen?: boolean | null
          sender_id: string
          thread_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          seen?: boolean | null
          sender_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          ad_id: string | null
          buyer_id: string
          created_at: string
          id: string
          seller_id: string
          updated_at: string
        }
        Insert: {
          ad_id?: string | null
          buyer_id: string
          created_at?: string
          id?: string
          seller_id: string
          updated_at?: string
        }
        Update: {
          ad_id?: string | null
          buyer_id?: string
          created_at?: string
          id?: string
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_threads_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          location: string | null
          phone: string | null
          rating: number | null
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          rating?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          rating?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      saved_ads: {
        Row: {
          ad_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          ad_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          ad_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_ads_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string
          id: string
          name: string
        }
        Insert: {
          category_id: string
          id?: string
          name: string
        }
        Update: {
          category_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deactivate_expired_banners: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

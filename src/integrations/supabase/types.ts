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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          category: string
          content: string
          created_at: string
          excerpt: string
          featured_image: string | null
          id: string
          keywords: string[] | null
          meta_description: string | null
          read_time: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          featured_image?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          read_time?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          featured_image?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          read_time?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          billing_cycle: Database["public"]["Enums"]["billing_cycle"]
          created_at: string
          id: string
          is_paid: boolean
          name: string
          paid_at: string | null
        }
        Insert: {
          amount?: number
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          created_at?: string
          id?: string
          is_paid?: boolean
          name: string
          paid_at?: string | null
        }
        Update: {
          amount?: number
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          created_at?: string
          id?: string
          is_paid?: boolean
          name?: string
          paid_at?: string | null
        }
        Relationships: []
      }
      media_items: {
        Row: {
          alt: string | null
          caption: string | null
          duration: number | null
          filename: string
          height: number | null
          id: string
          mime_type: string
          original_name: string
          portfolio_ids: string[] | null
          post_ids: string[] | null
          size: number
          tags: string[] | null
          type: Database["public"]["Enums"]["media_type"]
          uploaded_at: string
          uploaded_by: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt?: string | null
          caption?: string | null
          duration?: number | null
          filename: string
          height?: number | null
          id?: string
          mime_type: string
          original_name: string
          portfolio_ids?: string[] | null
          post_ids?: string[] | null
          size?: number
          tags?: string[] | null
          type?: Database["public"]["Enums"]["media_type"]
          uploaded_at?: string
          uploaded_by?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt?: string | null
          caption?: string | null
          duration?: number | null
          filename?: string
          height?: number | null
          id?: string
          mime_type?: string
          original_name?: string
          portfolio_ids?: string[] | null
          post_ids?: string[] | null
          size?: number
          tags?: string[] | null
          type?: Database["public"]["Enums"]["media_type"]
          uploaded_at?: string
          uploaded_by?: string | null
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          category: Database["public"]["Enums"]["portfolio_category"]
          created_at: string
          id: string
          media_type: Database["public"]["Enums"]["media_type"]
          media_url: string
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["portfolio_category"]
          created_at?: string
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          media_url: string
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["portfolio_category"]
          created_at?: string
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          media_url?: string
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          created_at: string
          id: string
          saved_amount: number
          target_amount: number
          target_month: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          saved_amount?: number
          target_amount?: number
          target_month: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          saved_amount?: number
          target_amount?: number
          target_month?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          email: string
          id: string
          name: string | null
          signup_date: string
          status: Database["public"]["Enums"]["subscriber_status"]
        }
        Insert: {
          email: string
          id?: string
          name?: string | null
          signup_date?: string
          status?: Database["public"]["Enums"]["subscriber_status"]
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
          signup_date?: string
          status?: Database["public"]["Enums"]["subscriber_status"]
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          custom_month_duration: number | null
          description: string | null
          due_date: string
          due_time: string | null
          id: string
          last_notified: string | null
          recurrence: Database["public"]["Enums"]["recurrence_type"]
          recurrence_end_date: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          custom_month_duration?: number | null
          description?: string | null
          due_date: string
          due_time?: string | null
          id?: string
          last_notified?: string | null
          recurrence?: Database["public"]["Enums"]["recurrence_type"]
          recurrence_end_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          custom_month_duration?: number | null
          description?: string | null
          due_date?: string
          due_time?: string | null
          id?: string
          last_notified?: string | null
          recurrence?: Database["public"]["Enums"]["recurrence_type"]
          recurrence_end_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      billing_cycle: "daily" | "weekly" | "monthly" | "yearly"
      media_type: "image" | "video"
      portfolio_category:
        | "Brand Design"
        | "Web Designs"
        | "Influencer"
        | "AdvertIsing"
        | "Video Creation/editing"
      post_status: "draft" | "published"
      recurrence_type: "none" | "daily" | "weekly" | "monthly" | "custom"
      subscriber_status: "active" | "unsubscribed"
      task_status: "pending" | "completed" | "overdue"
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
      app_role: ["admin", "user"],
      billing_cycle: ["daily", "weekly", "monthly", "yearly"],
      media_type: ["image", "video"],
      portfolio_category: [
        "Brand Design",
        "Web Designs",
        "Influencer",
        "AdvertIsing",
        "Video Creation/editing",
      ],
      post_status: ["draft", "published"],
      recurrence_type: ["none", "daily", "weekly", "monthly", "custom"],
      subscriber_status: ["active", "unsubscribed"],
      task_status: ["pending", "completed", "overdue"],
    },
  },
} as const

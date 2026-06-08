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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      invoices: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_number: string
          order_id: string | null
          retailer_id: string
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
          wholesaler_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          invoice_number?: string
          order_id?: string | null
          retailer_id: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
          wholesaler_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_number?: string
          order_id?: string | null
          retailer_id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "wholesalers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          line_total: number
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: string
          line_total?: number
          order_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          unit_price?: number
        }
        Update: {
          id?: string
          line_total?: number
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          order_number: string
          retailer_id: string
          status: Database["public"]["Enums"]["order_status"]
          total: number
          updated_at: string
          wholesaler_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_number?: string
          retailer_id: string
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
          wholesaler_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_number?: string
          retailer_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "wholesalers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          price: number
          stock_qty: number
          unit: Database["public"]["Enums"]["product_unit"]
          updated_at: string
          wholesaler_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          price?: number
          stock_qty?: number
          unit?: Database["public"]["Enums"]["product_unit"]
          updated_at?: string
          wholesaler_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          price?: number
          stock_qty?: number
          unit?: Database["public"]["Enums"]["product_unit"]
          updated_at?: string
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "wholesalers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["role_type"]
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          phone?: string | null
          role: Database["public"]["Enums"]["role_type"]
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["role_type"]
          updated_at?: string
        }
        Relationships: []
      }
      retailers: {
        Row: {
          city: string | null
          created_at: string
          id: string
          profile_id: string
          shop_name: string
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          profile_id: string
          shop_name: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          profile_id?: string
          shop_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "retailers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_tracker: {
        Row: {
          created_at: string
          custom_item_name: string | null
          id: string
          product_id: string | null
          retailer_id: string
          status: Database["public"]["Enums"]["stock_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_item_name?: string | null
          id?: string
          product_id?: string | null
          retailer_id: string
          status?: Database["public"]["Enums"]["stock_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_item_name?: string | null
          id?: string
          product_id?: string | null
          retailer_id?: string
          status?: Database["public"]["Enums"]["stock_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_tracker_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_tracker_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      udhaar: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          entry_date: string
          id: string
          retailer_id: string
          running_balance: number
          type: Database["public"]["Enums"]["udhaar_type"]
          wholesaler_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          retailer_id: string
          running_balance?: number
          type: Database["public"]["Enums"]["udhaar_type"]
          wholesaler_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          retailer_id?: string
          running_balance?: number
          type?: Database["public"]["Enums"]["udhaar_type"]
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "udhaar_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "udhaar_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "wholesalers"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesaler_retailer: {
        Row: {
          created_at: string
          credit_limit: number
          id: string
          retailer_id: string
          status: Database["public"]["Enums"]["link_status"]
          updated_at: string
          wholesaler_id: string
        }
        Insert: {
          created_at?: string
          credit_limit?: number
          id?: string
          retailer_id: string
          status?: Database["public"]["Enums"]["link_status"]
          updated_at?: string
          wholesaler_id: string
        }
        Update: {
          created_at?: string
          credit_limit?: number
          id?: string
          retailer_id?: string
          status?: Database["public"]["Enums"]["link_status"]
          updated_at?: string
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wholesaler_retailer_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesaler_retailer_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "wholesalers"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesalers: {
        Row: {
          business_name: string
          city: string | null
          created_at: string
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          business_name: string
          city?: string | null
          created_at?: string
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          business_name?: string
          city?: string | null
          created_at?: string
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wholesalers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_retailer_id: { Args: Record<PropertyKey, never>; Returns: string }
      current_wholesaler_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      find_retailer_by_phone: {
        Args: { p_phone: string }
        Returns: {
          city: string
          full_name: string
          phone: string
          retailer_id: string
          shop_name: string
        }[]
      }
      find_wholesaler_by_phone: {
        Args: { p_phone: string }
        Returns: {
          business_name: string
          city: string
          full_name: string
          phone: string
          wholesaler_id: string
        }[]
      }
      place_order: {
        Args: { p_items: Json; p_wholesaler_id: string }
        Returns: string
      }
    }
    Enums: {
      invoice_status: "unpaid" | "partial" | "paid"
      link_status: "pending" | "active" | "blocked"
      order_status:
        | "pending"
        | "confirmed"
        | "dispatched"
        | "delivered"
        | "cancelled"
      product_unit: "piece" | "kg" | "dozen" | "carton" | "packet"
      role_type: "wholesaler" | "retailer"
      stock_status: "sold_out" | "restocked"
      udhaar_type: "credit" | "payment"
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
      invoice_status: ["unpaid", "partial", "paid"],
      link_status: ["pending", "active", "blocked"],
      order_status: [
        "pending",
        "confirmed",
        "dispatched",
        "delivered",
        "cancelled",
      ],
      product_unit: ["piece", "kg", "dozen", "carton"],
      role_type: ["wholesaler", "retailer"],
      stock_status: ["sold_out", "restocked"],
      udhaar_type: ["credit", "payment"],
    },
  },
} as const

// Convenience aliases
export type Profile = Tables<"profiles">
export type Wholesaler = Tables<"wholesalers">
export type Retailer = Tables<"retailers">
export type WholesalerRetailer = Tables<"wholesaler_retailer">
export type Product = Tables<"products">
export type Order = Tables<"orders">
export type OrderItem = Tables<"order_items">
export type Invoice = Tables<"invoices">
export type Udhaar = Tables<"udhaar">
export type StockTracker = Tables<"stock_tracker">

export type Role = Enums<"role_type">
export type OrderStatus = Enums<"order_status">
export type LinkStatus = Enums<"link_status">
export type InvoiceStatus = Enums<"invoice_status">
export type UdhaarType = Enums<"udhaar_type">
export type StockStatus = Enums<"stock_status">
export type ProductUnit = Enums<"product_unit">

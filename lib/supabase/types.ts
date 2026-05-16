export type Persona = "event" | "brand";

export type WaitlistRow = {
  id: string;
  created_at: string;
  email: string;
  persona: Persona;

  // Event-specific
  event_name: string | null;
  event_vertical: string | null;
  event_location: string | null;
  event_size: string | null;
  sponsor_target_budget: string | null;

  // Brand-specific
  company_name: string | null;
  target_vertical: string | null;
  region_focus: string | null;
  budget_tier: string | null;

  // Common
  notes: string | null;
  source: string | null;
};

export type WaitlistInsert = {
  id?: string;
  created_at?: string;
  email: string;
  persona: Persona;
  event_name?: string | null;
  event_vertical?: string | null;
  event_location?: string | null;
  event_size?: string | null;
  sponsor_target_budget?: string | null;
  company_name?: string | null;
  target_vertical?: string | null;
  region_focus?: string | null;
  budget_tier?: string | null;
  notes?: string | null;
  source?: string | null;
};

export type Database = {
  public: {
    Tables: {
      waitlist: {
        Row: WaitlistRow;
        Insert: WaitlistInsert;
        Update: Partial<WaitlistInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Persona = "event" | "brand" | "newsletter";

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

// One row per Supabase auth.users user, written server-side by the
// provisioning route at lib/wallets/provision.ts. RLS allows the owner to
// read their own row; only service-role writes. Bytea columns are returned
// by postgrest as `\x...` hex string literals — adapters in provision.ts.
export type UserWalletRow = {
  user_id: string;
  xrpl_address: string;
  seed_ciphertext: string;
  seed_iv: string;
  seed_tag: string;
  network: string;
  auto_funded: boolean;
  created_at: string;
};

export type UserWalletInsert = {
  user_id: string;
  xrpl_address: string;
  seed_ciphertext: string;
  seed_iv: string;
  seed_tag: string;
  network?: string;
  auto_funded?: boolean;
  created_at?: string;
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
      user_wallets: {
        Row: UserWalletRow;
        Insert: UserWalletInsert;
        Update: Partial<UserWalletInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

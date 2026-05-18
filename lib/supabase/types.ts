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

// Phase C1 — vendors directory (owner-scoped payee records).
export type VendorRow = {
  id: string;
  owner_user_id: string;
  name: string;
  service: string | null;
  xrp_address: string;
  note: string | null;
  created_at: string;
};

export type VendorInsert = {
  id?: string;
  owner_user_id: string;
  name: string;
  service?: string | null;
  xrp_address: string;
  note?: string | null;
  created_at?: string;
};

// Phase C1 — settlement ledger between an event wallet + its vendors.
export type VendorPayoutStatus =
  | "scheduled"
  | "released"
  | "withheld"
  | "disputed";

export type VendorPayoutRow = {
  id: string;
  owner_user_id: string;
  vendor_id: string;
  deal_id: string;
  milestone_id: string | null;
  amount_drops: number; // bigint comes back as number in JS; postgrest returns it as string when > MAX_SAFE_INTEGER, but our demo amounts are tiny.
  status: VendorPayoutStatus;
  tx_hash: string | null;
  released_at: string | null;
  note: string | null;
  created_at: string;
};

export type VendorPayoutInsert = {
  id?: string;
  owner_user_id: string;
  vendor_id: string;
  deal_id: string;
  milestone_id?: string | null;
  amount_drops: number;
  status?: VendorPayoutStatus;
  tx_hash?: string | null;
  released_at?: string | null;
  note?: string | null;
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
      vendors: {
        Row: VendorRow;
        Insert: VendorInsert;
        Update: Partial<VendorInsert>;
        Relationships: [];
      };
      vendor_payouts: {
        Row: VendorPayoutRow;
        Insert: VendorPayoutInsert;
        Update: Partial<VendorPayoutInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

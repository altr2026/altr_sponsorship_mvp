"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type { AddVendorState } from "./_vendor-types";

// Same classic-address regex as the 004_vendors.sql CHECK constraint.
const XRP_ADDRESS_RE = /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/;

export async function addVendor(
  _prev: AddVendorState,
  formData: FormData,
): Promise<AddVendorState> {
  const supabase = createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return { ok: false, error: "You must be signed in to add a vendor." };
  }

  const dealId = String(formData.get("deal_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const xrpAddress = String(formData.get("xrp_address") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!name) {
    return { ok: false, error: "Vendor name is required." };
  }
  if (!XRP_ADDRESS_RE.test(xrpAddress)) {
    return {
      ok: false,
      error: "XRP address must start with 'r' and be 25-35 characters.",
    };
  }

  const { error } = await supabase.from("vendors").insert({
    owner_user_id: user.id,
    name,
    service: service || null,
    xrp_address: xrpAddress,
    note: note || null,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error: "You already have a vendor at this address.",
      };
    }
    if (error.code === "23514") {
      return { ok: false, error: "XRP address failed validation." };
    }
    return { ok: false, error: error.message };
  }

  if (dealId) revalidatePath(`/demo/event-dashboard/${dealId}`);
  return { ok: true, error: null };
}

// Bound with vendorId + dealId via .bind(null, id, dealId). RLS enforces
// owner-only delete; ON DELETE RESTRICT on vendor_payouts.vendor_id will
// surface as an error here once Phase C3 starts creating payout rows.
export async function deleteVendor(
  vendorId: string,
  dealId: string,
  _formData: FormData,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("vendors").delete().eq("id", vendorId);
  if (error) {
    // 23503 = foreign_key_violation (payouts still reference this vendor).
    // Log so the operator notices; UI surfacing is a follow-up improvement.
    console.error("[vendors] delete failed:", error.code, error.message);
  }
  if (dealId) revalidatePath(`/demo/event-dashboard/${dealId}`);
}

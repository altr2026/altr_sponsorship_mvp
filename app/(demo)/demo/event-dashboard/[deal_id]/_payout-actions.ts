"use server";

import { revalidatePath } from "next/cache";
import { xrpToDrops } from "xrpl";

import { createClient } from "@/lib/supabase/server";

import type { SchedulePayoutState } from "./_payout-types";

// Per-payout cap so amount_drops always stays under Number.MAX_SAFE_INTEGER
// (9.007 * 10^15). 1M XRP = 10^12 drops, far below the safe threshold and
// way more than any plausible demo payment.
const MAX_PAYOUT_XRP = 1_000_000;

export async function schedulePayout(
  _prev: SchedulePayoutState,
  formData: FormData,
): Promise<SchedulePayoutState> {
  const supabase = createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return { ok: false, error: "You must be signed in to schedule a payout." };
  }

  const dealId = String(formData.get("deal_id") ?? "").trim();
  const vendorId = String(formData.get("vendor_id") ?? "").trim();
  const milestoneId = String(formData.get("milestone_id") ?? "").trim();
  const amountStr = String(formData.get("amount_xrp") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!dealId) return { ok: false, error: "Deal id missing." };
  if (!vendorId) return { ok: false, error: "Pick a vendor." };

  const amountXrp = Number(amountStr);
  if (!Number.isFinite(amountXrp) || amountXrp <= 0) {
    return { ok: false, error: "Amount must be a positive XRP value." };
  }
  if (amountXrp > MAX_PAYOUT_XRP) {
    return {
      ok: false,
      error: `Per-payout cap is ${MAX_PAYOUT_XRP.toLocaleString()} XRP.`,
    };
  }

  let amountDrops: number;
  try {
    amountDrops = Number(xrpToDrops(amountXrp.toString()));
  } catch {
    return { ok: false, error: "Invalid XRP amount." };
  }

  const { data: inserted, error } = await supabase
    .from("vendor_payouts")
    .insert({
      owner_user_id: user.id,
      vendor_id: vendorId,
      deal_id: dealId,
      milestone_id: milestoneId || null,
      amount_drops: amountDrops,
      note: note || null,
      status: "scheduled",
    })
    .select("id")
    .single();

  if (error) {
    // 23503 = vendor_id FK violation (vendor doesn't exist or isn't yours).
    if (error.code === "23503") {
      return {
        ok: false,
        error: "Vendor not found. Re-add the vendor in the directory above.",
      };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath(`/demo/event-dashboard/${dealId}`);
  return { ok: true, error: null, payout_id: inserted?.id };
}

// Bound with payoutId + dealId via .bind(null, ...). The RLS delete policy
// (005_vendor_payouts.sql) only permits removal when status='scheduled' —
// any other status returns 0 affected rows silently rather than an error.
export async function cancelPayout(
  payoutId: string,
  dealId: string,
  _formData: FormData,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("vendor_payouts")
    .delete()
    .eq("id", payoutId);
  if (error) {
    console.error("[payouts] cancel failed:", error.code, error.message);
  }
  if (dealId) revalidatePath(`/demo/event-dashboard/${dealId}`);
}

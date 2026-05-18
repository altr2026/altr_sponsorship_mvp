import { ExternalLink, X } from "lucide-react";
import { dropsToXrp } from "xrpl";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

import { cancelPayout } from "./_payout-actions";
import { SchedulePayoutForm } from "./_payout-form";
import { PayVendorButton } from "./_pay-button";

const STATUS_TONE: Record<string, string> = {
  scheduled: "border-altr-line2 text-altr-muteSoft",
  released: "border-altr-lime/40 bg-altr-lime/10 text-altr-lime",
  withheld: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  disputed: "border-red-400/40 bg-red-400/10 text-red-300",
};

function shortenTx(hash: string, head = 8, tail = 6): string {
  if (hash.length <= head + tail + 1) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}

export async function PayoutsSection({
  dealId,
  userId,
  milestones,
  network,
}: {
  dealId: string;
  userId: string;
  milestones: Array<{ id: string; label: string }>;
  // Used to point tx hash links at the right explorer.
  network: "testnet" | "mainnet";
}) {
  const supabase = createClient();
  const [vendorsRes, payoutsRes] = await Promise.all([
    supabase
      .from("vendors")
      .select("id, name")
      .eq("owner_user_id", userId)
      .order("name", { ascending: true }),
    supabase
      .from("vendor_payouts")
      .select(
        "id, vendor_id, milestone_id, amount_drops, status, tx_hash, released_at, note, created_at",
      )
      .eq("owner_user_id", userId)
      .eq("deal_id", dealId)
      .order("created_at", { ascending: false }),
  ]);

  if (vendorsRes.error) {
    console.error("[PayoutsSection] vendors load failed:", vendorsRes.error);
  }
  if (payoutsRes.error) {
    console.error("[PayoutsSection] payouts load failed:", payoutsRes.error);
  }

  const vendors = vendorsRes.data ?? [];
  const payouts = payoutsRes.data ?? [];

  const vendorMap = new Map(vendors.map((v) => [v.id, v.name]));
  const milestoneMap = new Map(milestones.map((m) => [m.id, m.label]));

  const explorerBase =
    network === "mainnet"
      ? "https://livenet.xrpl.org/transactions/"
      : "https://testnet.xrpl.org/transactions/";

  return (
    <section
      aria-label="Scheduled payouts for this deal"
      className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
    >
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <Kbd>Your scheduled payouts</Kbd>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            scoped to this deal · real XRPL txs
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
          {payouts.length} payout{payouts.length === 1 ? "" : "s"}
        </span>
      </header>

      <SchedulePayoutForm
        dealId={dealId}
        vendors={vendors}
        milestones={milestones}
      />

      <div className="mt-5">
        {payouts.length === 0 ? (
          <p className="rounded-md border border-altr-line2 bg-altr-black/40 px-4 py-3 text-[12px] text-altr-mute">
            No payouts scheduled yet. Use the form above to schedule a Payment
            tx from your custodial wallet to one of your vendor addresses.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-altr-line2">
            <table className="w-full min-w-[800px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-altr-line2 bg-altr-black/40">
                  <th
                    scope="col"
                    className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute"
                  >
                    Vendor
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute"
                  >
                    Milestone
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute"
                  >
                    Tx / note
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => {
                  const vendorName = vendorMap.get(p.vendor_id) ?? "(deleted vendor)";
                  const milestoneLabel = p.milestone_id
                    ? (milestoneMap.get(p.milestone_id) ?? p.milestone_id)
                    : "—";
                  const xrp = dropsToXrp(p.amount_drops).toString();
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-altr-line2/60 last:border-0"
                    >
                      <td className="px-3 py-3 text-altr-white">
                        {vendorName}
                      </td>
                      <td className="px-3 py-3 font-mono text-[11px] text-altr-muteSoft">
                        {milestoneLabel}
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums text-altr-white">
                        {xrp}{" "}
                        <span className="text-[10px] text-altr-mute">XRP</span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
                            STATUS_TONE[p.status] ??
                              "border-altr-line2 text-altr-mute",
                          )}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[11.5px] leading-snug text-altr-muteSoft">
                        {p.tx_hash ? (
                          <a
                            href={`${explorerBase}${p.tx_hash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-altr-lime hover:underline"
                          >
                            {shortenTx(p.tx_hash)}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : p.note ? (
                          <span>{p.note}</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {p.status === "scheduled" ? (
                          <div className="flex flex-col items-end gap-2">
                            <PayVendorButton payoutId={p.id} />
                            <form
                              action={cancelPayout.bind(null, p.id, dealId)}
                            >
                              <button
                                type="submit"
                                aria-label="Cancel scheduled payout"
                                className="inline-flex items-center gap-1 rounded border border-altr-line2 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute transition-colors hover:border-red-400/60 hover:text-red-300"
                              >
                                <X className="h-3 w-3" />
                                Cancel
                              </button>
                            </form>
                          </div>
                        ) : p.released_at ? (
                          <span className="font-mono text-[10px] text-altr-mute">
                            {new Date(p.released_at).toLocaleString()}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

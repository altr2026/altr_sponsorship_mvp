import { ExternalLink, Trash2 } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { createClient } from "@/lib/supabase/server";

import { deleteVendor } from "./_vendor-actions";
import { AddVendorForm } from "./_vendor-form";

const SERVICE_LABEL: Record<string, string> = {
  venue: "Venue",
  stage_av: "Stage + AV",
  security: "Security",
  talent: "Talent / Speakers",
  marketing: "Marketing",
  catering: "Catering / F&B",
  staffing: "Staffing",
  production: "Production",
  insurance: "Insurance",
  documentation: "Documentation",
};

function shorten(addr: string, head = 6, tail = 4): string {
  if (addr.length <= head + tail + 1) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

export async function VendorDirectory({
  dealId,
  userId,
}: {
  dealId: string;
  userId: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("vendors")
    .select("id, name, service, xrp_address, note, created_at")
    .eq("owner_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[VendorDirectory] select failed:", error);
    // Render the form even if the list query fails; the user can still add.
  }

  const vendors = data ?? [];

  return (
    <section
      aria-label="Your vendor directory"
      className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
    >
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <Kbd>Your vendor directory</Kbd>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            owner-scoped · stored in supabase
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
          {vendors.length} vendor{vendors.length === 1 ? "" : "s"}
        </span>
      </header>

      <AddVendorForm dealId={dealId} />

      <div className="mt-5">
        {vendors.length === 0 ? (
          <p className="rounded-md border border-altr-line2 bg-altr-black/40 px-4 py-3 text-[12px] text-altr-mute">
            No vendors yet. Add one above to start — the payout flow (Phase C3)
            will then let you schedule payments to these addresses.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-altr-line2">
            <table className="w-full min-w-[720px] text-left text-[12px]">
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
                    Service
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute"
                  >
                    Address
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute"
                  >
                    Note
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-altr-line2/60 last:border-0"
                  >
                    <td className="px-3 py-3 text-altr-white">{v.name}</td>
                    <td className="px-3 py-3 font-mono text-[11px] text-altr-muteSoft">
                      {v.service
                        ? (SERVICE_LABEL[v.service] ?? v.service)
                        : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-[11.5px] text-altr-white"
                          title={v.xrp_address}
                        >
                          {shorten(v.xrp_address)}
                        </span>
                        <a
                          href={`https://testnet.xrpl.org/accounts/${v.xrp_address}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${v.name} on testnet explorer`}
                          className="text-altr-mute hover:text-altr-lime"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[11.5px] leading-snug text-altr-mute">
                      {v.note ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <form action={deleteVendor.bind(null, v.id, dealId)}>
                        <button
                          type="submit"
                          aria-label={`Delete vendor ${v.name}`}
                          className="inline-flex items-center gap-1 rounded border border-altr-line2 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute transition-colors hover:border-red-400/60 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

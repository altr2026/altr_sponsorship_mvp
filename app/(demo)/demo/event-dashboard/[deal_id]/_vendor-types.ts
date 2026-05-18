// Shared types + constants for the vendor directory feature. Pulled out of
// _vendor-actions.ts because a "use server" module can only export async
// functions — type exports and value exports trigger a build error.

export type AddVendorState = {
  ok: boolean;
  error: string | null;
};

export const INITIAL_ADD_VENDOR_STATE: AddVendorState = {
  ok: false,
  error: null,
};

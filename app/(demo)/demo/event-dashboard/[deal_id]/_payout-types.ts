// Shared types + constants for the payout schedule/sign feature. Kept out
// of _payout-actions.ts because "use server" modules can only export async
// functions.

export type SchedulePayoutState = {
  ok: boolean;
  error: string | null;
  payout_id?: string;
};

export const INITIAL_SCHEDULE_STATE: SchedulePayoutState = {
  ok: false,
  error: null,
};

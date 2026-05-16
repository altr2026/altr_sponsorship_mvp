export type Region = "APAC" | "GCC";

export type Event = {
  id: string;
  name: string;
  region: Region;
  city: string;
  date: string;
  attendees: number;
  askUsd: number;
};

export type Brand = {
  id: string;
  name: string;
  category: string;
  budgetUsd: number;
};

export type Deal = {
  id: string;
  eventId: string;
  brandId: string;
  amountUsd: number;
  status: "draft" | "signed" | "settled";
  txHash?: string;
};

export const events: Event[] = [
  {
    id: "evt_seoul_kfip",
    name: "KFIP Demo Day",
    region: "APAC",
    city: "Seoul",
    date: "2026-09-12",
    attendees: 1200,
    askUsd: 250_000,
  },
  {
    id: "evt_dubai_sole",
    name: "Sole DXB",
    region: "GCC",
    city: "Dubai",
    date: "2026-12-05",
    attendees: 35_000,
    askUsd: 750_000,
  },
];

export const brands: Brand[] = [
  {
    id: "brnd_samsung",
    name: "Samsung",
    category: "Consumer Electronics",
    budgetUsd: 5_000_000,
  },
  {
    id: "brnd_emirates",
    name: "Emirates",
    category: "Travel",
    budgetUsd: 12_000_000,
  },
];

export const deals: Deal[] = [];

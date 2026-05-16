export type EventVertical = "Music" | "Conference" | "Fashion" | "Wellness";

export type Region = "APAC" | "GCC";

export type SponsorTier = "Title" | "Gold" | "Silver" | "Booth";

export type SponsorPackage = {
  tier: SponsorTier;
  price: number;
  perks: string[];
};

export type AudienceProfile = {
  age: string;
  gender: string;
  income: string;
};

export type Event = {
  id: string;
  slug: string;
  name: string;
  vertical: EventVertical;
  region: Region;
  location: string;
  country: string;
  date: string;
  attendees: number;
  audience: AudienceProfile;
  sponsor_packages: SponsorPackage[];
  image_url?: string;
  is_real_event: boolean;
  is_anchor_partner: boolean;
};

export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id);
}

export const events: Event[] = [
  {
    id: "evt_pbw_2026",
    slug: "philippine-blockchain-week-2026",
    name: "Philippine Blockchain Week 2026",
    vertical: "Conference",
    region: "APAC",
    location: "Manila",
    country: "Philippines",
    date: "June 19-21, 2026",
    attendees: 15_000,
    audience: {
      age: "25-40",
      gender: "65M / 35F",
      income: "Upper-middle",
    },
    sponsor_packages: [
      {
        tier: "Title",
        price: 250_000,
        perks: [
          "Naming rights on main stage",
          "Keynote slot",
          "10x VIP passes",
          "Logo across all media",
        ],
      },
      {
        tier: "Gold",
        price: 80_000,
        perks: [
          "Branded breakout room",
          "Panel slot",
          "5x VIP passes",
        ],
      },
      {
        tier: "Silver",
        price: 25_000,
        perks: [
          "Exhibitor booth",
          "Logo on agenda",
          "2x VIP passes",
        ],
      },
      {
        tier: "Booth",
        price: 7_000,
        perks: ["Exhibitor booth", "Listing in directory"],
      },
    ],
    is_real_event: true,
    is_anchor_partner: false,
  },
  {
    id: "evt_ultra_korea_2026",
    slug: "ultra-korea-2026",
    name: "Ultra Korea 2026",
    vertical: "Music",
    region: "APAC",
    location: "Seoul",
    country: "South Korea",
    date: "June 12-14, 2026",
    attendees: 100_000,
    audience: {
      age: "18-32",
      gender: "55F / 45M",
      income: "Middle",
    },
    sponsor_packages: [
      {
        tier: "Title",
        price: 750_000,
        perks: [
          "Main stage naming",
          "Brand activation zone",
          "20x VIP passes",
        ],
      },
      {
        tier: "Gold",
        price: 200_000,
        perks: ["Second stage naming", "Brand zone", "10x VIP passes"],
      },
      {
        tier: "Silver",
        price: 60_000,
        perks: ["Branded bar or lounge", "5x VIP passes"],
      },
      { tier: "Booth", price: 15_000, perks: ["Exhibitor booth"] },
    ],
    is_real_event: true,
    is_anchor_partner: false,
  },
  {
    id: "evt_dubai_design_week_2026",
    slug: "dubai-design-week-2026",
    name: "Dubai Design Week 2026",
    vertical: "Fashion",
    region: "GCC",
    location: "Dubai",
    country: "United Arab Emirates",
    date: "November 2026",
    attendees: 80_000,
    audience: {
      age: "28-45",
      gender: "60F / 40M",
      income: "High",
    },
    sponsor_packages: [
      {
        tier: "Title",
        price: 500_000,
        perks: [
          "Headline pavilion",
          "Editorial integration",
          "15x VIP passes",
        ],
      },
      {
        tier: "Gold",
        price: 150_000,
        perks: ["Branded pavilion", "Press list access", "8x VIP passes"],
      },
      {
        tier: "Silver",
        price: 40_000,
        perks: ["Exhibitor stand", "3x VIP passes"],
      },
      { tier: "Booth", price: 10_000, perks: ["Exhibitor booth"] },
    ],
    is_real_event: true,
    is_anchor_partner: false,
  },
  {
    id: "evt_soundstorm_2026",
    slug: "soundstorm-2026",
    name: "Soundstorm 2026",
    vertical: "Music",
    region: "GCC",
    location: "Riyadh",
    country: "Saudi Arabia",
    date: "December 2026",
    attendees: 600_000,
    audience: {
      age: "18-35",
      gender: "50M / 50F",
      income: "Middle",
    },
    sponsor_packages: [
      {
        tier: "Title",
        price: 1_500_000,
        perks: [
          "Main stage naming",
          "Brand experience zone",
          "30x VIP passes",
          "Year-round MDLBEAST integration",
        ],
      },
      {
        tier: "Gold",
        price: 400_000,
        perks: ["Secondary stage naming", "Activation footprint", "15x VIP passes"],
      },
      {
        tier: "Silver",
        price: 100_000,
        perks: ["Branded lounge", "8x VIP passes"],
      },
      { tier: "Booth", price: 25_000, perks: ["Exhibitor booth"] },
    ],
    is_real_event: true,
    is_anchor_partner: false,
  },
  {
    id: "evt_wanderlust_108_bali",
    slug: "wanderlust-108-bali",
    name: "Wanderlust 108 Bali",
    vertical: "Wellness",
    region: "APAC",
    location: "Bali",
    country: "Indonesia",
    date: "October 2026",
    attendees: 3_000,
    audience: {
      age: "25-45",
      gender: "75F / 25M",
      income: "High",
    },
    sponsor_packages: [
      {
        tier: "Title",
        price: 80_000,
        perks: [
          "Mindful triathlon naming",
          "Retreat host slot",
          "10x VIP passes",
        ],
      },
      {
        tier: "Gold",
        price: 35_000,
        perks: ["Branded session", "5x VIP passes"],
      },
      {
        tier: "Silver",
        price: 12_000,
        perks: ["Wellness market stall", "2x VIP passes"],
      },
      { tier: "Booth", price: 4_000, perks: ["Market stall"] },
    ],
    is_real_event: true,
    is_anchor_partner: false,
  },
  {
    id: "evt_beautyworld_japan_2026",
    slug: "beautyworld-japan-2026",
    name: "BeautyWorld Japan 2026",
    vertical: "Wellness",
    region: "APAC",
    location: "Tokyo",
    country: "Japan",
    date: "May 2026",
    attendees: 70_000,
    audience: {
      age: "25-50",
      gender: "80F / 20M",
      income: "Upper-middle",
    },
    sponsor_packages: [
      {
        tier: "Title",
        price: 450_000,
        perks: [
          "Headline pavilion",
          "Buyer matchmaking access",
          "12x VIP passes",
        ],
      },
      {
        tier: "Gold",
        price: 120_000,
        perks: ["Branded pavilion", "6x VIP passes"],
      },
      {
        tier: "Silver",
        price: 35_000,
        perks: ["Exhibitor stand", "3x VIP passes"],
      },
      { tier: "Booth", price: 8_000, perks: ["Exhibitor booth"] },
    ],
    is_real_event: true,
    is_anchor_partner: false,
  },
];

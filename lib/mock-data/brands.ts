export type BrandCategory =
  | "Automotive"
  | "Consumer Electronics"
  | "Beverages"
  | "Apparel"
  | "Energy"
  | "Travel"
  | "Fintech"
  | "Cloud";

export type Brand = {
  id: string;
  name: string;
  category: BrandCategory;
  region_focus: "APAC" | "GCC" | "Global";
  budget_tier: "Under $100K" | "$100K – $500K" | "$500K – $5M" | "$5M+";
};

export const brands: Brand[] = [
  {
    id: "brnd_hyundai",
    name: "Hyundai",
    category: "Automotive",
    region_focus: "Global",
    budget_tier: "$5M+",
  },
  {
    id: "brnd_samsung",
    name: "Samsung",
    category: "Consumer Electronics",
    region_focus: "Global",
    budget_tier: "$5M+",
  },
  {
    id: "brnd_heineken",
    name: "Heineken",
    category: "Beverages",
    region_focus: "Global",
    budget_tier: "$5M+",
  },
  {
    id: "brnd_lululemon",
    name: "Lululemon",
    category: "Apparel",
    region_focus: "Global",
    budget_tier: "$500K – $5M",
  },
  {
    id: "brnd_aramco",
    name: "Aramco",
    category: "Energy",
    region_focus: "GCC",
    budget_tier: "$5M+",
  },
  {
    id: "brnd_emirates",
    name: "Emirates",
    category: "Travel",
    region_focus: "Global",
    budget_tier: "$5M+",
  },
  {
    id: "brnd_stripe_apac",
    name: "Stripe APAC",
    category: "Fintech",
    region_focus: "APAC",
    budget_tier: "$500K – $5M",
  },
  {
    id: "brnd_aws_apac",
    name: "AWS APAC",
    category: "Cloud",
    region_focus: "APAC",
    budget_tier: "$500K – $5M",
  },
];

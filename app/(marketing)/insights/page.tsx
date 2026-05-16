import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Hero } from "@/components/shared/hero";
import { SectionHeading } from "@/components/shared/section-heading";

import { NewsletterForm } from "./_newsletter-form";

const FEATURED = {
  tag: "Market data",
  title: "GCC sponsorship market hits 6.88 billion in 2025",
  excerpt:
    "Saudi Arabia and the UAE drove twelve percent of new deal volume across music and sports, with title sponsorships averaging 41 percent higher than 2024.",
  readTime: "8 min read",
  date: "Apr 2026",
};

const POSTS = [
  {
    tag: "Pricing",
    title: "Music festival pricing benchmark: APAC versus GCC",
    excerpt:
      "Title sponsorships in Seoul run thirty percent below Dubai for comparable audience sizes — here is why.",
    date: "Mar 2026",
    readTime: "6 min read",
  },
  {
    tag: "Trends",
    title: "Why Saudi Arabia is the next sponsorship frontier",
    excerpt:
      "Vision 2030, a young population, and a brand land grab in entertainment infrastructure.",
    date: "Feb 2026",
    readTime: "9 min read",
  },
  {
    tag: "Operations",
    title: "Influencer × event: the bundled deal economics",
    excerpt:
      "How blended deals close two to three times faster and lift sponsor recall by half.",
    date: "Jan 2026",
    readTime: "7 min read",
  },
];

export default function InsightsPage() {
  return (
    <>
      <Hero
        eyebrow="Insights"
        title="The state of APAC and GCC sponsorship."
        subtitle="Monthly data, pricing benchmarks, and market analysis from the ALTR team."
        primaryCta={{ label: "Subscribe", href: "#newsletter" }}
        secondaryLink={{ label: "Read the latest", href: "#featured" }}
      />

      <section id="featured" className="border-t border-gray-200">
        <div className="container py-24">
          <article className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="aspect-[16/6] w-full bg-gray-50" aria-hidden="true" />
            <div className="space-y-4 p-8">
              <div className="flex items-center gap-3 text-caption text-gray-500">
                <span className="font-medium text-teal-700">{FEATURED.tag}</span>
                <span aria-hidden="true">·</span>
                <span>{FEATURED.date}</span>
                <span aria-hidden="true">·</span>
                <span>{FEATURED.readTime}</span>
              </div>
              <h2>{FEATURED.title}</h2>
              <p className="max-w-3xl text-body text-gray-600">
                {FEATURED.excerpt}
              </p>
              <Link
                href="/insights"
                className="inline-flex items-center gap-1.5 text-body font-medium text-teal-700"
              >
                Read the report
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-gray-50">
        <div className="container space-y-10 py-24">
          <SectionHeading
            eyebrow="More from the lab"
            title="Recent posts."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {POSTS.map((post) => (
              <article
                key={post.title}
                className="flex h-full flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6"
              >
                <span className="text-caption font-medium text-teal-700">
                  {post.tag}
                </span>
                <h3>{post.title}</h3>
                <p className="text-body text-gray-600">{post.excerpt}</p>
                <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-caption text-gray-500">
                    {post.date} · {post.readTime}
                  </span>
                  <Link
                    href="/insights"
                    className="inline-flex items-center gap-1 text-caption font-medium text-gray-700 hover:text-teal-700"
                  >
                    Read
                    <ArrowUpRight
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="newsletter" className="border-t border-gray-200">
        <div className="container grid gap-12 py-24 md:grid-cols-[1fr_1fr]">
          <SectionHeading
            eyebrow="Newsletter"
            title="Get the monthly read."
            subtitle="One email a month with new data, pricing benchmarks, and market analysis. No spam."
          />
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

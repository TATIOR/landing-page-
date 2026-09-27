import { NextResponse } from "next/server";

const defaults = {
  heroTitle: "Stop chasing trades.",
  heroAccent: "Build a trading process.",
  heroCopy:
    "Learn market structure, liquidity, risk management and trading psychology through a structured approach designed to help you execute with discipline.",
  audience: "14K+",
  experience: "3+",
  discordUrl: "https://discord.gg/neGYW7UTC",
  certificates: [],
  offers: [
    {
      name: "Digital Starter",
      price: "$10",
      description: "A practical introduction to structured trading, risk management and psychology.",
      features: ["Trading psychology guide","Risk management framework","Core market-structure concepts","Instant digital access"],
      cta: "Get the $10 Product",
      href: "#",
      featured: false,
    },
    {
      name: "3-Month Student Program",
      price: "$147",
      description: "A structured 3-month student program for traders ready to build and develop a repeatable process.",
      features: ["Complete trading framework","Market structure & liquidity","Risk management system","Trading psychology","Private community","3 months of student access"],
      cta: "Join 3-Month Program",
      href: "#",
      featured: true,
    },
    {
      name: "12-Month Student Program",
      price: "$497",
      description: "A long-term 12-month student program for traders who want extended guidance, accountability and development.",
      features: ["Everything in 3-Month Program","Extended coaching access","Trade reviews","Execution feedback","Advanced accountability"],
      cta: "Join 12-Month Program",
      href: "#",
      featured: false,
    },
  ],
};

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) return NextResponse.json(defaults);

  try {
    const res = await fetch(`${url}/rest/v1/ita_site_config?id=eq.1&select=config`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json(defaults);
    const rows = await res.json();
    const config = rows?.[0]?.config;
    if (!config || typeof config !== "object") {
      return NextResponse.json(defaults, { headers: { "Cache-Control": "no-store" } });
    }

    const merged = { ...defaults, ...config };

    // Migrate the old coaching labels to the current student-program structure
    // while preserving existing prices and checkout URLs from the saved config.
    if (Array.isArray(merged.offers) && merged.offers.length >= 3) {
      merged.offers = merged.offers.map((offer: any, index: number) => {
        if (index === 1 && ["Base Coaching", "3-Month Mentorship"].includes(offer?.name)) {
          return {
            ...offer,
            name: "3-Month Student Program",
            description: "A structured 3-month student program for traders ready to build and develop a repeatable process.",
            features: [
              "Complete trading framework",
              "Market structure & liquidity",
              "Risk management system",
              "Trading psychology",
              "Private community",
              "3 months of student access",
            ],
            cta: "Join 3-Month Program",
            featured: false,
          };
        }

        if (index === 2 && ["Premium Coaching", "12-Month Mentorship"].includes(offer?.name)) {
          return {
            ...offer,
            name: "12-Month Student Program",
            description: "A long-term 12-month student program for traders who want extended guidance, accountability and development.",
            features: [
              "Everything in 3-Month Program",
              "Extended coaching access",
              "Trade reviews",
              "Execution feedback",
              "Advanced accountability",
            ],
            cta: "Join 12-Month Program",
            featured: false,
          };
        }

        return offer;
      });
    }
    if (Array.isArray(merged.offers) && merged.offers.length > 0) {
      merged.offers = merged.offers.map((offer: any, index: number) =>
        index === 0 && offer?.price === "$5"
          ? { ...offer, price: "$10", cta: "Get the $10 Product" }
          : offer
      );
    }

    return NextResponse.json(merged, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(defaults);
  }
}

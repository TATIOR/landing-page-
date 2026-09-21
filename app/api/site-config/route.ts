import { NextResponse } from "next/server";

const defaults = {
  heroTitle: "Stop chasing trades.",
  heroAccent: "Build a trading process.",
  heroCopy:
    "Learn market structure, liquidity, risk management and trading psychology through a structured approach designed to help you execute with discipline.",
  audience: "14K+",
  experience: "3+",
  telegramUrl: "https://t.me/",
  certificates: [],
  offers: [
    {
      name: "Digital Starter",
      price: "$5",
      description:
        "A practical introduction to structured trading, risk management and psychology.",
      features: [
        "Trading psychology guide",
        "Risk management framework",
        "Core market-structure concepts",
        "Instant digital access",
      ],
      cta: "Get the $5 Product",
      href: "#",
      featured: false,
    },
    {
      name: "Base Coaching",
      price: "$147",
      description:
        "A structured coaching program for traders who want a repeatable process.",
      features: [
        "Complete trading framework",
        "Market structure & liquidity",
        "Risk management system",
        "Trading psychology",
        "Community access",
        "Coaching sessions",
      ],
      cta: "Join Base Coaching",
      href: "#",
      featured: true,
    },
    {
      name: "Premium Coaching",
      price: "$497",
      description:
        "High-touch coaching for traders who want deeper feedback and accountability.",
      features: [
        "Everything in Base",
        "Personalized trade reviews",
        "Direct coaching access",
        "Execution feedback",
        "Advanced accountability",
      ],
      cta: "Get Premium Coaching",
      href: "#",
      featured: false,
    },
  ],
};

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    return NextResponse.json(defaults);
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/ita_site_config?id=eq.1&select=config`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return NextResponse.json(defaults);

    const rows = await res.json();
    const config = rows?.[0]?.config;

    return NextResponse.json(
      config && typeof config === "object"
        ? { ...defaults, ...config }
        : defaults,
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(defaults);
  }
}
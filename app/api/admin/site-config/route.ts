import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  const res = await fetch(
    `${url}/rest/v1/ita_site_config?id=eq.1&select=config`,
    {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Could not load site configuration." }, { status: 500 });
  }

  const rows = await res.json();
  const config = rows?.[0]?.config ?? {};

  // Present the current student-program structure in the admin editor
  // while preserving existing prices and checkout URLs.
  if (Array.isArray(config.offers) && config.offers.length >= 3) {
    config.offers = config.offers.map((offer: any, index: number) => {
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

  return NextResponse.json({ config });
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  const body = await req.json();
  const config = body?.config;

  if (!config || typeof config !== "object") {
    return NextResponse.json({ error: "Invalid configuration." }, { status: 400 });
  }

  const res = await fetch(`${url}/rest/v1/ita_site_config?id=eq.1`, {
    method: "PATCH",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ config, updated_at: new Date().toISOString() }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Could not save site configuration." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
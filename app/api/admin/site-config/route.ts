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
  return NextResponse.json({ config: rows?.[0]?.config ?? {} });
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
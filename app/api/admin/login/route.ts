import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const EMAIL = "tatiorstore@gmail.com";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function rateLimitKey(req: Request, email: string) {
  return `${getClientIp(req)}:${email.toLowerCase().trim()}`;
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || now >= current.resetAt) {
    attempts.set(key, { count: 0, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  return { allowed: true, retryAfter: 0 };
}

function recordFailure(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || now >= current.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  current.count += 1;
}

function clearFailures(key: string) {
  attempts.delete(key);
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const key = rateLimitKey(req, normalizedEmail);

    const limit = checkRateLimit(key);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many failed login attempts. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(limit.retryAfter),
          },
        }
      );
    }

    const expectedPassword = process.env.ITA_ADMIN_PASSWORD;
    const secret = process.env.ITA_ADMIN_SESSION_SECRET;

    if (!expectedPassword || !secret) {
      return NextResponse.json(
        { error: "Admin authentication is not configured." },
        { status: 503 }
      );
    }

    if (normalizedEmail !== EMAIL || password !== expectedPassword) {
      recordFailure(key);
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    clearFailures(key);

    const value = Buffer.from(
      JSON.stringify({
        email: EMAIL,
        exp: Date.now() + 8 * 60 * 60 * 1000,
      })
    ).toString("base64url");

    const token = value + "." + sign(value, secret);
    const res = NextResponse.json({ ok: true });

    res.cookies.set("ita_admin_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

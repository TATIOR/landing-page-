import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { randomUUID } from "crypto";

const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No certificate file was provided." }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Use JPG, PNG, WEBP or PDF files only." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Certificate must be 8 MB or smaller." },
        { status: 400 }
      );
    }

    const extension =
      file.type === "application/pdf"
        ? "pdf"
        : file.type === "image/webp"
          ? "webp"
          : file.type === "image/png"
            ? "png"
            : "jpg";

    const path = `certificates/${Date.now()}-${randomUUID()}.${extension}`;
    const upload = await fetch(
      `${url}/storage/v1/object/ita-certificates/${path}`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": file.type,
          "x-upsert": "false",
        },
        body: await file.arrayBuffer(),
      }
    );

    if (!upload.ok) {
      const detail = await upload.text();
      return NextResponse.json(
        { error: "Certificate upload failed.", detail },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      url: `${url}/storage/v1/object/public/ita-certificates/${path}`,
      name: file.name,
    });
  } catch {
    return NextResponse.json({ error: "Certificate upload failed." }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * GET /api/test-supabase
 * 不依赖任何表，只调用 ping()，用来验证 Vercel/本地能否连上 Supabase。
 */
export async function GET() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { ok: false, error: "Missing SUPABASE_URL or key (check env vars)" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.rpc("ping");

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, pong: data });
}

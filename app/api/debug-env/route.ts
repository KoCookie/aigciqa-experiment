import { NextResponse } from "next/server";

/**
 * 调试接口：打印当前进程可读的环境变量（敏感值不回显）
 * 访问地址：http://localhost:3000/api/debug-env
 */
export async function GET() {
  return NextResponse.json({
    SUPABASE_URL: process.env.SUPABASE_URL ?? null,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "LOADED (hidden)" : "MISSING",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "LOADED (hidden)" : "MISSING",
    NODE_ENV: process.env.NODE_ENV ?? null,
  });
}

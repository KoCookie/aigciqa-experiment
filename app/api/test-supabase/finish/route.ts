// app/api/finish/route.ts
/*临时注释掉
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  const body = await req.json()
  const { user_id } = body

  if (!user_id) {
    return NextResponse.json({ error: '缺少 user_id' }, { status: 400 })
  }

  const { error } = await supabaseServer
    .from('profiles')
    .upsert({ user_id, experiment_finished: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ status: 'finished' })
}
  */
 //临时测试！！！
 // app/api/test-supabase/finish/route.ts
export async function GET() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}


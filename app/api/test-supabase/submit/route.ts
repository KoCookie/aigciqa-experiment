// app/api/submit/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  const body = await req.json()
  const { user_id, image_id, judgement, clues } = body

  if (!user_id || !image_id || !judgement) {
    return NextResponse.json({ error: '缺少参数' }, { status: 400 })
  }

  const { error } = await supabaseServer
    .from('responses')
    .insert({
      user_id,
      image_id,
      judgement,
      clues
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ status: 'ok' })
}

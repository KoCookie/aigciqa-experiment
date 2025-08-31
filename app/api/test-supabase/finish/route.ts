// app/api/finish/route.ts
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

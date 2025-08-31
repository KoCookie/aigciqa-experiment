// app/api/progress/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')

  if (!user_id) {
    return NextResponse.json({ error: '缺少 user_id' }, { status: 400 })
  }

  // 已完成的图片
  const { data: done, error } = await supabaseServer
    .from('responses')
    .select('image_id')
    .eq('user_id', user_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const completed = done.map(d => d.image_id)

  // 下一张：取 images 表里还没做的第一张
  const { data: next } = await supabaseServer
    .from('images')
    .select('id')
    .not('id', 'in', `(${completed.join(',') || 0})`)
    .order('id', { ascending: true })
    .limit(1)

  return NextResponse.json({
    completed,
    next: next?.[0]?.id || null
  })
}

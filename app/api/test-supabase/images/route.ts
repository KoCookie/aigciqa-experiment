// app/api/images/route.ts
/*
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET() {
  const { data, error } = await supabaseServer
    .from('images')
    .select('id, url')
    .order('id', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ images: data })
}*/
//临时不用supabase
export async function GET() {
  // 测试阶段返回本地图片数组
  const data = [
    "/images/Firefly_1_Cute_fluffy_kitten.jpg",
    "/images/Firefly_1_single_white_daisy.jpg",
    "/images/Firefly_2_young_woman.jpg",
  ];

  return new Response(JSON.stringify({ success: true, data }), {
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


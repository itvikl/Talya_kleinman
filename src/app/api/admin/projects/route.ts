import { NextResponse } from 'next/server';
import { createProject } from '@/lib/firestore';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('[POST project] cover_image:', data.cover_image || '(empty)');
    const id = await createProject(data);
    console.log('[POST project] created id:', id);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error('[POST project] ERROR:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

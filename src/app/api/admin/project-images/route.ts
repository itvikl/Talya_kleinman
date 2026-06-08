import { NextResponse } from 'next/server';
import { addProjectImage } from '@/lib/firestore';

export async function POST(req: Request) {
  const data = await req.json();
  const id = await addProjectImage(data);
  return NextResponse.json({ ok: true, id });
}

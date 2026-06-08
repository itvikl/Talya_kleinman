import { NextResponse } from 'next/server';
import { deleteProjectImage } from '@/lib/firestore';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteProjectImage(id);
  return NextResponse.json({ ok: true });
}

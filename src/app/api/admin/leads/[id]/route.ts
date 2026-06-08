import { NextResponse } from 'next/server';
import { updateLeadStatus } from '@/lib/firestore';
import type { LeadStatus } from '@/types/database';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await req.json() as { status: LeadStatus };
  await updateLeadStatus(id, status);
  return NextResponse.json({ ok: true });
}

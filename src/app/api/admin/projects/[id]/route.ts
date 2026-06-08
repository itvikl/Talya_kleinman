import { NextResponse } from 'next/server';
import { updateProject, deleteProject } from '@/lib/firestore';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    console.log('[PATCH project] id:', id, 'data:', JSON.stringify(data));
    await updateProject(id, data);
    console.log('[PATCH project] success');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PATCH project] ERROR:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteProject(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/admin/projects/[id]', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

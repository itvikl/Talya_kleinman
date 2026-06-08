import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// PATCH /api/admin/project-images/reorder
// Body: { ids: string[] }  — ordered array of image IDs
export async function PATCH(req: Request) {
  try {
    const { ids } = (await req.json()) as { ids: string[] };
    if (!Array.isArray(ids)) return NextResponse.json({ error: 'ids required' }, { status: 400 });

    const db = adminDb();
    const batch = db.batch();
    ids.forEach((id, index) => {
      batch.update(db.collection('project_images').doc(id), { sort_order: index });
    });
    await batch.commit();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[reorder images]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/firestore';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    await updateSiteSettings(data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[site-settings PATCH]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

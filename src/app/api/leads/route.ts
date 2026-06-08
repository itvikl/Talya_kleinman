import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createLead } from '@/lib/firestore';

const LeadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().optional(),
});

async function sendWhatsAppNotification(lead: z.infer<typeof LeadSchema>) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = process.env.WHATSAPP_RECIPIENT_NUMBER;
  if (!token || !phoneId || !recipient) return;

  const text = [
    '🏠 *ליד חדש — טליה זלצמן*',
    `👤 *שם:* ${lead.name}`,
    `📞 *טלפון:* ${lead.phone}`,
    lead.email ? `📧 *אימייל:* ${lead.email}` : null,
    lead.message ? `💬 *הודעה:* ${lead.message}` : null,
  ].filter(Boolean).join('\n');

  await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: recipient, type: 'text', text: { body: text } }),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false, error: 'Invalid data' }, { status: 400 });

    const lead = parsed.data;
    await createLead({ name: lead.name, phone: lead.phone, email: lead.email || null, message: lead.message || null });

    sendWhatsAppNotification(lead).catch((e) => console.error('[leads] WhatsApp error:', e));

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[leads]', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a warm and professional interior design advisor for Talya Zaltsman Studio — a luxury interior architecture studio based in Jerusalem, Israel.

About the studio:
- Talya Zaltsman is an interior architect with 15+ years of experience specializing in luxury residential design
- The studio creates restrained yet luxurious spaces, combining authentic materials and precise details
- Located in Jerusalem, serving Jerusalem, Tel Aviv, and surrounding areas — Est. 2009
- Completed 80+ projects including apartments, villas, and penthouses

Services offered:
1. Interior Architecture — full architectural plans and design
2. Interior Design — material selection, furnishings, lighting, styling
3. Execution Support — overseeing contractors, ensuring every detail is perfect

Our process:
1. Initial Meeting — understanding your vision, needs, budget, and timeline
2. Design & Planning — architectural plans, material selection, 3D renderings
3. Execution Support — coordinating with contractors and suppliers
4. Handover — delivering your dream space, every detail perfect

Your role:
- Answer questions about the studio's services, style, process, and approach
- Help potential clients understand what to expect when working with the studio
- Be warm, elegant, and professional — reflecting the studio's luxury brand
- Respond in the same language the user writes in (Hebrew or English)
- For Hebrew: use formal, elegant Hebrew
- Keep responses concise — 2-4 sentences max unless more detail is genuinely needed
- For pricing questions: explain that pricing varies by project scope and invite them to schedule a consultation
- Always gently encourage potential clients to reach out for a personal consultation
- Do NOT invent specific prices, timelines, or details you don't know

Contact details to share when relevant:
- Email: studio@talyazaltsman.com
- Phone: +972 50-123-4567
- Website: talyazaltsman.com`;

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    // Validate & sanitize messages
    const sanitized = messages
      .filter((m: { role: string; content: string }) =>
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
      )
      .slice(-20) // keep last 20 messages max
      .map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content.trim(),
      }));

    if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== 'user') {
      return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 });
    }

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: sanitized,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('[chat API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

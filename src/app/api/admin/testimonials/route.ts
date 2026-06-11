import { NextResponse } from 'next/server';
import { getAllTestimonials, createTestimonial } from '@/lib/firestore';

export async function GET() {
  try {
    const testimonials = await getAllTestimonials();
    return NextResponse.json(testimonials);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = await createTestimonial(data);
    return NextResponse.json({ id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

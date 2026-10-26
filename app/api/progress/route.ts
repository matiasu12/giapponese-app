import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const kanjiId = body?.kanjiId;
    const imparato = body?.imparato ?? false;

    if (!kanjiId) {
      return NextResponse.json({ error: 'kanjiId richiesto' }, { status: 400 });
    }

    const progress = await prisma.userProgress.upsert({
      where: { kanjiId },
      create: { kanjiId, imparato },
      update: { imparato },
    });

    return NextResponse.json({ success: true, progress });
  } catch (e: any) {
    console.error('Progress API error:', e);
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}

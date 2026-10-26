import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const learnedProgress = await prisma.userProgress.findMany({
      where: { imparato: true },
      include: {
        kanji: {
          select: { id: true, kanji: true, significato: true, onyomi: true, kunyomi: true },
        },
      },
    });

    const kanji = (learnedProgress ?? []).map((p: any) => p?.kanji).filter(Boolean);

    return NextResponse.json({ kanji });
  } catch (e: any) {
    console.error('Quiz API error:', e);
    return NextResponse.json({ kanji: [], error: e?.message ?? 'Error' }, { status: 500 });
  }
}

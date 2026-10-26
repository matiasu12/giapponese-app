import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { allKanji } from '@/scripts/seed-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const jlpt = url.searchParams.get('jlpt') ?? 'N5';
    const categoria = url.searchParams.get('categoria');
    const search = url.searchParams.get('search')?.toLowerCase().trim() ?? '';
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);
    const skip = (page - 1) * limit;

    let learnedSet = new Set<string>();
    try {
      const progressList = await prisma.userProgress.findMany({
        where: { imparato: true },
        include: { kanji: { select: { kanji: true } } },
      });
      learnedSet = new Set(progressList.map((p: any) => p?.kanji?.kanji));
    } catch {
      // Se il DB non risponde, continua senza bloccare
    }

    const filtered = allKanji
      .map((k, idx) => ({
        id: idx + 1,
        ...k,
        progress: learnedSet.has(k.kanji) ? { imparato: true } : null,
      }))
      .filter((k) => {
        if (jlpt && k.jlpt !== jlpt) return false;
        if (categoria && categoria !== 'tutti' && k.categoria !== categoria) return false;
        if (search) {
          return (
            k.kanji.toLowerCase().includes(search) ||
            k.significato.toLowerCase().includes(search) ||
            k.onyomi.toLowerCase().includes(search) ||
            k.kunyomi.toLowerCase().includes(search)
          );
        }
        return true;
      });

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json({ kanji: paginated, total });
  } catch (e: any) {
    console.error('Kanji API error:', e);
    return NextResponse.json({ kanji: [], total: 0, error: e?.message ?? 'Error' }, { status: 500 });
  }
}
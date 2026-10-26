import { prisma } from '@/lib/db';
import { HomeClient } from './home-client';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let totalKanji = 0;
  let learnedCount = 0;
  let jlptCounts: Record<string, number> = {};
  let jlptLearned: Record<string, number> = {};

  try {
    totalKanji = await prisma.kanji.count();
    learnedCount = await prisma.userProgress.count({ where: { imparato: true } });
    
    const jlptGroups = await prisma.kanji.groupBy({ by: ['jlpt'], _count: { id: true } });
    for (const g of jlptGroups ?? []) {
      jlptCounts[g?.jlpt ?? ''] = g?._count?.id ?? 0;
    }

    const learnedGroups = await prisma.userProgress.findMany({
      where: { imparato: true },
      include: { kanji: { select: { jlpt: true } } }
    });
    for (const p of learnedGroups ?? []) {
      const jlpt = p?.kanji?.jlpt ?? '';
      jlptLearned[jlpt] = (jlptLearned[jlpt] ?? 0) + 1;
    }
  } catch (e) {
    console.error('Error loading stats:', e);
  }

  return (
    <HomeClient
      totalKanji={totalKanji}
      learnedCount={learnedCount}
      jlptCounts={jlptCounts}
      jlptLearned={jlptLearned}
    />
  );
}

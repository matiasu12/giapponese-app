import { PrismaClient } from '@prisma/client';
import { allKanji } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${allKanji.length} kanji...`);
  
  for (let i = 0; i < allKanji.length; i++) {
    const k = allKanji[i];
    if (!k) continue;
    await prisma.kanji.upsert({
      where: { kanji: k.kanji },
      create: {
        kanji: k.kanji,
        onyomi: k.onyomi ?? '',
        kunyomi: k.kunyomi ?? '',
        significato: k.significato ?? '',
        radicale: k.radicale ?? '',
        jlpt: k.jlpt ?? 'N5',
        categoria: k.categoria ?? 'altro',
        storiella: k.storiella ?? '',
        esempi: k.esempi ?? '',
      },
      update: {
        onyomi: k.onyomi ?? '',
        kunyomi: k.kunyomi ?? '',
        significato: k.significato ?? '',
        radicale: k.radicale ?? '',
        jlpt: k.jlpt ?? 'N5',
        categoria: k.categoria ?? 'altro',
        storiella: k.storiella ?? '',
        esempi: k.esempi ?? '',
      },
    });
    if ((i + 1) % 50 === 0) console.log(`  ${i + 1}/${allKanji.length}`);
  }
  
  console.log(`Done! Seeded ${allKanji.length} kanji.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

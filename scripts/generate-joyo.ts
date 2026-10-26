import fs from 'fs';
import path from 'path';
import { allKanji, KanjiSeed } from './seed-data';

// Fonte open-source con tutti i Kanji Jōyō (grado 1-8), letture, significati e livelli JLPT
const KANJI_DATA_URL =
  'https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json';

interface RawKanjiEntry {
  strokes: number;
  grade: number | null;
  freq: number | null;
  jlpt_old: number | null;
  jlpt_new: number | null;
  meanings: string[];
  readings_on: string[];
  readings_kun: string[];
  wk_radicals?: string[];
}

// Classificatore automatico nelle 18 categorie del progetto in base al significato
function detectCategory(meaningsEn: string[], meaningIt: string): string {
  const text = [...meaningsEn, meaningIt].join(' ').toLowerCase();

  if (/\b(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million|zero|number|count|numeral|first|second|third|double|triple)\b/.test(text)) return 'numeri';
  if (/\b(red|blue|green|yellow|white|black|purple|crimson|color|colour|violet|brown|grey|gray|scarlet|indigo|gold|silver)\b/.test(text)) return 'colori';
  if (/\b(time|day|month|year|hour|minute|second|morning|evening|night|noon|week|season|spring|summer|autumn|winter|yesterday|today|tomorrow|past|future|era|epoch|eternity|instant|early|late|clock|calendar)\b/.test(text)) return 'tempo';
  if (/\b(body|head|face|eye|ear|nose|mouth|tooth|tongue|neck|throat|shoulder|arm|hand|finger|chest|heart|stomach|back|waist|leg|foot|bone|skin|blood|hair|brain|muscle|organ|flesh|beard)\b/.test(text)) return 'corpo';
  if (/\b(father|mother|parent|child|son|daughter|brother|sister|husband|wife|family|uncle|aunt|grandchild|ancestor|clan|descendant|marriage|bride|widow)\b/.test(text)) return 'famiglia';
  if (/\b(dog|cat|bird|fish|horse|cow|cattle|pig|sheep|monkey|snake|dragon|tiger|rabbit|mouse|rat|insect|bug|whale|wolf|hawk|crane|turtle|butterfly|frog|deer|bear|elephant|fox|chicken|crow|silkworm|shellfish)\b/.test(text)) return 'animali';
  if (/\b(food|eat|drink|rice|meat|tea|sake|alcohol|milk|water|salt|sugar|sweet|bitter|sour|spicy|hot|cook|boil|bake|roast|meal|flour|wheat|bean|vegetable|fruit|fish|soup|cake|nourish)\b/.test(text)) return 'cibo';
  if (/\b(tree|wood|forest|mountain|river|sea|ocean|lake|pond|rain|snow|wind|cloud|sky|heaven|star|sun|moon|earth|soil|ground|stone|rock|sand|fire|flame|water|wave|island|valley|cliff|field|flower|grass|leaf|root|bamboo|pine|cherry|plum|willow|mist|fog|storm|thunder|lightning|frost|dew|ice|tide|harbor)\b/.test(text)) return 'natura';
  if (/\b(north|south|east|west|left|right|up|down|above|below|inside|outside|front|back|behind|center|middle|direction|side|corner|edge|near|far|opposite|vertical|horizontal)\b/.test(text)) return 'direzioni';
  if (/\b(long|short|high|tall|low|wide|narrow|thick|thin|heavy|light|deep|shallow|big|large|small|little|many|much|few|measure|weight|length|size|degree|limit|half|whole|all|part|ratio|percent|volume|distance|speed)\b/.test(text)) return 'misure';
  if (/\b(school|study|learn|teach|write|read|book|letter|character|word|language|sentence|exam|test|class|lesson|science|literature|history|math|dictionary|pen|brush|ink|paper|note|research|knowledge)\b/.test(text)) return 'scuola';
  if (/\b(work|job|office|company|business|trade|sell|buy|shop|store|factory|industry|farm|agriculture|money|tax|profit|salary|wage|bank|economy|finance|manufacture|employ|labor|duty|profession|manage)\b/.test(text)) return 'lavoro';
  if (/\b(love|hate|happy|joy|sad|sorrow|angry|anger|fear|afraid|worry|anxious|peace|calm|quiet|hope|wish|desire|dream|feel|emotion|mind|spirit|soul|kind|gentle|brave|courage|proud|pride|shame|lonely|regret|pity|gratitude|laugh|smile|cry|weep)\b/.test(text)) return 'sentimenti';
  if (/\b(house|home|room|building|hall|temple|shrine|castle|palace|tower|bridge|station|port|road|street|way|path|city|town|village|country|nation|prefecture|district|park|garden|hospital|hotel|inn|prison|grave|market|plaza|courtyard)\b/.test(text)) return 'luoghi';
  if (/\b(person|man|woman|boy|girl|friend|king|emperor|queen|prince|princess|samurai|warrior|soldier|doctor|teacher|student|guest|customer|neighbor|enemy|rival|hero|thief|monk|priest|author|master|servant|citizen|crowd|public)\b/.test(text)) return 'persone';
  if (/\b(car|vehicle|train|ship|boat|wheel|sword|blade|knife|bow|arrow|gun|bell|mirror|jewel|gem|ring|clothes|garment|hat|shoe|bag|box|cup|bowl|plate|pot|pan|bed|chair|table|desk|door|window|roof|wall|pillar|rope|thread|needle|cloth|silk|medicine|tool|machine|vessel|coin|treasure)\b/.test(text)) return 'oggetti';
  if (/\b(go|come|run|walk|stop|stand|sit|sleep|wake|open|close|push|pull|throw|catch|hold|carry|send|receive|give|take|make|create|build|break|destroy|cut|hit|strike|fight|protect|defend|attack|win|lose|choose|decide|change|move|turn|return|enter|exit|climb|descend|fly|swim|jump|dance|sing|speak|talk|say|tell|ask|answer|call|shout|look|see|watch|hear|listen|think|know|understand|remember|forget|believe|doubt|wait|meet|gather|separate|hide|search|find|use|help|save|wash|clean|dye|weave|sew|plant|harvest)\b/.test(text)) return 'azioni';

  return 'altro';
}

// Traduce un blocco di testi dall'inglese all'italiano usando l'API gratuita di Google Translate
async function translateBatchToItalian(texts: string[]): Promise<string[]> {
  try {
    const joined = texts.join('\n');
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=it&dt=t&q=${encodeURIComponent(joined)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const translatedFull: string = (data?.[0] ?? [])
      .map((item: any) => item?.[0] ?? '')
      .join('');
    const lines = translatedFull.split('\n').map((s) => s.trim().toLowerCase());
    if (lines.length === texts.length) {
      return lines;
    }
  } catch (err) {
    // Fallback silenzioso in caso di rate-limit
  }
  return texts.map((t) => t.toLowerCase());
}

async function main() {
  console.log('1. Lettura dei kanji esistenti in seed-data.ts...');
  const existingMap = new Map<string, KanjiSeed>();
  for (const k of allKanji) {
    if (k && k.kanji && k.kanji.length === 1) {
      existingMap.set(k.kanji, k);
    }
  }
  console.log(`   -> Trovati ${existingMap.size} kanji già presenti.`);

  console.log('2. Download del dataset completo dei 2.136 Jōyō Kanji...');
  const res = await fetch(KANJI_DATA_URL);
  if (!res.ok) {
    throw new Error(`Impossibile scaricare il dataset kanji: ${res.statusText}`);
  }
  const rawData: Record<string, RawKanjiEntry> = await res.json();

  // Filtra tutti i Jōyō Kanji ufficiali
  const joyoEntries = Object.entries(rawData).filter(
    ([, info]) => info.grade !== null && [1, 2, 3, 4, 5, 6, 8].includes(info.grade)
  );
  console.log(`   -> Trovati ${joyoEntries.length} Jōyō Kanji ufficiali nel dataset.`);

  const missingEntries = joyoEntries.filter(([char]) => !existingMap.has(char));
  console.log(`   -> Kanji nuovi da generare e tradurre: ${missingEntries.length}`);

  const BATCH_SIZE = 40;
  const generatedKanji: KanjiSeed[] = [];

  for (let i = 0; i < missingEntries.length; i += BATCH_SIZE) {
    const batch = missingEntries.slice(i, i + BATCH_SIZE);
    const englishMeanings = batch.map(([, info]) =>
      (info.meanings ?? []).slice(0, 3).join(', ')
    );

    const italianMeanings = await translateBatchToItalian(englishMeanings);

    for (let j = 0; j < batch.length; j++) {
      const [char, info] = batch[j];
      const significato = italianMeanings[j] || englishMeanings[j] || 'carattere giapponese';
      const onyomi = (info.readings_on ?? []).join('、');
      const kunyomi = (info.readings_kun ?? []).join('、');

      let jlpt = 'N1';
      if (info.jlpt_new === 5) jlpt = 'N5';
      else if (info.jlpt_new === 4) jlpt = 'N4';
      else if (info.jlpt_new === 3) jlpt = 'N3';
      else if (info.jlpt_new === 2) jlpt = 'N2';
      else if (info.jlpt_new === 1) jlpt = 'N1';
      else if (info.grade === 1) jlpt = 'N5';
      else if (info.grade === 2) jlpt = 'N4';
      else if (info.grade === 3 || info.grade === 4) jlpt = 'N3';
      else if (info.grade === 5 || info.grade === 6) jlpt = 'N2';

      const categoria = detectCategory(info.meanings ?? [], significato);
      const primaryReading = info.readings_kun?.[0]?.replace(/\..*$/, '') || info.readings_on?.[0] || '';

      generatedKanji.push({
        kanji: char,
        onyomi,
        kunyomi,
        significato,
        radicale: char,
        jlpt,
        categoria,
        storiella: `Kanji di livello ${jlpt} (${info.strokes} tratti) legato al concetto di "${significato}".`,
        esempi: primaryReading
          ? `${char} (${primaryReading}) - ${significato.split(',')[0]}`
          : `${char} - ${significato.split(',')[0]}`,
      });
    }

    process.stdout.write(`\r   -> Tradotti e preparati: ${Math.min(i + BATCH_SIZE, missingEntries.length)}/${missingEntries.length}`);
  }
  console.log('\n');

  const jlptOrder: Record<string, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 };
  const finalKanjiList: KanjiSeed[] = [
    ...Array.from(existingMap.values()),
    ...generatedKanji,
  ].sort((a, b) => (jlptOrder[a.jlpt] ?? 5) - (jlptOrder[b.jlpt] ?? 5));

  console.log(`3. Scrittura di ${finalKanjiList.length} kanji in scripts/seed-data.ts...`);
  const seedFilePath = path.join(__dirname, 'seed-data.ts');

  const lines = [
    'export interface KanjiSeed {',
    '  kanji: string; onyomi: string; kunyomi: string; significato: string;',
    '  radicale: string; jlpt: string; categoria: string; storiella: string; esempi: string;',
    '}',
    '',
    'export const allKanji: KanjiSeed[] = [',
    ...finalKanjiList.map((k) => JSON.stringify(k) + ','),
    '];',
    '',
  ];

  fs.writeFileSync(seedFilePath, lines.join('\n'), 'utf-8');
  console.log('   -> File scripts/seed-data.ts aggiornato con successo!');
  console.log(`\nCompletato! Tutti i ${finalKanjiList.length} Jōyō Kanji sono pronti in seed-data.ts per il tuo localhost.`);
}

main().catch((e) => {
  console.error('Errore:', e);
  process.exit(1);
});
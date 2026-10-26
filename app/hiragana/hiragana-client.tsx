'use client';

import { SpeakButton } from '@/components/speak-button';
import { motion } from 'framer-motion';
import { useState } from 'react';

type KanaEntry = { kana: string; romaji: string };
type KanaGroup = { label: string; chars: KanaEntry[] };

const base: KanaGroup[] = [
  { label: 'Vocali', chars: [{ kana: '\u3042', romaji: 'a' }, { kana: '\u3044', romaji: 'i' }, { kana: '\u3046', romaji: 'u' }, { kana: '\u3048', romaji: 'e' }, { kana: '\u304A', romaji: 'o' }] },
  { label: 'K', chars: [{ kana: '\u304B', romaji: 'ka' }, { kana: '\u304D', romaji: 'ki' }, { kana: '\u304F', romaji: 'ku' }, { kana: '\u3051', romaji: 'ke' }, { kana: '\u3053', romaji: 'ko' }] },
  { label: 'S', chars: [{ kana: '\u3055', romaji: 'sa' }, { kana: '\u3057', romaji: 'shi' }, { kana: '\u3059', romaji: 'su' }, { kana: '\u305B', romaji: 'se' }, { kana: '\u305D', romaji: 'so' }] },
  { label: 'T', chars: [{ kana: '\u305F', romaji: 'ta' }, { kana: '\u3061', romaji: 'chi' }, { kana: '\u3064', romaji: 'tsu' }, { kana: '\u3066', romaji: 'te' }, { kana: '\u3068', romaji: 'to' }] },
  { label: 'N', chars: [{ kana: '\u306A', romaji: 'na' }, { kana: '\u306B', romaji: 'ni' }, { kana: '\u306C', romaji: 'nu' }, { kana: '\u306D', romaji: 'ne' }, { kana: '\u306E', romaji: 'no' }] },
  { label: 'H', chars: [{ kana: '\u306F', romaji: 'ha' }, { kana: '\u3072', romaji: 'hi' }, { kana: '\u3075', romaji: 'fu' }, { kana: '\u3078', romaji: 'he' }, { kana: '\u307B', romaji: 'ho' }] },
  { label: 'M', chars: [{ kana: '\u307E', romaji: 'ma' }, { kana: '\u307F', romaji: 'mi' }, { kana: '\u3080', romaji: 'mu' }, { kana: '\u3081', romaji: 'me' }, { kana: '\u3082', romaji: 'mo' }] },
  { label: 'Y', chars: [{ kana: '\u3084', romaji: 'ya' }, { kana: '\u3086', romaji: 'yu' }, { kana: '\u3088', romaji: 'yo' }] },
  { label: 'R', chars: [{ kana: '\u3089', romaji: 'ra' }, { kana: '\u308A', romaji: 'ri' }, { kana: '\u308B', romaji: 'ru' }, { kana: '\u308C', romaji: 're' }, { kana: '\u308D', romaji: 'ro' }] },
  { label: 'W/N', chars: [{ kana: '\u308F', romaji: 'wa' }, { kana: '\u3092', romaji: 'wo' }, { kana: '\u3093', romaji: 'n' }] },
];

const dakuten: KanaGroup[] = [
  { label: 'G', chars: [{ kana: '\u304C', romaji: 'ga' }, { kana: '\u304E', romaji: 'gi' }, { kana: '\u3050', romaji: 'gu' }, { kana: '\u3052', romaji: 'ge' }, { kana: '\u3054', romaji: 'go' }] },
  { label: 'Z', chars: [{ kana: '\u3056', romaji: 'za' }, { kana: '\u3058', romaji: 'ji' }, { kana: '\u305A', romaji: 'zu' }, { kana: '\u305C', romaji: 'ze' }, { kana: '\u305E', romaji: 'zo' }] },
  { label: 'D', chars: [{ kana: '\u3060', romaji: 'da' }, { kana: '\u3062', romaji: 'dji' }, { kana: '\u3065', romaji: 'dzu' }, { kana: '\u3067', romaji: 'de' }, { kana: '\u3069', romaji: 'do' }] },
  { label: 'B', chars: [{ kana: '\u3070', romaji: 'ba' }, { kana: '\u3073', romaji: 'bi' }, { kana: '\u3076', romaji: 'bu' }, { kana: '\u3079', romaji: 'be' }, { kana: '\u307C', romaji: 'bo' }] },
  { label: 'P', chars: [{ kana: '\u3071', romaji: 'pa' }, { kana: '\u3074', romaji: 'pi' }, { kana: '\u3077', romaji: 'pu' }, { kana: '\u307A', romaji: 'pe' }, { kana: '\u307D', romaji: 'po' }] },
];

const combo: KanaGroup[] = [
  { label: 'Ky', chars: [{ kana: '\u304D\u3083', romaji: 'kya' }, { kana: '\u304D\u3085', romaji: 'kyu' }, { kana: '\u304D\u3087', romaji: 'kyo' }] },
  { label: 'Sh', chars: [{ kana: '\u3057\u3083', romaji: 'sha' }, { kana: '\u3057\u3085', romaji: 'shu' }, { kana: '\u3057\u3087', romaji: 'sho' }] },
  { label: 'Ch', chars: [{ kana: '\u3061\u3083', romaji: 'cha' }, { kana: '\u3061\u3085', romaji: 'chu' }, { kana: '\u3061\u3087', romaji: 'cho' }] },
  { label: 'Ny', chars: [{ kana: '\u306B\u3083', romaji: 'nya' }, { kana: '\u306B\u3085', romaji: 'nyu' }, { kana: '\u306B\u3087', romaji: 'nyo' }] },
  { label: 'Hy', chars: [{ kana: '\u3072\u3083', romaji: 'hya' }, { kana: '\u3072\u3085', romaji: 'hyu' }, { kana: '\u3072\u3087', romaji: 'hyo' }] },
  { label: 'My', chars: [{ kana: '\u307F\u3083', romaji: 'mya' }, { kana: '\u307F\u3085', romaji: 'myu' }, { kana: '\u307F\u3087', romaji: 'myo' }] },
  { label: 'Ry', chars: [{ kana: '\u308A\u3083', romaji: 'rya' }, { kana: '\u308A\u3085', romaji: 'ryu' }, { kana: '\u308A\u3087', romaji: 'ryo' }] },
  { label: 'Gy', chars: [{ kana: '\u304E\u3083', romaji: 'gya' }, { kana: '\u304E\u3085', romaji: 'gyu' }, { kana: '\u304E\u3087', romaji: 'gyo' }] },
  { label: 'J', chars: [{ kana: '\u3058\u3083', romaji: 'ja' }, { kana: '\u3058\u3085', romaji: 'ju' }, { kana: '\u3058\u3087', romaji: 'jo' }] },
  { label: 'By', chars: [{ kana: '\u3073\u3083', romaji: 'bya' }, { kana: '\u3073\u3085', romaji: 'byu' }, { kana: '\u3073\u3087', romaji: 'byo' }] },
  { label: 'Py', chars: [{ kana: '\u3074\u3083', romaji: 'pya' }, { kana: '\u3074\u3085', romaji: 'pyu' }, { kana: '\u3074\u3087', romaji: 'pyo' }] },
];

function KanaCard({ entry }: { entry: KanaEntry }) {
  return (
    <div className="bg-card rounded-lg p-3 flex flex-col items-center gap-1 hover:bg-accent transition-colors group">
      <span className="text-2xl md:text-3xl font-jp">{entry.kana}</span>
      <span className="text-xs text-muted-foreground">{entry.romaji}</span>
      <SpeakButton text={entry.kana} size="sm" />
    </div>
  );
}

function KanaSection({ title, groups }: { title: string; groups: KanaGroup[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-display font-semibold text-primary">{title}</h2>
      {groups.map((g: KanaGroup) => (
        <div key={g.label} className="space-y-2">
          <h3 className="text-sm text-muted-foreground font-semibold">{g.label}</h3>
          <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2">
            {(g.chars ?? []).map((c: KanaEntry) => (
              <KanaCard key={c.kana} entry={c} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function HiraganaClient() {
  const [tab, setTab] = useState<'base' | 'dakuten' | 'combo'>('base');

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
          <span className="text-primary">Hiragana</span> ひらがな
        </h1>
        <p className="text-muted-foreground mt-2">Il sistema di scrittura base del giapponese. Clicca sull'icona audio per sentire la pronuncia.</p>
      </motion.div>

      <div className="flex gap-2">
        {[{ key: 'base' as const, label: 'Base (46)' }, { key: 'dakuten' as const, label: 'Dakuten/Handakuten' }, { key: 'combo' as const, label: 'Combinazioni' }].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {tab === 'base' && <KanaSection title="Hiragana Base" groups={base} />}
        {tab === 'dakuten' && <KanaSection title="Dakuten e Handakuten" groups={dakuten} />}
        {tab === 'combo' && <KanaSection title="Combinazioni (Yōon)" groups={combo} />}
      </motion.div>
    </div>
  );
}

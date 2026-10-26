'use client';

import { SpeakButton } from '@/components/speak-button';
import { motion } from 'framer-motion';
import { useState } from 'react';

type KanaEntry = { kana: string; romaji: string };
type KanaGroup = { label: string; chars: KanaEntry[] };

const base: KanaGroup[] = [
  { label: 'Vocali', chars: [{ kana: '\u30A2', romaji: 'a' }, { kana: '\u30A4', romaji: 'i' }, { kana: '\u30A6', romaji: 'u' }, { kana: '\u30A8', romaji: 'e' }, { kana: '\u30AA', romaji: 'o' }] },
  { label: 'K', chars: [{ kana: '\u30AB', romaji: 'ka' }, { kana: '\u30AD', romaji: 'ki' }, { kana: '\u30AF', romaji: 'ku' }, { kana: '\u30B1', romaji: 'ke' }, { kana: '\u30B3', romaji: 'ko' }] },
  { label: 'S', chars: [{ kana: '\u30B5', romaji: 'sa' }, { kana: '\u30B7', romaji: 'shi' }, { kana: '\u30B9', romaji: 'su' }, { kana: '\u30BB', romaji: 'se' }, { kana: '\u30BD', romaji: 'so' }] },
  { label: 'T', chars: [{ kana: '\u30BF', romaji: 'ta' }, { kana: '\u30C1', romaji: 'chi' }, { kana: '\u30C4', romaji: 'tsu' }, { kana: '\u30C6', romaji: 'te' }, { kana: '\u30C8', romaji: 'to' }] },
  { label: 'N', chars: [{ kana: '\u30CA', romaji: 'na' }, { kana: '\u30CB', romaji: 'ni' }, { kana: '\u30CC', romaji: 'nu' }, { kana: '\u30CD', romaji: 'ne' }, { kana: '\u30CE', romaji: 'no' }] },
  { label: 'H', chars: [{ kana: '\u30CF', romaji: 'ha' }, { kana: '\u30D2', romaji: 'hi' }, { kana: '\u30D5', romaji: 'fu' }, { kana: '\u30D8', romaji: 'he' }, { kana: '\u30DB', romaji: 'ho' }] },
  { label: 'M', chars: [{ kana: '\u30DE', romaji: 'ma' }, { kana: '\u30DF', romaji: 'mi' }, { kana: '\u30E0', romaji: 'mu' }, { kana: '\u30E1', romaji: 'me' }, { kana: '\u30E2', romaji: 'mo' }] },
  { label: 'Y', chars: [{ kana: '\u30E4', romaji: 'ya' }, { kana: '\u30E6', romaji: 'yu' }, { kana: '\u30E8', romaji: 'yo' }] },
  { label: 'R', chars: [{ kana: '\u30E9', romaji: 'ra' }, { kana: '\u30EA', romaji: 'ri' }, { kana: '\u30EB', romaji: 'ru' }, { kana: '\u30EC', romaji: 're' }, { kana: '\u30ED', romaji: 'ro' }] },
  { label: 'W/N', chars: [{ kana: '\u30EF', romaji: 'wa' }, { kana: '\u30F2', romaji: 'wo' }, { kana: '\u30F3', romaji: 'n' }] },
];

const dakuten: KanaGroup[] = [
  { label: 'G', chars: [{ kana: '\u30AC', romaji: 'ga' }, { kana: '\u30AE', romaji: 'gi' }, { kana: '\u30B0', romaji: 'gu' }, { kana: '\u30B2', romaji: 'ge' }, { kana: '\u30B4', romaji: 'go' }] },
  { label: 'Z', chars: [{ kana: '\u30B6', romaji: 'za' }, { kana: '\u30B8', romaji: 'ji' }, { kana: '\u30BA', romaji: 'zu' }, { kana: '\u30BC', romaji: 'ze' }, { kana: '\u30BE', romaji: 'zo' }] },
  { label: 'D', chars: [{ kana: '\u30C0', romaji: 'da' }, { kana: '\u30C2', romaji: 'dji' }, { kana: '\u30C5', romaji: 'dzu' }, { kana: '\u30C7', romaji: 'de' }, { kana: '\u30C9', romaji: 'do' }] },
  { label: 'B', chars: [{ kana: '\u30D0', romaji: 'ba' }, { kana: '\u30D3', romaji: 'bi' }, { kana: '\u30D6', romaji: 'bu' }, { kana: '\u30D9', romaji: 'be' }, { kana: '\u30DC', romaji: 'bo' }] },
  { label: 'P', chars: [{ kana: '\u30D1', romaji: 'pa' }, { kana: '\u30D4', romaji: 'pi' }, { kana: '\u30D7', romaji: 'pu' }, { kana: '\u30DA', romaji: 'pe' }, { kana: '\u30DD', romaji: 'po' }] },
];

const combo: KanaGroup[] = [
  { label: 'Ky', chars: [{ kana: '\u30AD\u30E3', romaji: 'kya' }, { kana: '\u30AD\u30E5', romaji: 'kyu' }, { kana: '\u30AD\u30E7', romaji: 'kyo' }] },
  { label: 'Sh', chars: [{ kana: '\u30B7\u30E3', romaji: 'sha' }, { kana: '\u30B7\u30E5', romaji: 'shu' }, { kana: '\u30B7\u30E7', romaji: 'sho' }] },
  { label: 'Ch', chars: [{ kana: '\u30C1\u30E3', romaji: 'cha' }, { kana: '\u30C1\u30E5', romaji: 'chu' }, { kana: '\u30C1\u30E7', romaji: 'cho' }] },
  { label: 'Ny', chars: [{ kana: '\u30CB\u30E3', romaji: 'nya' }, { kana: '\u30CB\u30E5', romaji: 'nyu' }, { kana: '\u30CB\u30E7', romaji: 'nyo' }] },
  { label: 'Hy', chars: [{ kana: '\u30D2\u30E3', romaji: 'hya' }, { kana: '\u30D2\u30E5', romaji: 'hyu' }, { kana: '\u30D2\u30E7', romaji: 'hyo' }] },
  { label: 'My', chars: [{ kana: '\u30DF\u30E3', romaji: 'mya' }, { kana: '\u30DF\u30E5', romaji: 'myu' }, { kana: '\u30DF\u30E7', romaji: 'myo' }] },
  { label: 'Ry', chars: [{ kana: '\u30EA\u30E3', romaji: 'rya' }, { kana: '\u30EA\u30E5', romaji: 'ryu' }, { kana: '\u30EA\u30E7', romaji: 'ryo' }] },
  { label: 'Gy', chars: [{ kana: '\u30AE\u30E3', romaji: 'gya' }, { kana: '\u30AE\u30E5', romaji: 'gyu' }, { kana: '\u30AE\u30E7', romaji: 'gyo' }] },
  { label: 'J', chars: [{ kana: '\u30B8\u30E3', romaji: 'ja' }, { kana: '\u30B8\u30E5', romaji: 'ju' }, { kana: '\u30B8\u30E7', romaji: 'jo' }] },
  { label: 'By', chars: [{ kana: '\u30D3\u30E3', romaji: 'bya' }, { kana: '\u30D3\u30E5', romaji: 'byu' }, { kana: '\u30D3\u30E7', romaji: 'byo' }] },
  { label: 'Py', chars: [{ kana: '\u30D4\u30E3', romaji: 'pya' }, { kana: '\u30D4\u30E5', romaji: 'pyu' }, { kana: '\u30D4\u30E7', romaji: 'pyo' }] },
];

function KanaCard({ entry }: { entry: KanaEntry }) {
  return (
    <div className="bg-card rounded-lg p-3 flex flex-col items-center gap-1 hover:bg-accent transition-colors">
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

export function KatakanaClient() {
  const [tab, setTab] = useState<'base' | 'dakuten' | 'combo'>('base');

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
          <span className="text-primary">Katakana</span> カタカナ
        </h1>
        <p className="text-muted-foreground mt-2">Usato per parole straniere, nomi propri e onomatopee. Clicca sull'icona audio per sentire la pronuncia.</p>
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
        {tab === 'base' && <KanaSection title="Katakana Base" groups={base} />}
        {tab === 'dakuten' && <KanaSection title="Dakuten e Handakuten" groups={dakuten} />}
        {tab === 'combo' && <KanaSection title="Combinazioni (Yōon)" groups={combo} />}
      </motion.div>
    </div>
  );
}

'use client';

import { BookOpen, Type, Languages, GraduationCap, BrainCircuit, Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HomeClientProps {
  totalKanji: number;
  learnedCount: number;
  jlptCounts: Record<string, number>;
  jlptLearned: Record<string, number>;
}

const sections = [
  { href: '/hiragana', label: 'Hiragana', desc: 'Le 46 sillabe base + varianti', icon: Type, char: 'あ' },
  { href: '/katakana', label: 'Katakana', desc: 'Le 46 sillabe base + varianti', icon: Languages, char: 'ア' },
  { href: '/kanji', label: 'Kanji', desc: 'Tutti i 2136 Jōyō Kanji', icon: BookOpen, char: '漢' },
  { href: '/grammatica', label: 'Grammatica', desc: 'Strutture e regole del giapponese', icon: GraduationCap, char: '文' },
  { href: '/quiz', label: 'Quiz', desc: 'Metti alla prova le tue conoscenze', icon: BrainCircuit, char: '試' },
];

const jlptColors: Record<string, string> = {
  N5: 'bg-green-500/20 text-green-400',
  N4: 'bg-blue-500/20 text-blue-400',
  N3: 'bg-yellow-500/20 text-yellow-400',
  N2: 'bg-orange-500/20 text-orange-400',
  N1: 'bg-red-500/20 text-red-400',
};

export function HomeClient({ totalKanji, learnedCount, jlptCounts, jlptLearned }: HomeClientProps) {
  const percentage = totalKanji > 0 ? Math.round((learnedCount / totalKanji) * 100) : 0;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
          Impara il <span className="text-primary">Giapponese</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Hiragana, Katakana, 2136 Kanji Jōyō, grammatica e quiz interattivi.
          Tutto in italiano.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-card rounded-lg p-6 text-center space-y-2">
          <Trophy className="w-8 h-8 text-secondary mx-auto" />
          <p className="text-3xl font-bold font-mono">{learnedCount}</p>
          <p className="text-sm text-muted-foreground">Kanji imparati</p>
        </div>
        <div className="bg-card rounded-lg p-6 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-primary mx-auto" />
          <p className="text-3xl font-bold font-mono">{totalKanji}</p>
          <p className="text-sm text-muted-foreground">Kanji totali</p>
        </div>
        <div className="bg-card rounded-lg p-6 text-center space-y-2">
          <Sparkles className="w-8 h-8 text-yellow-500 mx-auto" />
          <p className="text-3xl font-bold font-mono">{percentage}%</p>
          <p className="text-sm text-muted-foreground">Progresso</p>
        </div>
      </motion.div>

      {/* JLPT progress bars */}
      {totalKanji > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg p-6 space-y-4"
        >
          <h2 className="text-lg font-display font-semibold">Progressi per livello JLPT</h2>
          <div className="space-y-3">
            {['N5', 'N4', 'N3', 'N2', 'N1'].map((level) => {
              const total = jlptCounts?.[level] ?? 0;
              const learned = jlptLearned?.[level] ?? 0;
              const pct = total > 0 ? Math.round((learned / total) * 100) : 0;
              return (
                <div key={level} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${jlptColors[level] ?? ''}`}>{level}</span>
                    <span className="text-muted-foreground">{learned}/{total}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Navigation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s, i) => (
          <motion.div
            key={s.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 3) }}
          >
            <Link href={s.href}>
              <div className="bg-card rounded-lg p-6 hover:bg-accent transition-colors group cursor-pointer space-y-3">
                <div className="flex items-center justify-between">
                  <s.icon className="w-6 h-6 text-primary" />
                  <span className="text-3xl font-jp opacity-30 group-hover:opacity-60 transition-opacity">{s.char}</span>
                </div>
                <h3 className="text-lg font-display font-semibold">{s.label}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

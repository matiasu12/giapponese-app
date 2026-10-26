'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Check, X, RefreshCw, Trophy } from 'lucide-react';
import { SpeakButton } from '@/components/speak-button';
import { toast } from 'sonner';

interface KanjiQuiz {
  id: number;
  kanji: string;
  significato: string;
  onyomi: string;
  kunyomi: string;
}

type QuizMode = 'significato' | 'kanji' | null;

export function QuizClient() {
  const [mode, setMode] = useState<QuizMode>(null);
  const [pool, setPool] = useState<KanjiQuiz[]>([]);
  const [current, setCurrent] = useState<KanjiQuiz | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [errors, setErrors] = useState<KanjiQuiz[]>([]);

  const loadPool = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quiz');
      const data = await res?.json();
      const items = data?.kanji ?? [];
      if (items.length < 4) {
        toast.error('Devi imparare almeno 4 kanji per fare il quiz!');
        setMode(null);
        setLoading(false);
        return;
      }
      setPool(items);
      setCorrect(0);
      setWrong(0);
      setTotal(0);
      setFinished(false);
      setErrors([]);
      pickNext(items, 0);
    } catch (e) {
      console.error(e);
      toast.error('Errore nel caricamento dei kanji');
    } finally {
      setLoading(false);
    }
  }, []);

  const pickNext = (items: KanjiQuiz[], idx: number) => {
    if (idx >= Math.min(items?.length ?? 0, 20)) {
      setFinished(true);
      return;
    }
    const q = items?.[idx];
    if (!q) { setFinished(true); return; }
    setCurrent(q);
    setSelected(null);

    const others = (items ?? []).filter((k: KanjiQuiz) => k?.id !== q?.id);
    const shuffled = [...(others ?? [])].sort(() => Math.random() - 0.5).slice(0, 3);
    const allOpts = [...shuffled, q].sort(() => Math.random() - 0.5);
    setOptions(allOpts.map((k: KanjiQuiz) => mode === 'significato' ? (k?.significato ?? '') : (k?.kanji ?? '')));
  };

  useEffect(() => {
    if (mode) loadPool();
  }, [mode, loadPool]);

  const handleAnswer = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    const correctAnswer = mode === 'significato' ? (current?.significato ?? '') : (current?.kanji ?? '');
    const isCorrect = answer === correctAnswer;
    if (isCorrect) {
      setCorrect((c) => c + 1);
    } else {
      setWrong((w) => w + 1);
      if (current) setErrors((e) => [...(e ?? []), current]);
    }
    setTotal((t) => t + 1);

    setTimeout(() => {
      const nextIdx = (pool ?? []).indexOf(current as KanjiQuiz) + 1;
      pickNext(pool, nextIdx);
    }, 1200);
  };

  if (!mode) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            <span className="text-primary">Quiz</span> 試験
          </h1>
          <p className="text-muted-foreground mt-2">
            Metti alla prova i kanji che hai segnato come imparati.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setMode('significato')}
            className="bg-card rounded-lg p-8 text-center hover:bg-accent transition-colors space-y-3"
          >
            <BrainCircuit className="w-10 h-10 text-primary mx-auto" />
            <h2 className="text-xl font-display font-semibold">Kanji → Significato</h2>
            <p className="text-sm text-muted-foreground">Vedi il kanji, indovina il significato in italiano</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setMode('kanji')}
            className="bg-card rounded-lg p-8 text-center hover:bg-accent transition-colors space-y-3"
          >
            <BrainCircuit className="w-10 h-10 text-secondary mx-auto" />
            <h2 className="text-xl font-display font-semibold">Significato → Kanji</h2>
            <p className="text-sm text-muted-foreground">Vedi il significato, riconosci il kanji corretto</p>
          </motion.button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Caricamento quiz...</p>
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
          <Trophy className="w-16 h-16 text-secondary mx-auto" />
          <h1 className="text-3xl font-display font-bold">Quiz completato!</h1>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{correct}</p>
              <p className="text-sm text-muted-foreground">Corrette</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">{wrong}</p>
              <p className="text-sm text-muted-foreground">Errate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{pct}%</p>
              <p className="text-sm text-muted-foreground">Punteggio</p>
            </div>
          </div>

          {(errors?.length ?? 0) > 0 && (
            <div className="bg-card rounded-lg p-4 text-left space-y-2 max-w-md mx-auto">
              <h3 className="font-semibold text-sm">Kanji da ripassare:</h3>
              <div className="flex flex-wrap gap-2">
                {(errors ?? []).map((k: KanjiQuiz) => (
                  <div key={k?.id} className="bg-muted rounded px-3 py-1.5 flex items-center gap-2">
                    <span className="text-xl font-jp">{k?.kanji}</span>
                    <span className="text-xs text-muted-foreground">{k?.significato}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button onClick={() => loadPool()} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Rigioca
            </button>
            <button onClick={() => setMode(null)} className="px-6 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-accent transition-colors">
              Cambia modalità
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const correctAnswer = mode === 'significato' ? (current?.significato ?? '') : (current?.kanji ?? '');

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Domanda {total + 1}/{Math.min(pool?.length ?? 0, 20)}</span>
        <div className="flex gap-4">
          <span className="text-green-400">✓ {correct}</span>
          <span className="text-red-400">\u2717 {wrong}</span>
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${((total) / Math.min(pool?.length ?? 1, 20)) * 100}%` }} />
      </div>

      {/* Question */}
      <motion.div key={current?.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl p-8 text-center space-y-4">
        {mode === 'significato' ? (
          <>
            <p className="text-sm text-muted-foreground">Qual \u00e8 il significato di:</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-6xl font-jp">{current?.kanji}</span>
              <SpeakButton text={current?.kanji ?? ''} size="lg" />
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">Quale kanji significa:</p>
            <span className="text-3xl font-display font-bold text-primary">{current?.significato}</span>
          </>
        )}
      </motion.div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {(options ?? []).map((opt: string, i: number) => {
          const isCorrectOpt = opt === correctAnswer;
          const isSelected = selected === opt;
          let bg = 'bg-card hover:bg-accent';
          if (selected) {
            if (isCorrectOpt) bg = 'bg-green-500/20 border-green-500/50';
            else if (isSelected) bg = 'bg-red-500/20 border-red-500/50';
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={!!selected}
              className={`p-4 rounded-lg border border-border text-center transition-all ${bg} ${mode === 'kanji' ? 'text-3xl font-jp' : 'text-sm'}`}
            >
              {opt}
              {selected && isCorrectOpt && <Check className="w-4 h-4 text-green-400 inline ml-2" />}
              {selected && isSelected && !isCorrectOpt && <X className="w-4 h-4 text-red-400 inline ml-2" />}
            </button>
          );
        })}
      </div>

      <button onClick={() => setMode(null)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Torna alla selezione
      </button>
    </div>
  );
}

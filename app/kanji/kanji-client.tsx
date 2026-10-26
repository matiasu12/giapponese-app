'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Check, Volume2, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { SpeakButton } from '@/components/speak-button';
import { toast } from 'sonner';

interface KanjiData {
  id: number;
  kanji: string;
  onyomi: string;
  kunyomi: string;
  significato: string;
  radicale: string;
  jlpt: string;
  categoria: string;
  storiella: string;
  esempi: string;
  progress?: { imparato: boolean } | null;
}

const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const CATEGORIES = [
  'tutti', 'numeri', 'natura', 'colori', 'tempo', 'corpo', 'famiglia',
  'animali', 'cibo', 'luoghi', 'azioni', 'persone', 'scuola',
  'lavoro', 'sentimenti', 'oggetti', 'direzioni', 'misure', 'altro'
];

const jlptColors: Record<string, string> = {
  N5: 'bg-green-500/20 text-green-400 border-green-500/30',
  N4: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  N3: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  N2: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  N1: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const PAGE_SIZE = 50;

export function KanjiClient() {
  const [kanji, setKanji] = useState<KanjiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [jlpt, setJlpt] = useState('N5');
  const [categoria, setCategoria] = useState('tutti');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<KanjiData | null>(null);

  const fetchKanji = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        jlpt,
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (categoria !== 'tutti') params.set('categoria', categoria);
      if (search) params.set('search', search);

      const res = await fetch(`/api/kanji?${params}`);
      const data = await res.json();
      setKanji(data?.kanji ?? []);
      setTotal(data?.total ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [jlpt, categoria, search, page]);

  useEffect(() => {
    fetchKanji();
  }, [fetchKanji]);

  useEffect(() => {
    setPage(1);
  }, [jlpt, categoria, search]);

  const toggleLearned = async (kanjiId: number, current: boolean) => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kanjiId, imparato: !current }),
      });
      setKanji((prev) =>
        (prev ?? []).map((k: KanjiData) =>
          k?.id === kanjiId
            ? { ...(k ?? {}), progress: { imparato: !current } }
            : k
        )
      );
      if (selected?.id === kanjiId) {
        setSelected((prev) => prev ? { ...(prev ?? {}), progress: { imparato: !current } } : null);
      }
      toast.success(!current ? 'Kanji segnato come imparato!' : 'Kanji rimosso dagli imparati');
    } catch (e) {
      console.error(e);
      toast.error('Errore nel salvare il progresso');
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
          <span className="text-primary">Kanji</span> Jōyō 漢字
        </h1>
        <p className="text-muted-foreground mt-2">
          Tutti i 2136 kanji d'uso comune, ordinati per livello JLPT e categoria.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="space-y-4">
        {/* JLPT tabs */}
        <div className="flex gap-2 flex-wrap">
          {JLPT_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setJlpt(level)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                jlpt === level
                  ? jlptColors[level] ?? ''
                  : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-accent'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Search + category */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cerca kanji, significato..."
              value={search}
              onChange={(e) => setSearch(e?.target?.value ?? '')}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e?.target?.value ?? 'tutti')}
              className="pl-10 pr-8 py-2 bg-card border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {total} kanji trovati {jlpt && `(${jlpt})`}{categoria !== 'tutti' ? ` - ${categoria}` : ''}
      </p>

      {/* Kanji grid */}
      {loading ? (
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {(kanji ?? []).map((k: KanjiData) => (
            <motion.button
              key={k?.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelected(k)}
              className={`relative bg-card rounded-lg p-2 flex flex-col items-center gap-1 hover:bg-accent transition-colors cursor-pointer group ${
                k?.progress?.imparato ? 'ring-2 ring-green-500/50' : ''
              }`}
            >
              {k?.progress?.imparato && (
                <div className="absolute top-1 right-1">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
              )}
              <span className="text-2xl font-jp">{k?.kanji}</span>
              <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                {k?.significato}
              </span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg bg-card hover:bg-accent disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-muted-foreground">
            Pagina {page} di {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-lg bg-card hover:bg-accent disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e?.stopPropagation?.()}
              className="bg-card rounded-xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-jp">{selected?.kanji}</span>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${jlptColors[selected?.jlpt ?? ''] ?? ''}`}>
                      {selected?.jlpt}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">{selected?.categoria}</p>
                  </div>
                </div>
                <SpeakButton text={selected?.kanji ?? ''} size="lg" />
              </div>

              {/* Significato */}
              <div>
                <h3 className="text-lg font-semibold text-primary">{selected?.significato}</h3>
              </div>

              {/* Letture */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">On'yomi (cinese)</p>
                  <p className="font-jp text-sm">{selected?.onyomi || '-'}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Kun'yomi (giapponese)</p>
                  <p className="font-jp text-sm">{selected?.kunyomi || '-'}</p>
                </div>
              </div>

              {/* Radicale */}
              {selected?.radicale && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Radicale</p>
                  <p className="font-jp">{selected?.radicale}</p>
                </div>
              )}

              {/* Storiella */}
              {selected?.storiella && (
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <p className="text-xs text-primary mb-1 font-semibold">💡 Storiella mnemonica</p>
                  <p className="text-sm">{selected?.storiella}</p>
                </div>
              )}

              {/* Esempi */}
              {selected?.esempi && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Esempi</p>
                  <p className="text-sm font-jp">{selected?.esempi}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => toggleLearned(selected?.id ?? 0, selected?.progress?.imparato ?? false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                    selected?.progress?.imparato
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  <Check className="w-5 h-5" />
                  {selected?.progress?.imparato ? 'Imparato ✓' : 'Segna come imparato'}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-3 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-colors"
                >
                  Chiudi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

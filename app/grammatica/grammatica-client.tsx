'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface Lesson {
  title: string;
  level: string;
  content: string[];
}

const lessons: Lesson[] = [
  {
    title: 'Struttura della frase',
    level: 'Base',
    content: [
      'In giapponese l\'ordine della frase è SOV: Soggetto + Oggetto + Verbo.',
      'Esempio: 私はりんごを食べます (Watashi wa ringo o tabemasu) = Io mangio una mela.',
      'Il verbo va sempre alla fine della frase.',
      'Le particelle seguono il sostantivo a cui si riferiscono.',
    ],
  },
  {
    title: 'Particella は (wa) - Tema',
    level: 'Base',
    content: [
      'は (wa) indica il tema della frase — "per quanto riguarda...".',
      '私は学生です (Watashi wa gakusei desu) = Io sono uno studente.',
      'Si scrive con l\'hiragana は ma si pronuncia "wa" quando è particella.',
      'Differenza con が (ga): は indica il tema, が indica il soggetto specifico.',
    ],
  },
  {
    title: 'Particella が (ga) - Soggetto',
    level: 'Base',
    content: [
      'が (ga) marca il soggetto grammaticale della frase.',
      '猫がいます (Neko ga imasu) = C\'è un gatto.',
      'Usata per informazioni nuove o enfatizzare il soggetto.',
      'Con verbi come 好き (suki), 分かる (wakaru), 欲しい (hoshii) si usa が per l\'oggetto.',
    ],
  },
  {
    title: 'Particella を (o) - Oggetto diretto',
    level: 'Base',
    content: [
      'を (o) indica l\'oggetto diretto del verbo.',
      '水を飲みます (Mizu o nomimasu) = Bevo acqua.',
      'Si usa anche con verbi di movimento: 道を歩く (Michi o aruku) = Camminare per la strada.',
    ],
  },
  {
    title: 'Particella に (ni) - Destinazione/Tempo',
    level: 'Base',
    content: [
      'に (ni) indica la destinazione, il tempo specifico, o il complemento di termine.',
      '学校に行きます (Gakkou ni ikimasu) = Vado a scuola.',
      '三時に会いましょう (Sanji ni aimashou) = Incontriamoci alle tre.',
      '友達にあげます (Tomodachi ni agemasu) = Lo do all\'amico.',
    ],
  },
  {
    title: 'Particella で (de) - Luogo/Mezzo',
    level: 'Base',
    content: [
      'で (de) indica il luogo dove avviene un\'azione o il mezzo.',
      '図書館で勉強します (Toshokan de benkyou shimasu) = Studio in biblioteca.',
      'バスで行きます (Basu de ikimasu) = Vado in autobus.',
      'Differenza con に: に = esistenza/destinazione, で = azione in un luogo.',
    ],
  },
  {
    title: 'Particella の (no) - Possesso',
    level: 'Base',
    content: [
      'の (no) collega due sostantivi, indica possesso o appartenenza.',
      '私の本 (Watashi no hon) = Il mio libro.',
      '日本の文化 (Nihon no bunka) = La cultura del Giappone.',
      'Può essere omesso nel parlato informale tra pronomi e sostantivi.',
    ],
  },
  {
    title: 'Verbi: Forma ます (masu)',
    level: 'Base',
    content: [
      'La forma ます è la forma cortese dei verbi.',
      '食べます (tabemasu) = mangio/mangi/mangia (cortese).',
      'Negativo: 食べません (tabemasen) = non mangio.',
      'Passato: 食べました (tabemashita) = ho mangiato.',
      'Passato negativo: 食べませんでした (tabemasen deshita) = non ho mangiato.',
    ],
  },
  {
    title: 'Verbi: Gruppi verbali',
    level: 'Intermedio',
    content: [
      'Gruppo 1 (五段 godan): verbi che finiscono in -u, -ku, -gu, -su, -tsu, -nu, -bu, -mu, -ru.',
      'Gruppo 2 (一段 ichidan): verbi che finiscono in -iru o -eru.',
      'Gruppo 3 (irregolari): する (suru = fare) e 来る (kuru = venire).',
      'Esempio Gruppo 1: 書く (kaku = scrivere) → 書きます (kakimasu).',
      'Esempio Gruppo 2: 食べる (taberu = mangiare) → 食べます (tabemasu).',
    ],
  },
  {
    title: 'Forma て (te) dei verbi',
    level: 'Intermedio',
    content: [
      'La forma て collega azioni, fa richieste e forma costruzioni grammaticali.',
      'Gruppo 2: togliere る + て → 食べて (tabete).',
      'Gruppo 1: dipende dall\'ultima consonante.',
      '-く → いて (kaku → kaite), -ぐ → いで (oyogu → oyoide).',
      '-す → して (hanasu → hanashite), -む/ぶ/ぬ → んで (yomu → yonde).',
      '-つ/う/る → って (matsu → matte).',
      'Eccezione: 行く (iku) → 行って (itte).',
    ],
  },
  {
    title: 'Aggettivi い (i) e な (na)',
    level: 'Base',
    content: [
      'Aggettivi い: finiscono in い e si coniugano direttamente.',
      '大きい (ookii = grande) → 大きくない (ookikunai = non grande).',
      '大きかった (ookikatta = era grande).',
      '',
      'Aggettivi な: richiedono な prima del sostantivo.',
      '静かな部屋 (shizuka na heya = stanza tranquilla).',
      'Negativo: 静かじゃない (shizuka ja nai = non tranquillo).',
    ],
  },
  {
    title: 'です/だ - Copula (essere)',
    level: 'Base',
    content: [
      'です (desu) è la forma cortese di "essere".',
      '学生です (gakusei desu) = È uno studente.',
      'Negativo: じゃないです / ではありません (ja nai desu / dewa arimasen).',
      'Passato: でした (deshita) = era.',
      'だ (da) è la forma informale, usata nel parlato quotidiano.',
    ],
  },
  {
    title: 'Contatori (助数詞)',
    level: 'Intermedio',
    content: [
      'Il giapponese usa contatori specifici per diversi tipi di oggetti.',
      '人 (nin/ri) per persone: 一人 (hitori), 二人 (futari), 三人 (sannin).',
      '個 (ko) per oggetti piccoli: 一個 (ikko), 二個 (niko).',
      '本 (hon) per oggetti lunghi: 一本 (ippon), 二本 (nihon).',
      '枚 (mai) per oggetti piatti: 一枚 (ichimai).',
      '匹 (hiki) per animali piccoli: 一匹 (ippiki).',
      '台 (dai) per macchine/elettrodomestici: 一台 (ichidai).',
    ],
  },
  {
    title: 'Forma potenziale (可能形)',
    level: 'Intermedio',
    content: [
      'Indica la capacità di fare qualcosa ("potere").',
      'Gruppo 2: togliere る + られる → 食べられる (taberareru = potere mangiare).',
      'Gruppo 1: cambiare -u in -eru → 書ける (kakeru = potere scrivere).',
      'する → できる (dekiru), 来る → 来られる (korareru).',
      'L\'oggetto spesso prende が invece di を: 日本語が話せます (Nihongo ga hanasemasu).',
    ],
  },
  {
    title: 'Forma volitiva (意向形)',
    level: 'Intermedio',
    content: [
      'Esprime intenzione o invito ("facciamo...", "vorrei...").',
      'Gruppo 2: togliere る + よう → 食べよう (tabeyou = mangiamo!).',
      'Gruppo 1: cambiare -u in -ou → 行こう (ikou = andiamo!).',
      'Forma cortese: ましょう (mashou) → 行きましょう (ikimashou).',
      'と思う aggiunto esprime intenzione: 行こうと思います (ikou to omoimasu = ho intenzione di andare).',
    ],
  },
  {
    title: 'Condizionale たら (tara) e ば (ba)',
    level: 'Avanzato',
    content: [
      'たら: forma passata + ら. Condizione più comune, "se/quando".',
      '雨が降ったら、行きません (Ame ga futtara, ikimasen) = Se piove, non vado.',
      '',
      'ば: condizionale ipotetico. Gruppo 1: -u → -eba, Gruppo 2: -ru → -reba.',
      '安ければ買います (Yasukereba kaimasu) = Se è economico, compro.',
      'なら: basato su un\'informazione ricevuta. "Se è così che...".',
    ],
  },
  {
    title: 'Forma passiva (受身形)',
    level: 'Avanzato',
    content: [
      'Gruppo 2: togliere る + られる → 食べられる (taberareru).',
      'Gruppo 1: cambiare -u in -areru → 書かれる (kakareru = essere scritto).',
      'する → される (sareru), 来る → 来られる (korareru).',
      'Uso: 先生に褒められました (Sensei ni homeraremashita) = Sono stato lodato dal professore.',
      'Passivo di fastidio: 雨に降られた (Ame ni furareta) = Mi è piovuto addosso (sfortuna).',
    ],
  },
  {
    title: 'Forma causativa (使役形)',
    level: 'Avanzato',
    content: [
      'Indica "far fare qualcosa a qualcuno".',
      'Gruppo 2: togliere る + させる → 食べさせる (tabesaseru = far mangiare).',
      'Gruppo 1: cambiare -u in -aseru → 書かせる (kakaseru = far scrivere).',
      'する → させる (saseru), 来る → 来させる (kosaseru).',
      'Causativo-passivo: 食べさせられる (tabesaserareru) = essere costretto a mangiare.',
    ],
  },
];

function LessonCard({ lesson, index }: { lesson: Lesson; index: number }) {
  const [open, setOpen] = useState(false);

  const levelColor: Record<string, string> = {
    Base: 'bg-green-500/20 text-green-400',
    Intermedio: 'bg-yellow-500/20 text-yellow-400',
    Avanzato: 'bg-red-500/20 text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold">{lesson?.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded ${levelColor[lesson?.level ?? ''] ?? 'bg-muted text-muted-foreground'}`}>
              {lesson?.level}
            </span>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-4 pb-4 space-y-2"
        >
          {(lesson?.content ?? []).map((line: string, i: number) => (
            <p key={i} className={`text-sm ${
              line === '' ? 'h-2' : line?.includes('→') || line?.includes('=') ? 'font-jp text-foreground/90 bg-muted/50 rounded px-3 py-1.5' : 'text-muted-foreground'
            }`}>
              {line}
            </p>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export function GrammaticaClient() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
          <span className="text-primary">Grammatica</span> 文法
        </h1>
        <p className="text-muted-foreground mt-2">
          Le strutture grammaticali fondamentali del giapponese, spiegate in italiano.
        </p>
      </motion.div>

      <div className="space-y-3">
        {(lessons ?? []).map((lesson: Lesson, i: number) => (
          <LessonCard key={i} lesson={lesson} index={i} />
        ))}
      </div>
    </div>
  );
}

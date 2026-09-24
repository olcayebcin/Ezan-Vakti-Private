import React, { useState } from 'react';
import { DailyVerse, DailyHadith, WisdomQuote, DailyDua } from '../types/prayer';
import { X, Sun, Share2, Copy, Check, BookOpen, ScrollText, MessageSquareQuote, HandHeart, ChevronRight, Library } from 'lucide-react';

interface DailyModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: DailyVerse;
  hadith: DailyHadith;
  quote: WisdomQuote;
  dua: DailyDua;
  dateLabel: string;
  isDark: boolean;
  onOpenDiniBilgiler: () => void;
}

const FOOTER = '\n\nNamaz Vakti uygulamasından paylaşıldı.';

/** Today's verse, hadith, saying and prayer on one page, each shareable on its own. */
export const DailyModal: React.FC<DailyModalProps> = ({
  isOpen, onClose, verse, hadith, quote, dua, dateLabel, isDark, onOpenDiniBilgiler
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const muted = isDark ? 'text-neutral-400' : 'text-neutral-500';
  const body = isDark ? 'text-neutral-200' : 'text-neutral-700';
  const card = isDark ? 'bg-neutral-950/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200';
  const arabic = isDark ? 'text-amber-100' : 'text-amber-900';
  const iconBtn = isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700';

  const share = async (id: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    await copy(id, text);
  };

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(c => (c === id ? null : c)), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const Card: React.FC<{
    id: string; icon: React.ElementType; title: string; color: string; shareText: string; children: React.ReactNode;
  }> = ({ id, icon: Icon, title, color, shareText, children }) => (
    <article className={`p-4 rounded-2xl border ${card}`}>
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}22`, color }}>
            <Icon className="w-4 h-4" />
          </span>
          <h3 className="font-bold text-sm">{title}</h3>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => copy(id, shareText)} aria-label={`${title} kopyala`} className={`p-1.5 rounded-lg cursor-pointer ${iconBtn}`}>
            {copied === id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => share(id, shareText)} aria-label={`${title} paylaş`} className={`p-1.5 rounded-lg cursor-pointer ${iconBtn}`}>
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>
      {children}
    </article>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl h-full sm:h-[92vh] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border ${
          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold">Günün</h2>
              <p className={`text-xs ${muted}`}>{dateLabel} · Ayet, hadis, söz ve dua</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className={`p-2 rounded-xl cursor-pointer ${isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <Card
            id="verse" icon={BookOpen} title="Günün Ayeti" color="#ec4899"
            shareText={`📖 GÜNÜN AYETİ\n\n"${verse.translation}"\n\n(${verse.surahName}, ${verse.ayahNumber}. ayet)${FOOTER}`}
          >
            <p dir="rtl" lang="ar" className={`font-arabic text-2xl leading-[2] text-right select-text ${arabic}`}>{verse.arabic}</p>
            <p className={`text-sm leading-relaxed mt-2 select-text ${body}`}>“{verse.translation}”</p>
            <p className={`text-[11px] mt-2 ${muted}`}>{verse.surahName}, {verse.ayahNumber}. ayet · {verse.topic}</p>
          </Card>

          <Card
            id="hadith" icon={ScrollText} title="Günün Hadisi" color="#eab308"
            shareText={`🌙 GÜNÜN HADİSİ\n\n"${hadith.text}"\n\nKaynak: ${hadith.source}${FOOTER}`}
          >
            {hadith.arabic && (
              <p dir="rtl" lang="ar" className={`font-arabic text-xl leading-[2] text-right select-text ${arabic}`}>{hadith.arabic}</p>
            )}
            <p className={`text-sm leading-relaxed mt-1 select-text ${body}`}>“{hadith.text}”</p>
            <p className={`text-[11px] mt-2 ${muted}`}>Râvi: {hadith.narrator} · {hadith.source}</p>
          </Card>

          <Card
            id="quote" icon={MessageSquareQuote} title="Günün Sözü" color="#d97706"
            shareText={`✨ GÜNÜN SÖZÜ\n\n"${quote.quote}"\n\n— ${quote.author}${FOOTER}`}
          >
            <p className={`text-sm italic leading-relaxed select-text ${body}`}>“{quote.quote}”</p>
            <p className={`text-[11px] mt-2 ${muted}`}>— {quote.author} · {quote.era}</p>
          </Card>

          <Card
            id="dua" icon={HandHeart} title="Günün Duası" color="#06b6d4"
            shareText={`🤲 GÜNÜN DUASI\n\n${dua.title}\n\n${dua.turkishReading}\n\n"${dua.meaning}"${FOOTER}`}
          >
            <h4 className="font-bold text-sm text-cyan-500 mb-1">{dua.title}</h4>
            <p dir="rtl" lang="ar" className={`font-arabic text-xl leading-[2] text-right select-text ${arabic}`}>{dua.arabic}</p>
            <p className={`text-xs italic mt-1 select-text ${muted}`}>{dua.turkishReading}</p>
            <p className={`text-sm leading-relaxed mt-2 select-text ${body}`}>“{dua.meaning}”</p>
            {dua.benefit && <p className={`text-[11px] mt-2 ${muted}`}>{dua.benefit}</p>}
          </Card>

          <button
            onClick={onOpenDiniBilgiler}
            className={`w-full p-3 rounded-2xl border flex items-center gap-3 text-left cursor-pointer ${card}`}
          >
            <Library className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-sm block">Temel Dini Bilgiler</span>
              <span className={`text-[11px] ${muted}`}>32 Farz, namaz, Esmâ-ül Hüsnâ ve dualar</span>
            </div>
            <ChevronRight className={`w-4 h-4 ${muted}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

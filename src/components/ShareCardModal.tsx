import React, { useState } from 'react';
import { DailyVerse, DailyHadith, WisdomQuote, DailyDua } from '../types/prayer';
import { X, Share2, Copy, Check, MessageCircle, Download, Sparkles } from 'lucide-react';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: DailyVerse;
  hadith: DailyHadith;
  quote: WisdomQuote;
  dua: DailyDua;
  isDark: boolean;
  initialType?: 'verse' | 'hadith' | 'quote' | 'dua';
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  verse,
  hadith,
  quote,
  dua,
  isDark,
  initialType = 'verse'
}) => {
  const [contentType, setContentType] = useState<'verse' | 'hadith' | 'quote' | 'dua'>(initialType);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getShareText = () => {
    if (contentType === 'verse') {
      return `📖 GÜNÜN ÂYETİ-İ KERİMESİ\n\n"${verse.translation}"\n\n(${verse.surahName}, ${verse.ayahNumber}. Âyet)\n\nNamaz Vakti uygulamasından paylaşıldı.`;
    }
    if (contentType === 'hadith') {
      return `🌙 GÜNÜN HADİS-İ ŞERİFİ\n\n"${hadith.text}"\n\n— Hz. Muhammed (s.a.v.)\nKaynak: ${hadith.source}\n\nNamaz Vakti uygulamasından paylaşıldı.`;
    }
    if (contentType === 'quote') {
      return `✨ HİKMETLİ SÖZ\n\n"${quote.quote}"\n\n— ${quote.author} (${quote.era})\n\nNamaz Vakti uygulamasından paylaşıldı.`;
    }
    return `🤲 GÜNÜN DUASI\n\n${dua.title}\n"${dua.meaning}"\n\nNamaz Vakti uygulamasından paylaşıldı.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Günün İslami Paylaşımı',
          text: getShareText(),
        });
      } catch (err) {
        // user cancelled or failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md rounded-3xl flex flex-col max-h-[92vh] overflow-hidden shadow-2xl border transition-all ${
          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold">Günün Paylaşımı</h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Ayet, Hadis ve Hikmetleri Sevdiklerinizle Paylaşın
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Type Tabs */}
        <div className={`px-4 pt-3 border-b flex items-center gap-2 overflow-x-auto ${isDark ? 'border-neutral-800 bg-neutral-950/40' : 'border-neutral-200 bg-neutral-50'}`}>
          <button
            onClick={() => setContentType('verse')}
            className={`pb-2 px-2.5 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-all ${
              contentType === 'verse' ? 'border-amber-500 text-amber-500' : 'border-transparent text-neutral-400'
            }`}
          >
            Günün Âyeti
          </button>
          <button
            onClick={() => setContentType('hadith')}
            className={`pb-2 px-2.5 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-all ${
              contentType === 'hadith' ? 'border-amber-500 text-amber-500' : 'border-transparent text-neutral-400'
            }`}
          >
            Günün Hadisi
          </button>
          <button
            onClick={() => setContentType('quote')}
            className={`pb-2 px-2.5 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-all ${
              contentType === 'quote' ? 'border-amber-500 text-amber-500' : 'border-transparent text-neutral-400'
            }`}
          >
            Özlü Söz
          </button>
          <button
            onClick={() => setContentType('dua')}
            className={`pb-2 px-2.5 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-all ${
              contentType === 'dua' ? 'border-amber-500 text-amber-500' : 'border-transparent text-neutral-400'
            }`}
          >
            Günün Duası
          </button>
        </div>

        {/* Content Card Preview */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
          {/* Aesthetic Card for Sharing */}
          <div 
            className="w-full rounded-3xl p-6 relative overflow-hidden shadow-2xl border text-center select-text"
            style={{
              background: 'linear-gradient(145deg, #0d1520 0%, #151e29 60%, #0a0e14 100%)',
              borderColor: '#f59e0b44'
            }}
          >
            {/* Islamic decorative corner motif */}
            <div className="absolute top-2 left-2 text-amber-500/20 text-xs select-none">✦</div>
            <div className="absolute top-2 right-2 text-amber-500/20 text-xs select-none">✦</div>
            <div className="absolute bottom-2 left-2 text-amber-500/20 text-xs select-none">✦</div>
            <div className="absolute bottom-2 right-2 text-amber-500/20 text-xs select-none">✦</div>

            {/* Category badge */}
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3" />
              <span>
                {contentType === 'verse' && 'Günün Âyet-i Kerîmesi'}
                {contentType === 'hadith' && 'Günün Hadîs-i Şerîfi'}
                {contentType === 'quote' && 'Hikmetli Söz'}
                {contentType === 'dua' && 'Günün Duası'}
              </span>
            </div>

            {/* Main Content */}
            {contentType === 'verse' && (
              <>
                <p className="font-arabic text-2xl sm:text-3xl text-amber-200 leading-loose mb-4">
                  {verse.arabic}
                </p>
                <p className="text-sm sm:text-base font-medium text-neutral-100 leading-relaxed mb-4 italic">
                  "{verse.translation}"
                </p>
                <div className="text-xs text-amber-400 font-semibold">
                  {verse.surahName} · {verse.ayahNumber}. Âyet
                </div>
              </>
            )}

            {contentType === 'hadith' && (
              <>
                {hadith.arabic && (
                  <p className="font-arabic text-2xl text-amber-200 leading-loose mb-3">
                    {hadith.arabic}
                  </p>
                )}
                <p className="text-sm sm:text-base font-medium text-neutral-100 leading-relaxed mb-4 italic">
                  "{hadith.text}"
                </p>
                <div className="text-xs text-amber-400 font-semibold">
                  Hz. Muhammed (s.a.v.)
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Kaynak: {hadith.source}
                </div>
              </>
            )}

            {contentType === 'quote' && (
              <>
                <p className="text-base sm:text-lg font-medium text-neutral-100 leading-relaxed mb-5 italic">
                  "{quote.quote}"
                </p>
                <div className="text-sm text-amber-400 font-bold">
                  {quote.author}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  {quote.era}
                </div>
              </>
            )}

            {contentType === 'dua' && (
              <>
                <h4 className="text-base font-bold text-amber-400 mb-2">{dua.title}</h4>
                <p className="font-arabic text-2xl text-amber-200 leading-loose mb-3">
                  {dua.arabic}
                </p>
                <p className="text-xs text-neutral-400 italic mb-2">
                  {dua.turkishReading}
                </p>
                <p className="text-sm text-neutral-100 leading-relaxed mb-3">
                  "{dua.meaning}"
                </p>
                <div className="text-[11px] text-amber-500/90">
                  {dua.benefit}
                </div>
              </>
            )}

            {/* App watermark footer */}
            <div className="mt-6 pt-3 border-t border-neutral-800/80 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              <span>Namaz Vakti</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`p-4 border-t flex flex-wrap gap-2 justify-between ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <button
            onClick={handleCopy}
            className={`flex-1 py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
              copied 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                : isDark ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-300' : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kopyalandı' : 'Metni Kopyala'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 flex items-center justify-center gap-1.5 text-xs font-bold shadow-md transition-all cursor-pointer"
            title="Diğer uygulamalarla paylaş"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Paylaş</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { JuzProgress, Surah } from '../types/prayer';
import { SURAH_LIST, POPULAR_SURAH_CONTENTS, HATIM_DUASI, getInitialHatimProgress } from '../data/quranData';
import { X, BookOpen, CheckCircle, Search, Sparkles, Award, User, Volume2, Share2, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuranHatimModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const QuranHatimModal: React.FC<QuranHatimModalProps> = ({
  isOpen,
  onClose,
  isDark
}) => {
  const [activeTab, setActiveTab] = useState<'hatim' | 'quran' | 'dua'>('hatim');
  const [juzProgress, setJuzProgress] = useState<JuzProgress[]>(() => {
    const saved = localStorage.getItem('namaz_hatim_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getInitialHatimProgress();
      }
    }
    return getInitialHatimProgress();
  });

  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [surahSearch, setSurahSearch] = useState('');
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [assigningJuz, setAssigningJuz] = useState<number | null>(null);
  const [readerInput, setReaderInput] = useState('');

  // Persist hatim progress
  useEffect(() => {
    localStorage.setItem('namaz_hatim_progress', JSON.stringify(juzProgress));
  }, [juzProgress]);

  const completedCount = juzProgress.filter(j => j.isCompleted).length;
  const progressPercent = Math.round((completedCount / 30) * 100);

  const toggleJuzComplete = (juzNumber: number) => {
    setJuzProgress(prev => {
      const updated = prev.map(j => {
        if (j.juzNumber === juzNumber) {
          const nextState = !j.isCompleted;
          if (nextState) {
            // Trigger joyful celebration confetti
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 }
            });
          }
          return {
            ...j,
            isCompleted: nextState,
            readPages: nextState ? 20 : j.readPages,
            completedAt: nextState ? new Date().toLocaleDateString('tr-TR') : undefined
          };
        }
        return j;
      });

      // Check if all 30 are now complete
      const allDone = updated.every(j => j.isCompleted);
      if (allDone) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 }
        });
      }

      return updated;
    });
  };

  const handleAssignReader = (juzNumber: number) => {
    setJuzProgress(prev => prev.map(j => {
      if (j.juzNumber === juzNumber) {
        return {
          ...j,
          readerName: readerInput.trim() || undefined
        };
      }
      return j;
    }));
    setAssigningJuz(null);
    setReaderInput('');
  };

  const copyAyahText = (ayahNum: number, arabic: string, trans: string) => {
    const text = `${arabic}\n\n"${trans}"\n(${selectedSurah?.name} Sûresi, ${ayahNum}. Ayet)`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(ayahNum);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const filteredSurahs = SURAH_LIST.filter(s =>
    s.name.toLowerCase().includes(surahSearch.toLowerCase()) ||
    s.translation.toLowerCase().includes(surahSearch.toLowerCase()) ||
    String(s.id) === surahSearch
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-2xl rounded-3xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl border transition-all ${
          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold">Kuran-ı Kerim & Hatim Takibi</h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                30 Cüz Takip Çizelgesi, Sureler ve Hatim Duası
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

        {/* Tab Switcher */}
        <div className={`px-4 pt-3 border-b flex items-center gap-2 ${isDark ? 'border-neutral-800 bg-neutral-950/40' : 'border-neutral-200 bg-neutral-50'}`}>
          <button
            onClick={() => { setActiveTab('hatim'); setSelectedSurah(null); }}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'hatim'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Hatim Takibi ({completedCount}/30 Cüz)
          </button>
          <button
            onClick={() => setActiveTab('quran')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'quran'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Kur’an-ı Kerim Oku
          </button>
          <button
            onClick={() => { setActiveTab('dua'); setSelectedSurah(null); }}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'dua'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Hatim Duası
          </button>
        </div>

        {/* TAB 1: HATIM TAKIBI */}
        {activeTab === 'hatim' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Progress Card */}
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-neutral-950/80 border-neutral-800' : 'bg-amber-50/50 border-amber-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="font-bold text-sm">Hatim İlerlemesi</span>
                    <span className="text-xs text-neutral-400 ml-2">%{progressPercent} Tamamlandı</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-500 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  {completedCount} / 30 Cüz
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-2 text-[11px] text-neutral-400">
                <span>Her cüz ortalama 20 sayfadır.</span>
                {completedCount === 30 && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Hatm-i Şerif Tamamlandı!
                  </span>
                )}
              </div>
            </div>

            {/* Juz Grid (1-30) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {juzProgress.map((j) => (
                <div
                  key={j.juzNumber}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    j.isCompleted
                      ? isDark 
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
                        : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : isDark
                        ? 'bg-neutral-950/40 border-neutral-800 text-neutral-300'
                        : 'bg-white border-neutral-200 text-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-sm">{j.juzNumber}. Cüz</span>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {j.readerName ? `Okuyan: ${j.readerName}` : 'Kişisel / Boşta'}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleJuzComplete(j.juzNumber)}
                      className={`p-1 rounded-lg transition-transform active:scale-90 cursor-pointer ${
                        j.isCompleted ? 'text-emerald-400' : 'text-neutral-500 hover:text-amber-500'
                      }`}
                      title={j.isCompleted ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
                    >
                      <CheckCircle className={`w-5 h-5 ${j.isCompleted ? 'fill-emerald-500/20' : ''}`} />
                    </button>
                  </div>

                  {/* Assign reader button */}
                  <div className="mt-2 pt-2 border-t border-inherit/40 flex items-center justify-between text-[11px]">
                    <button
                      onClick={() => {
                        setAssigningJuz(j.juzNumber);
                        setReaderInput(j.readerName || '');
                      }}
                      className="text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <User className="w-3 h-3" />
                      <span>{j.readerName ? 'Düzenle' : 'Kişi Ata'}</span>
                    </button>

                    <span className="text-[10px] text-neutral-400">
                      {j.isCompleted ? '✓ Okundu' : 'Bekliyor'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Assign Reader Modal Popup */}
            {assigningJuz !== null && (
              <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/40 shadow-xl space-y-3">
                <h4 className="font-bold text-xs text-amber-400">
                  {assigningJuz}. Cüz İçin Okuyucu Belirle
                </h4>
                <input
                  type="text"
                  placeholder="Okuyanın Adı Soyadı (örn: Ahmet, Ayşe, Annem...)"
                  value={readerInput}
                  onChange={(e) => setReaderInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs focus:outline-none"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setAssigningJuz(null)}
                    className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => handleAssignReader(assigningJuz)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: KUR'AN-I KERİM */}
        {activeTab === 'quran' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedSurah ? (
              <div>
                {/* Surah Detail Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-inherit">
                  <div>
                    <button
                      onClick={() => setSelectedSurah(null)}
                      className="text-xs text-amber-500 hover:underline mb-1 flex items-center gap-1 cursor-pointer"
                    >
                      ← Sure Listesine Dön
                    </button>
                    <h3 className="text-lg font-bold">
                      {selectedSurah.id}. {selectedSurah.name} Sûresi
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {selectedSurah.revelationType} Dönemi · {selectedSurah.ayahCount} Âyet · {selectedSurah.translation}
                    </p>
                  </div>
                  <div className="font-arabic text-3xl text-amber-400">
                    {selectedSurah.arabicName}
                  </div>
                </div>

                {/* Verses Container */}
                {POPULAR_SURAH_CONTENTS[selectedSurah.id] ? (
                  <div className="space-y-4">
                    {POPULAR_SURAH_CONTENTS[selectedSurah.id].verses.map((v) => (
                      <div
                        key={v.number}
                        className={`p-4 rounded-2xl border transition-all ${
                          isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                        }`}
                      >
                        {/* Ayah number badge & copy */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold flex items-center justify-center">
                            {v.number}
                          </span>
                          <button
                            onClick={() => copyAyahText(v.number, v.arabic, v.translation)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-500 transition-colors cursor-pointer"
                            title="Âyeti Kopyala"
                          >
                            {copiedAyah === v.number ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Arabic Text */}
                        <p className="font-arabic text-2xl sm:text-3xl text-right leading-loose text-amber-100 mb-3 select-text">
                          {v.arabic}
                        </p>

                        {/* Latin Transcription */}
                        <p className="text-xs text-neutral-400 italic mb-1.5">
                          {v.transcription}
                        </p>

                        {/* Turkish Translation */}
                        <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                          {v.translation}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-neutral-400">
                    <p className="font-medium text-sm text-neutral-300 mb-1">
                      {selectedSurah.name} Sûresi Metni Yükleniyor
                    </p>
                    <p>Tam mushaf çevrimdışı önbelleğe alınmıştır. Yakında tüm âyetler sesli okunabilecektir.</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Search Bar */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border mb-3 ${
                  isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}>
                  <Search className="w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Sure ara (Fatiha, Yasin, Bakara, Mülk, İhlas...)"
                    value={surahSearch}
                    onChange={(e) => setSurahSearch(e.target.value)}
                    className="bg-transparent text-xs w-full focus:outline-none"
                  />
                </div>

                {/* Surahs List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredSurahs.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSurah(s)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer group ${
                        isDark 
                          ? 'bg-neutral-950/40 border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-800/40' 
                          : 'bg-white border-neutral-200 hover:border-amber-400 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold flex items-center justify-center">
                          {s.id}
                        </span>
                        <div>
                          <div className="font-bold text-xs group-hover:text-amber-500 transition-colors">
                            {s.name} Sûresi
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {s.revelationType} · {s.ayahCount} Âyet
                          </div>
                        </div>
                      </div>

                      <span className="font-arabic text-xl text-neutral-400 group-hover:text-amber-400 transition-colors">
                        {s.arabicName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HATIM DUASI */}
        {activeTab === 'dua' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className={`p-4 rounded-2xl border text-center ${
              isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <h3 className="font-bold text-base text-amber-500 mb-1">{HATIM_DUASI.title}</h3>
              <p className="text-xs text-neutral-400 mb-4">
                Hatim bitiren veya hatim meclisinde bulunanların okuyacağı mübarek dua
              </p>

              <div className="font-arabic text-2xl text-amber-200 leading-loose mb-4 p-3 rounded-xl bg-black/30">
                {HATIM_DUASI.arabic}
              </div>

              <div className="text-xs sm:text-sm text-left leading-relaxed whitespace-pre-line text-neutral-300">
                {HATIM_DUASI.turkish}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

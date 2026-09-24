import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Surah } from '../types/prayer';
import { SURAH_LIST } from '../data/quranData';
import {
  Ayah, BESMELE, JUZ_STARTS, MUKABELE_READER, RECITERS,
  ayahAudioUrl, ayahText, fetchSurah, hasBesmeleHeading, mealAudioUrl, mukabeleUrl
} from '../utils/quranApi';
import {
  X, BookOpen, Search, ArrowLeft, Play, Pause, Square, Loader2, Headphones,
  Type, Bookmark, AlertCircle, RefreshCw, Languages
} from 'lucide-react';

interface QuranModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  /** Tells the parent whether audio is playing, so it can keep the modal open across app switches. */
  onAudioActiveChange?: (active: boolean) => void;
}

type PlayMode = 'arabic' | 'arabic-meal' | 'meal';
type FontSize = 'md' | 'lg' | 'xl';
type Playback =
  | { kind: 'ayah'; surah: number; index: number; part: 'arabic' | 'meal' }
  | { kind: 'juz'; juz: number };

const PREFS_KEY = 'namaz_quran_prefs';
const LAST_READ_KEY = 'namaz_quran_last_read';

interface Prefs {
  reciterId: string;
  playMode: PlayMode;
  fontSize: FontSize;
  showMeal: boolean;
}

const DEFAULT_PREFS: Prefs = { reciterId: RECITERS[0].id, playMode: 'arabic', fontSize: 'lg', showMeal: true };

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable
  }
}

const ARABIC_SIZE: Record<FontSize, string> = { md: 'text-2xl', lg: 'text-3xl', xl: 'text-4xl' };
const MEAL_SIZE: Record<FontSize, string> = { md: 'text-xs', lg: 'text-sm', xl: 'text-base' };
const NEXT_SIZE: Record<FontSize, FontSize> = { md: 'lg', lg: 'xl', xl: 'md' };

const PLAY_MODES: { id: PlayMode; label: string }[] = [
  { id: 'arabic', label: 'Arapça' },
  { id: 'arabic-meal', label: 'Arapça + Meal' },
  { id: 'meal', label: 'Sadece Meal' },
];

const toArabicDigits = (n: number) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

const formatTime = (sec: number) => {
  if (!isFinite(sec)) return '--:--';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

const normalize = (s: string) =>
  s.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ'’]/g, '');

export const QuranModal: React.FC<QuranModalProps> = ({ isOpen, onClose, isDark, onAudioActiveChange }) => {
  const [tab, setTab] = useState<'surahs' | 'mukabele'>('surahs');
  const [search, setSearch] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(() => loadJson(PREFS_KEY, DEFAULT_PREFS));
  const [lastRead, setLastRead] = useState<{ surah: number; ayah: number } | null>(() => loadJson(LAST_READ_KEY, null));

  const [playback, setPlayback] = useState<Playback | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollToAyahRef = useRef<number | null>(null);
  // Latest values for the audio 'ended' handler, which is attached once.
  const stateRef = useRef({ playback, ayahs, prefs });
  stateRef.current = { playback, ayahs, prefs };

  const reciter = RECITERS.find(r => r.id === prefs.reciterId) ?? RECITERS[0];

  useEffect(() => saveJson(PREFS_KEY, prefs), [prefs]);
  useEffect(() => { if (lastRead) saveJson(LAST_READ_KEY, lastRead); }, [lastRead]);

  useEffect(() => {
    onAudioActiveChange?.(isPlaying);
  }, [isPlaying, onAudioActiveChange]);

  const getAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.addEventListener('playing', () => { setIsPlaying(true); setIsBuffering(false); });
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('waiting', () => setIsBuffering(true));
      audio.addEventListener('timeupdate', () => setProgress({ current: audio.currentTime, duration: audio.duration }));
      audio.addEventListener('error', () => { setAudioError(true); setIsBuffering(false); setIsPlaying(false); });
      audio.addEventListener('ended', () => handleEndedRef.current());
      audioRef.current = audio;
    }
    return audioRef.current;
  };

  const startAudio = (src: string, next: Playback) => {
    const audio = getAudio();
    setAudioError(false);
    setIsBuffering(true);
    setPlayback(next);
    audio.src = src;
    audio.play().catch(err => {
      if (err?.name !== 'AbortError') {
        setAudioError(true);
        setIsBuffering(false);
      }
    });
  };

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
    setPlayback(null);
    setIsPlaying(false);
    setIsBuffering(false);
    setProgress({ current: 0, duration: 0 });
  }, []);

  const playAyah = (surah: number, index: number, part: 'arabic' | 'meal') => {
    const ayah = stateRef.current.ayahs[index];
    if (!ayah) return stopAudio();
    const r = RECITERS.find(x => x.id === stateRef.current.prefs.reciterId) ?? RECITERS[0];
    const src = part === 'meal' ? mealAudioUrl(ayah.number) : ayahAudioUrl(r, ayah.number);
    startAudio(src, { kind: 'ayah', surah, index, part });
    setLastRead({ surah, ayah: ayah.numberInSurah });
    document.getElementById(`ayah-${ayah.numberInSurah}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleEndedRef = useRef<() => void>(() => undefined);
  handleEndedRef.current = () => {
    const { playback: pb, ayahs: list, prefs: p } = stateRef.current;
    if (!pb) return;
    if (pb.kind === 'juz') {
      if (pb.juz < 30) playJuz(pb.juz + 1);
      else stopAudio();
      return;
    }
    if (pb.part === 'arabic' && p.playMode === 'arabic-meal') {
      playAyah(pb.surah, pb.index, 'meal');
    } else if (pb.index + 1 < list.length) {
      playAyah(pb.surah, pb.index + 1, p.playMode === 'meal' ? 'meal' : 'arabic');
    } else {
      stopAudio();
    }
  };

  const playJuz = (juz: number) => startAudio(mukabeleUrl(juz), { kind: 'juz', juz });

  const togglePause = () => {
    const audio = audioRef.current;
    if (!audio || !playback) return;
    if (audio.paused) audio.play().catch(() => setAudioError(true));
    else audio.pause();
  };

  // Stop playback when the modal closes (including when the app hides it).
  useEffect(() => {
    if (!isOpen) {
      stopAudio();
      setSelectedSurah(null);
    }
  }, [isOpen, stopAudio]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  // Load the selected surah's text.
  const loadSurah = useCallback((surah: Surah) => {
    setLoading(true);
    setLoadError(false);
    setAyahs([]);
    fetchSurah(surah.id)
      .then(list => setAyahs(list))
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const openSurah = (surah: Surah, scrollToAyah?: number) => {
    if (playback?.kind === 'ayah' && playback.surah !== surah.id) stopAudio();
    scrollToAyahRef.current = scrollToAyah ?? null;
    setSelectedSurah(surah);
    loadSurah(surah);
    if (!scrollToAyah) setLastRead({ surah: surah.id, ayah: 1 });
  };

  useEffect(() => {
    if (!loading && ayahs.length && scrollToAyahRef.current) {
      const n = scrollToAyahRef.current;
      scrollToAyahRef.current = null;
      requestAnimationFrame(() => document.getElementById(`ayah-${n}`)?.scrollIntoView({ block: 'center' }));
    }
  }, [loading, ayahs]);

  const backToList = () => {
    if (playback?.kind === 'ayah') stopAudio();
    setSelectedSurah(null);
  };

  const filteredSurahs = useMemo(() => {
    const q = normalize(search.trim());
    if (!q) return SURAH_LIST;
    return SURAH_LIST.filter(s => normalize(s.name).includes(q) || String(s.id) === q || s.arabicName.includes(search.trim()));
  }, [search]);

  if (!isOpen) return null;

  const lastReadSurah = lastRead ? SURAH_LIST.find(s => s.id === lastRead.surah) : null;
  const muted = isDark ? 'text-neutral-400' : 'text-neutral-500';
  const card = isDark ? 'bg-neutral-950/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200';
  const chip = isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700';
  const selectCls = `text-[11px] px-2 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${
    isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
  }`;

  const playingAyahIndex = playback?.kind === 'ayah' && playback.surah === selectedSurah?.id ? playback.index : -1;
  const surahPlaying = playingAyahIndex >= 0;

  const nowPlayingLabel = playback
    ? playback.kind === 'juz'
      ? `${playback.juz}. Cüz — ${MUKABELE_READER}`
      : `${SURAH_LIST[playback.surah - 1]?.name} ${stateRef.current.ayahs[playback.index]?.numberInSurah ?? ''}. ayet — ${
          playback.part === 'meal' ? 'Meal' : reciter.name
        }`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl h-full sm:h-[92vh] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border transition-all ${
          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between gap-2 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="flex items-center gap-2 min-w-0">
            {selectedSurah ? (
              <button
                onClick={backToList}
                aria-label="Sure listesine dön"
                className={`p-2 -ml-2 rounded-xl cursor-pointer ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <BookOpen className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <h2 className="text-base font-bold truncate">
                {selectedSurah ? `${selectedSurah.id}. ${selectedSurah.name} Sûresi` : 'Kur’an-ı Kerîm'}
              </h2>
              <p className={`text-xs truncate ${muted}`}>
                {selectedSurah
                  ? `${selectedSurah.ayahCount} ayet · ${selectedSurah.revelationType}`
                  : 'Arapça metin · Diyanet meali · Sesli dinleme'}
              </p>
            </div>
          </div>
          {selectedSurah && (
            <span className="font-arabic text-2xl text-emerald-500 flex-shrink-0">{selectedSurah.arabicName}</span>
          )}
          <button
            onClick={onClose}
            aria-label="Kapat"
            className={`p-2 rounded-xl transition-colors cursor-pointer flex-shrink-0 ${
              isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!selectedSurah ? (
          <>
            {/* Tabs */}
            <div className={`px-4 pt-3 flex gap-2`}>
              {([['surahs', 'Sûreler'], ['mukabele', 'Mukabele']] as const).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    tab === id ? 'bg-emerald-600 text-white' : chip
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === 'surahs' ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {lastReadSurah && lastRead && (
                  <button
                    onClick={() => openSurah(lastReadSurah, lastRead.ayah)}
                    className="w-full p-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 flex items-center gap-3 text-left cursor-pointer"
                  >
                    <Bookmark className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className={`text-[11px] block ${muted}`}>Kaldığınız yer</span>
                      <span className="font-bold text-sm">{lastReadSurah.name} Sûresi, {lastRead.ayah}. ayet</span>
                    </div>
                  </button>
                )}

                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${card}`}>
                  <Search className={`w-4 h-4 ${muted}`} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Sûre adı veya numarası"
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  {filteredSurahs.map(s => (
                    <button
                      key={s.id}
                      onClick={() => openSurah(s)}
                      className={`w-full p-3 rounded-2xl border flex items-center gap-3 text-left cursor-pointer transition-colors ${card} ${
                        isDark ? 'hover:border-emerald-500/50' : 'hover:border-emerald-400'
                      }`}
                    >
                      <span className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {s.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-sm block">{s.name}</span>
                        <span className={`text-[11px] ${muted}`}>{s.revelationType} · {s.ayahCount} ayet</span>
                      </div>
                      <span className="font-arabic text-xl text-emerald-500">{s.arabicName}</span>
                    </button>
                  ))}
                  {filteredSurahs.length === 0 && (
                    <p className={`text-center text-xs py-6 ${muted}`}>Sonuç bulunamadı.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className={`p-3 rounded-2xl border ${card}`}>
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-sm">Hâfız {MUKABELE_READER}</span>
                  </div>
                  <p className={`text-[11px] mt-1 ${muted}`}>
                    TRT Diyanet mukabelesi, 30 cüz. Her cüz yaklaşık bir saat sürer; bir cüz bitince sıradaki başlar.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {JUZ_STARTS.map(([surah, ayah], i) => {
                    const juz = i + 1;
                    const active = playback?.kind === 'juz' && playback.juz === juz;
                    return (
                      <button
                        key={juz}
                        onClick={() => (active ? togglePause() : playJuz(juz))}
                        className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left cursor-pointer transition-colors ${
                          active ? 'bg-emerald-500/10 border-emerald-500/60' : card
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          active ? 'bg-emerald-600 text-white' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {active && isBuffering ? <Loader2 className="w-4 h-4 animate-spin" />
                            : active && isPlaying ? <Pause className="w-4 h-4 fill-current" />
                              : <Play className="w-4 h-4 fill-current" />}
                        </span>
                        <div className="min-w-0">
                          <span className="font-bold text-xs block">{juz}. Cüz</span>
                          <span className={`text-[10px] block truncate ${muted}`}>
                            {SURAH_LIST[surah - 1].name} {ayah}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Reader toolbar */}
            <div className={`px-4 py-2.5 border-b flex flex-wrap items-center gap-2 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
              <select
                value={prefs.reciterId}
                onChange={e => setPrefs(p => ({ ...p, reciterId: e.target.value }))}
                className={`${selectCls} flex-1 min-w-0`}
                aria-label="Hâfız"
              >
                {RECITERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <select
                value={prefs.playMode}
                onChange={e => setPrefs(p => ({ ...p, playMode: e.target.value as PlayMode }))}
                className={selectCls}
                aria-label="Dinleme şekli"
              >
                {PLAY_MODES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
              <button
                onClick={() => setPrefs(p => ({ ...p, showMeal: !p.showMeal }))}
                aria-label="Meali göster/gizle"
                aria-pressed={prefs.showMeal}
                className={`p-1.5 rounded-lg cursor-pointer ${prefs.showMeal ? 'bg-emerald-600 text-white' : chip}`}
              >
                <Languages className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPrefs(p => ({ ...p, fontSize: NEXT_SIZE[p.fontSize] }))}
                aria-label="Yazı boyutu"
                className={`p-1.5 rounded-lg cursor-pointer ${chip}`}
              >
                <Type className="w-4 h-4" />
              </button>
            </div>

            {/* Ayahs */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {loading && (
                <div className={`flex flex-col items-center gap-2 py-16 ${muted}`}>
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  <span className="text-xs">Sûre yükleniyor…</span>
                </div>
              )}

              {loadError && (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                  <span className={`text-xs ${muted}`}>
                    Sûre yüklenemedi. İnternet bağlantınızı kontrol edin.<br />
                    Daha önce açtığınız sûreler çevrimdışı da okunabilir.
                  </span>
                  <button
                    onClick={() => loadSurah(selectedSurah)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Tekrar Dene
                  </button>
                </div>
              )}

              {!loading && !loadError && ayahs.length > 0 && (
                <>
                  {hasBesmeleHeading(selectedSurah.id) && (
                    <p className={`font-arabic text-center text-emerald-500 py-2 ${ARABIC_SIZE[prefs.fontSize]}`}>{BESMELE}</p>
                  )}

                  {ayahs.map((a, i) => {
                    const active = i === playingAyahIndex;
                    return (
                      <div
                        key={a.number}
                        id={`ayah-${a.numberInSurah}`}
                        className={`p-4 rounded-2xl border transition-colors ${
                          active ? 'bg-emerald-500/10 border-emerald-500/60' : card
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                              {selectedSurah.id}:{a.numberInSurah}
                            </span>
                            {a.sajda && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
                                Secde ayeti
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => (active ? togglePause() : playAyah(selectedSurah.id, i, prefs.playMode === 'meal' ? 'meal' : 'arabic'))}
                            aria-label={active && isPlaying ? 'Duraklat' : 'Bu ayetten itibaren dinle'}
                            className={`p-1.5 rounded-lg cursor-pointer ${active ? 'bg-emerald-600 text-white' : chip}`}
                          >
                            {active && isBuffering ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : active && isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" />
                                : <Play className="w-3.5 h-3.5 fill-current" />}
                          </button>
                        </div>

                        <p
                          dir="rtl"
                          lang="ar"
                          className={`font-arabic leading-[2.2] text-right select-text ${ARABIC_SIZE[prefs.fontSize]}`}
                        >
                          {ayahText(selectedSurah.id, a)}
                          <span className="text-emerald-500 whitespace-nowrap"> ﴿{toArabicDigits(a.numberInSurah)}﴾</span>
                        </p>

                        {prefs.showMeal && (
                          <p className={`mt-3 pt-3 border-t leading-relaxed select-text ${MEAL_SIZE[prefs.fontSize]} ${
                            isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-200 text-neutral-700'
                          }`}>
                            {a.meal}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <p className={`text-center text-[10px] pt-2 ${muted}`}>Meal: Diyanet İşleri Başkanlığı</p>
                </>
              )}
            </div>
          </>
        )}

        {/* Player bar */}
        {(playback || (selectedSurah && !loading && !loadError && ayahs.length > 0)) && (
          <div className={`p-3 border-t ${isDark ? 'border-neutral-800 bg-neutral-950/60' : 'border-neutral-200 bg-neutral-50'}`}>
            {audioError && (
              <p className="text-[11px] text-amber-500 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Ses yüklenemedi. İnternet bağlantınızı kontrol edin.
              </p>
            )}

            {playback ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePause}
                  aria-label={isPlaying ? 'Duraklat' : 'Devam et'}
                  className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 cursor-pointer"
                >
                  {isBuffering ? <Loader2 className="w-4 h-4 animate-spin" />
                    : isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold block truncate">{nowPlayingLabel}</span>
                  {playback.kind === 'juz' && (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="range"
                        min={0}
                        max={progress.duration || 0}
                        step={1}
                        value={progress.current}
                        onChange={e => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }}
                        className="flex-1 accent-emerald-500"
                        aria-label="Konum"
                      />
                      <span className={`text-[10px] tabular-nums ${muted}`}>
                        {formatTime(progress.current)} / {formatTime(progress.duration)}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={stopAudio}
                  aria-label="Durdur"
                  className={`p-2 rounded-lg cursor-pointer ${chip}`}
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              </div>
            ) : (
              selectedSurah && !surahPlaying && (
                <button
                  onClick={() => playAyah(selectedSurah.id, 0, prefs.playMode === 'meal' ? 'meal' : 'arabic')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> Sûreyi Dinle
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import { AdhanMakam, AdhanMakamInfo } from '../types/prayer';

// Recorded adhans per müezzin and makam (archive.org; streamed on the web, downloaded once on Android).

export type AdhanReaderId = 'cosar' | 'erarabaci';

interface AdhanRecording {
  item: string;     // archive.org item
  file: string;     // file name inside the item
  duration: string;
}

interface AdhanReader {
  id: AdhanReaderId;
  name: string;
  recordings: Partial<Record<AdhanMakam, AdhanRecording>>;
}

export const ADHAN_READERS: AdhanReader[] = [
  {
    id: 'cosar',
    name: 'Merhum İsmail Coşar',
    recordings: {
      saba: { item: 'ezanlar', file: 'sabah_ismail_cosar.mp3', duration: '5:15' },
      rast: { item: 'ezanlardinle', file: 'İSMAİL COŞAR öğle EZANI. ( RAST MAKAMI ) (128kbit).mp3', duration: '4:24' },
      hicaz: { item: 'ezanlardinle', file: 'ismail coşar ikindi ezanı (hicaz makamı) (256kbit).mp3', duration: '5:30' },
      segah: { item: 'ezanlardinle', file: 'ismail coşar akşam ezanı (segah makamı) (128kbit).mp3', duration: '2:50' },
      ussak: { item: 'ezanlardinle', file: 'ismail coşar yatsı ezanı (uşşak makamı) (128kbit).mp3', duration: '3:20' },
    },
  },
  {
    id: 'erarabaci',
    name: 'Mehmet Erarabacı',
    recordings: {
      saba: { item: 'MehmetErarabaciezanlar', file: 'Mehmet Erarabacı - Saba Ezan.mp3', duration: '5:50' },
      rast: { item: 'MehmetErarabaciezanlar', file: 'Mehmet Erarabacı - Rast Ezan.mp3', duration: '4:15' },
      hicaz: { item: 'MehmetErarabaciezanlar', file: 'Mehmet Erarabacı - Hicaz Ezanı.mp3', duration: '4:37' },
      segah: { item: 'MehmetErarabaciezanlar', file: 'Mehmet Erarabacı - Segah Ezan.mp3', duration: '2:24' },
      ussak: { item: 'MehmetErarabaciezanlar', file: 'Mehmet Erarabacı - Uşşak Ezan.mp3', duration: '4:57' },
      mekke: { item: 'MehmetErarabaciezanlar', file: 'Mehmet Erarabacı   Mekke Ezan ı mp4.mp3', duration: '3:40' },
    },
  },
];

export const DEFAULT_ADHAN_READER: AdhanReaderId = 'cosar';
// Has every makam; used when the chosen müezzin has no recording for one.
const FALLBACK_READER: AdhanReaderId = 'erarabaci';

export const isAdhanReader = (v: unknown): v is AdhanReaderId => ADHAN_READERS.some(r => r.id === v);

const readerById = (id: AdhanReaderId) => ADHAN_READERS.find(r => r.id === id) ?? ADHAN_READERS[0];

/** The müezzin and recording that will actually play for this makam. */
export function resolveAdhan(readerId: AdhanReaderId, makam: AdhanMakam) {
  const chosen = readerById(readerId);
  const reader = chosen.recordings[makam] ? chosen : readerById(FALLBACK_READER);
  const rec = reader.recordings[makam]!;
  return {
    reader,
    duration: rec.duration,
    url: `https://archive.org/download/${rec.item}/${encodeURIComponent(rec.file)}`,
    // Stable file name for the Android download cache.
    key: `${reader.id}-${makam}`,
  };
}

export const ADHAN_MAKAMLARI: AdhanMakamInfo[] = [
  { id: 'saba', name: 'Saba Makamı', prayerName: 'Sabah Ezanı', mood: 'Duygusal & Huşû',
    description: 'Hüzünlü, dokunaklı ve uykudan uyandıran derin teslimiyet tınısı.' },
  { id: 'rast', name: 'Rast Makamı', prayerName: 'Öğle Ezanı', mood: 'Canlı & Dingin',
    description: 'Günün yoğunluğunda sefa, berraklık ve iç huzur veren nağmeler.' },
  { id: 'hicaz', name: 'Hicaz Makamı', prayerName: 'İkindi Ezanı', mood: 'Derin & Yanık',
    description: 'Yanık, derin ve kalbi titreten yakarış ve tevazu tınıları.' },
  { id: 'segah', name: 'Segah Makamı', prayerName: 'Akşam Ezanı', mood: 'Akıcı & Teslimiyet',
    description: 'Vaktin kısalığı sebebiyle çevik, tatlı ve huşû dolu bir okuyuş.' },
  { id: 'ussak', name: 'Uşşak Makamı', prayerName: 'Yatsı Ezanı', mood: 'Ağırbaşlı & Dingin',
    description: 'Günün sonunda gece sükûnetine ve tefekküre hazırlayan tını.' },
  { id: 'mekke', name: 'Mekke Ezanı', prayerName: 'Kâbe Üslubu', mood: 'Vakur & Heybetli',
    description: 'Mescid-i Haram üslubunda geniş ve vakur okuyuş.' },
];

export const isAdhanMakam = (v: unknown): v is AdhanMakam =>
  typeof v === 'string' && ADHAN_MAKAMLARI.some(m => m.id === v);

const READER_KEY = 'namaz_adhan_reader';

export function loadAdhanReader(): AdhanReaderId {
  try {
    const saved = localStorage.getItem(READER_KEY);
    return isAdhanReader(saved) ? saved : DEFAULT_ADHAN_READER;
  } catch {
    return DEFAULT_ADHAN_READER;
  }
}

export function saveAdhanReader(reader: AdhanReaderId) {
  try {
    localStorage.setItem(READER_KEY, reader);
  } catch {
    // storage unavailable
  }
}

/** Plays recorded adhans in the page (settings preview, and alerts on the web). */
class AdhanPlayer {
  private audio: HTMLAudioElement | null = null;
  private onEnd: (() => void) | null = null;

  play(url: string, callbacks: { onEnd?: () => void; onError?: () => void } = {}) {
    this.stop();
    const audio = new Audio(url);
    this.audio = audio;
    this.onEnd = callbacks.onEnd ?? null;
    // Ignore events from an element that has since been stopped/replaced.
    const current = () => this.audio === audio;
    audio.addEventListener('ended', () => { if (current()) this.finish(); });
    audio.addEventListener('error', () => { if (current()) { callbacks.onError?.(); this.finish(); } });
    audio.play().catch(err => {
      if (current() && err?.name !== 'AbortError') { callbacks.onError?.(); this.finish(); }
    });
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
    }
    this.finish();
  }

  private finish() {
    this.audio = null;
    const cb = this.onEnd;
    this.onEnd = null;
    cb?.();
  }
}

export const adhanPlayer = new AdhanPlayer();

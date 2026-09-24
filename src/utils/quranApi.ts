// Quran text (Arabic + Diyanet meal) and recitation audio sources.
// Text: api.alquran.cloud — audio: cdn.islamic.network (per ayah) and archive.org (mukabele).

const API_BASE = 'https://api.alquran.cloud/v1';
const AUDIO_CDN = 'https://cdn.islamic.network/quran/audio';
const TEXT_EDITION = 'quran-uthmani';
const MEAL_EDITION = 'tr.diyanet';
const CACHE_NAME = 'quran-text-v1';

export interface Reciter {
  id: string;
  name: string;
  bitrate: number;
}

// Ayah-by-ayah reciters available on the CDN (bitrates verified per edition).
export const RECITERS: Reciter[] = [
  { id: 'ar.husary', name: 'Mahmûd Halîl el-Husarî', bitrate: 128 },
  { id: 'ar.minshawi', name: 'Muhammed Sıddîk el-Minşâvî', bitrate: 128 },
  { id: 'ar.abdulbasitmurattal', name: 'Abdülbâsıt Abdüssamed', bitrate: 192 },
  { id: 'ar.alafasy', name: 'Mishari Rashid el-Afasy', bitrate: 128 },
];

// Turkish meal read aloud (Diyanet Vakfı translation).
const MEAL_AUDIO: Reciter = { id: 'tr.vakfi-audio', name: 'Türkçe Meal (Diyanet Vakfı)', bitrate: 128 };

export function ayahAudioUrl(reciter: Reciter, globalAyahNumber: number) {
  return `${AUDIO_CDN}/${reciter.bitrate}/${reciter.id}/${globalAyahNumber}.mp3`;
}

export function mealAudioUrl(globalAyahNumber: number) {
  return ayahAudioUrl(MEAL_AUDIO, globalAyahNumber);
}

export interface Ayah {
  number: number; // global number 1..6236, used for audio
  numberInSurah: number;
  arabic: string;
  meal: string;
  juz: number;
  sajda: boolean;
}

interface ApiAyah {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  sajda: boolean | object;
}

interface ApiResponse {
  code: number;
  data: { edition: { identifier: string }; ayahs: ApiAyah[] }[];
}

const memoryCache = new Map<number, Ayah[]>();

async function fetchJson(url: string): Promise<ApiResponse> {
  // Cache API keeps read surahs available offline (web and the Android WebView).
  const cache = typeof caches !== 'undefined' ? await caches.open(CACHE_NAME).catch(() => null) : null;
  const cached = cache ? await cache.match(url) : undefined;
  if (cached) return cached.json();

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (cache) await cache.put(url, res.clone()).catch(() => undefined);
  return res.json();
}

export async function fetchSurah(surahNumber: number): Promise<Ayah[]> {
  const hit = memoryCache.get(surahNumber);
  if (hit) return hit;

  const json = await fetchJson(`${API_BASE}/surah/${surahNumber}/editions/${TEXT_EDITION},${MEAL_EDITION}`);
  const arabic = json.data.find(e => e.edition.identifier === TEXT_EDITION);
  const meal = json.data.find(e => e.edition.identifier === MEAL_EDITION);
  if (!arabic || !meal) throw new Error('Eksik veri');

  const ayahs = arabic.ayahs.map((a, i) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    arabic: a.text.replace(/﻿/g, '').trim(),
    meal: meal.ayahs[i]?.text ?? '',
    juz: a.juz,
    sajda: Boolean(a.sajda),
  }));
  memoryCache.set(surahNumber, ayahs);
  return ayahs;
}

// Every surah except Fâtiha and Tevbe opens with the besmele, which the uthmani
// text prefixes to ayah 1 as its first four words (spelling varies slightly, e.g.
// with şedde in some surahs). Split it off so it can be shown as a heading.
export const BESMELE = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

export function hasBesmeleHeading(surahNumber: number) {
  return surahNumber !== 1 && surahNumber !== 9;
}

export function ayahText(surahNumber: number, ayah: Ayah): string {
  if (!hasBesmeleHeading(surahNumber) || ayah.numberInSurah !== 1) return ayah.arabic;
  return ayah.arabic.split(' ').slice(4).join(' ');
}

// --- Mukabele: Bünyamin Topçuoğlu, TRT Diyanet, 30 cüz (archive.org MP3 derivatives) ---

export const MUKABELE_READER = 'Bünyamin Topçuoğlu';

// [surah, ayah] where each cüz starts.
export const JUZ_STARTS: [number, number][] = [
  [1, 1], [2, 142], [2, 253], [3, 93], [4, 24], [4, 148], [5, 82], [6, 111], [7, 88], [8, 41],
  [9, 93], [11, 6], [12, 53], [15, 1], [17, 1], [18, 75], [21, 1], [23, 1], [25, 21], [27, 56],
  [29, 46], [33, 31], [36, 28], [39, 32], [41, 47], [46, 1], [51, 31], [58, 1], [67, 1], [78, 1],
];

export function mukabeleUrl(juz: number) {
  const file = `Mukabele ${String(juz).padStart(2, '0')}.Cüz - TRT DİYANET (256kbit).mp3`;
  return `https://archive.org/download/bunyamintopcuogluhatim/${encodeURIComponent(file)}`;
}

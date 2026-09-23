import React, { useState } from 'react';
import { NextPrayerInfo } from '../utils/prayerTimes';
import { HijriDate } from '../types/prayer';
import { Clock, AlertTriangle, Sparkles } from 'lucide-react';

interface MainClockProps {
  nextInfo: NextPrayerInfo;
  hijriDate: HijriDate;
  gregorianDateStr: string;
  isDark: boolean;
}

export const MainClock: React.FC<MainClockProps> = ({
  nextInfo,
  hijriDate,
  gregorianDateStr,
  isDark,
}) => {
  // Toggle between displaying Next Prayer Time vs Live Current Time
  const [displayMode, setDisplayMode] = useState<'nextPrayer' | 'currentTime'>('nextPrayer');
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayTime = displayMode === 'nextPrayer' ? nextInfo.nextPrayerTime : currentTimeStr;

  return (
    <section className="flex flex-col items-center justify-center pt-2 pb-6 px-4 text-center select-none relative">
      {/* Subtle background radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(0,0,0,0) 70%)' 
            : 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(255,255,255,0) 70%)'
        }}
      />

      {/* Mode Switcher pill (Sonraki Vakit / Canlı Saat) */}
      <div className="flex items-center gap-1.5 mb-1 z-10">
        <button
          onClick={() => setDisplayMode(displayMode === 'nextPrayer' ? 'currentTime' : 'nextPrayer')}
          className={`flex items-center gap-1 text-[11px] font-medium tracking-wide transition-colors cursor-pointer ${
            isDark ? 'text-neutral-400 hover:text-amber-400' : 'text-neutral-500 hover:text-amber-600'
          }`}
          title="Vakit / Gerçek Saat görünümü arasında geçiş yap"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>
            {displayMode === 'nextPrayer' 
              ? `${nextInfo.nextPrayerName} Vakti` 
              : 'Canlı Saat'}
          </span>
          <span className="opacity-40">·</span>
          <span className="underline decoration-dotted">Değiştir</span>
        </button>
      </div>

      {/* Giant Main Display Number - "05:21" as in screenshot */}
      <div 
        onClick={() => setDisplayMode(displayMode === 'nextPrayer' ? 'currentTime' : 'nextPrayer')}
        className="cursor-pointer group flex items-center justify-center my-0 z-10 transition-transform active:scale-95"
      >
        <span 
          className={`text-[94px] sm:text-[116px] font-bold tracking-normal leading-none font-clock drop-shadow-sm transition-colors ${
            isDark 
              ? 'text-white group-hover:text-amber-100' 
              : 'text-neutral-900 group-hover:text-neutral-800'
          }`}
        >
          {displayTime}
        </span>
      </div>

      {/* Live Second-by-Second Countdown - "04:14:06" as in screenshot */}
      <div className="flex flex-col items-center mt-1 mb-4 z-10">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span 
            className={`text-2xl sm:text-3xl font-semibold tracking-wider font-countdown transition-colors ${
              isDark ? 'text-neutral-200' : 'text-neutral-800'
            }`}
          >
            {nextInfo.remainingFormatted}
          </span>
        </div>
        <span className={`text-[11px] mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
          {nextInfo.nextPrayerName} vaktine kalan süre
        </span>
      </div>

      {/* Kerahat Alert if active */}
      {nextInfo.isKerahat && (
        <div className="flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-medium animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Kerahat Vakti (Namaz kılınması mekruhtur)</span>
        </div>
      )}

      {/* Hijri & Gregorian Date Capsule Pill - Matches Screenshot */}
      {/* "24 Eylül 2026   13 Rebi-ül Ahir 1448" with orange stroke */}
      <div 
        className={`z-10 inline-flex items-center justify-center px-4 py-1.5 rounded-full border transition-all ${
          isDark 
            ? 'bg-neutral-900/90 border-[#f26522] shadow-[0_0_12px_rgba(242,101,34,0.18)] text-neutral-100' 
            : 'bg-white border-[#f26522] shadow-[0_2px_10px_rgba(242,101,34,0.15)] text-neutral-900'
        }`}
      >
        <span className="text-xs sm:text-sm font-semibold tracking-wide">
          {gregorianDateStr}
        </span>
        <span className="mx-2 text-neutral-500 font-normal">|</span>
        <span className="text-xs sm:text-sm font-medium tracking-wide text-amber-500 dark:text-amber-400">
          {hijriDate.formatted}
        </span>
      </div>
    </section>
  );
};

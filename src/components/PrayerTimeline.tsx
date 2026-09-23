import React from 'react';
import { PrayerTimes, PrayerName } from '../types/prayer';
import { NextPrayerInfo } from '../utils/prayerTimes';

interface PrayerTimelineProps {
  times: PrayerTimes;
  nextInfo: NextPrayerInfo;
  isDark: boolean;
  onSelectPrayer: (prayer: PrayerName) => void;
}

export const PrayerTimeline: React.FC<PrayerTimelineProps> = ({
  times,
  nextInfo,
  isDark,
  onSelectPrayer,
}) => {
  const prayerList = [
    { id: 'imsak' as PrayerName, name: 'İmsak', time: times.imsak },
    { id: 'sabah' as unknown as PrayerName, name: 'Sabah', time: times.sabah },
    { id: 'gunes' as PrayerName, name: 'Güneş', time: times.gunes },
    { id: 'ogle' as PrayerName, name: 'Öğle', time: times.ogle },
    { id: 'ikindi' as PrayerName, name: 'İkindi', time: times.ikindi },
    { id: 'aksam' as PrayerName, name: 'Akşam', time: times.aksam },
    { id: 'yatsi' as PrayerName, name: 'Yatsı', time: times.yatsi },
  ];

  return (
    <div className="w-full px-3 mb-4">
      {/* Container - Pixel-perfect match to user's uploaded resim.png */}
      <div 
        className="w-full rounded-2xl py-2 px-1 relative overflow-hidden transition-all border border-[#26282e]/80"
        style={{
          backgroundColor: isDark ? '#14161a' : '#ffffff',
          boxShadow: isDark 
            ? '0 8px 24px -4px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)' 
            : '0 4px 16px rgba(0,0,0,0.08)'
        }}
      >
        {/* Top ambient orange glow and beam matching resim.png */}
        <div 
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-4/5 h-14 rounded-full pointer-events-none opacity-90 blur-md"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.6) 0%, rgba(234, 88, 12, 0.25) 50%, transparent 80%)'
          }}
        />
        <div 
          className="absolute top-0 left-8 right-8 h-[1.5px] rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #ea580c 20%, #f97316 50%, #ea580c 80%, transparent 100%)',
            boxShadow: '0 0 12px #f97316'
          }}
        />

        {/* 7 Columns prayer times grid */}
        <div className="grid grid-cols-7 gap-0.5 text-center items-center relative z-10">
          {prayerList.map((item) => {
            const isNext = nextInfo.nextPrayer === item.id;
            const isCurrent = nextInfo.currentPrayer === item.id;
            // Highlight next prayer (and/or yatsı as shown in resim.png template)
            const isHighlighted = isNext || (item.id === 'yatsi' && isCurrent);

            return (
              <button
                key={item.name}
                onClick={() => onSelectPrayer(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer group focus:outline-none ${
                  isHighlighted 
                    ? 'bg-[#29190e] border border-[#f97316]/30 shadow-inner' 
                    : 'hover:bg-neutral-800/30'
                }`}
                title={`${item.name}: ${item.time} (Ayarları aç)`}
              >
                {/* Prayer Name */}
                <span 
                  className={`text-[12px] sm:text-[13px] tracking-tight leading-tight transition-colors ${
                    isHighlighted 
                      ? 'text-[#f97316] font-bold' 
                      : isDark ? 'text-neutral-200' : 'text-neutral-700'
                  }`}
                >
                  {item.name}
                </span>

                {/* Prayer Time */}
                <span 
                  className={`text-[13px] sm:text-[14px] tabular-nums mt-1 font-mono tracking-tight leading-none transition-colors ${
                    isHighlighted 
                      ? 'text-[#f97316] font-bold' 
                      : isDark ? 'text-white font-bold' : 'text-neutral-950 font-bold'
                  }`}
                >
                  {item.time}
                </span>

                {/* Orange Indicator Dot below time - shown on active prayer as in resim.png */}
                <div className="h-2 flex items-center justify-center mt-1">
                  {isHighlighted ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_6px_#f97316]" />
                  ) : (
                    <span className="w-1.5 h-1.5 opacity-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

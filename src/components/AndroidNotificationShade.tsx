import React from 'react';
import { CityData, PrayerTimes, PrayerName } from '../types/prayer';
import { NextPrayerInfo } from '../utils/prayerTimes';
import { ChevronUp, Bell, BellRing, Settings2, Sparkles, Check, RefreshCw } from 'lucide-react';

interface AndroidNotificationShadeProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityData;
  times: PrayerTimes;
  nextInfo: NextPrayerInfo;
  isOngoingEnabled: boolean;
  onToggleOngoing: (enabled: boolean) => void;
  onTriggerRealNotification: () => void;
}

export const AndroidNotificationShade: React.FC<AndroidNotificationShadeProps> = ({
  isOpen,
  onClose,
  city,
  times,
  nextInfo,
  isOngoingEnabled,
  onToggleOngoing,
  onTriggerRealNotification
}) => {
  if (!isOpen) return null;

  const prayerList = [
    { id: 'imsak' as PrayerName, name: 'İmsak', time: times.imsak },
    { id: 'sabah' as unknown as PrayerName, name: 'Sabah', time: times.sabah },
    { id: 'gunes' as PrayerName, name: 'Güneş', time: times.gunes },
    { id: 'ogle' as PrayerName, name: 'Öğle', time: times.ogle },
    { id: 'ikindi' as PrayerName, name: 'İkindi', time: times.ikindi },
    { id: 'aksam' as PrayerName, name: 'Akşam', time: times.aksam },
    { id: 'yatsi' as PrayerName, name: 'Yatsı', time: times.yatsi },
  ];

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start bg-black/85 backdrop-blur-md animate-in slide-in-from-top-full duration-300">
      {/* Android Status Bar Header */}
      <div className="w-full max-w-[450px] mx-auto bg-[#0a0d12] border-b border-neutral-800 text-neutral-100 flex flex-col shadow-2xl rounded-b-3xl overflow-hidden max-h-[92vh]">
        {/* Top bar info */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800/60">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{timeStr}</span>
            <span className="text-[11px] text-neutral-400">Android Bildirim Paneli</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="text-[11px] text-emerald-400 font-medium">Sabit Çubuk</span>
          </div>
        </div>

        {/* Setting switch bar */}
        <div className="px-4 py-2.5 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-white block">Üst Menü Sabit Bildirimi</span>
              <span className="text-[10px] text-neutral-400">Üst menüden kaydırınca her zaman ilk sırada görünür</span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isOngoingEnabled}
              onChange={(e) => onToggleOngoing(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Scrollable Notifications Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* #1 PINNED NOTIFICATION - ALWAYS AT THE VERY TOP */}
          <div className="rounded-2xl bg-[#14161a] border border-amber-500/40 p-3 shadow-xl relative overflow-hidden transition-all">
            {/* Pinned / Ongoing badge at top */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-bold">
                  🕌
                </span>
                <span className="text-xs font-bold text-amber-400">Namaz Vakti & Ezan</span>
                <span className="text-[10px] text-neutral-400">· Sabit Bildirim</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                EN ÜSTTE SABİT
              </span>
            </div>

            {/* City & Next Prayer Summary */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div>
                <span className="text-sm font-bold text-white">{city.name}</span>
                <p className="text-[11px] text-amber-400 font-medium">
                  {nextInfo.nextPrayerName} vaktine <span className="font-mono font-bold">{nextInfo.remainingFormatted}</span> kaldı
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">Sonraki Vakit</span>
                <span className="text-sm font-bold font-mono text-white">{nextInfo.nextPrayerTime}</span>
              </div>
            </div>

            {/* Mini Horizontal Prayer Ribbon - Matches User's resim.png */}
            <div 
              className="w-full rounded-xl py-2 px-1 relative overflow-hidden border border-[#27292f] bg-[#0c0e12]"
            >
              {/* Top ambient orange glow beam identical to resim.png */}
              <div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-4/5 h-10 rounded-full pointer-events-none opacity-80 blur-md"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.6) 0%, rgba(234, 88, 12, 0.25) 50%, transparent 80%)'
                }}
              />

              <div className="grid grid-cols-7 gap-0.5 text-center items-center relative z-10">
                {prayerList.map((item) => {
                  const isNext = nextInfo.nextPrayer === item.id;
                  const isCurrent = nextInfo.currentPrayer === item.id;
                  const isHighlighted = isNext || (item.id === 'yatsi' && isCurrent);

                  return (
                    <div
                      key={item.name}
                      className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all ${
                        isHighlighted 
                          ? 'bg-[#29190e] border border-[#f97316]/30' 
                          : ''
                      }`}
                    >
                      <span 
                        className={`text-[11px] tracking-tight leading-none ${
                          isHighlighted ? 'text-[#f97316] font-bold' : 'text-neutral-300'
                        }`}
                      >
                        {item.name}
                      </span>

                      <span 
                        className={`text-[11px] sm:text-[12px] tabular-nums mt-1 font-mono tracking-tight leading-none ${
                          isHighlighted ? 'text-[#f97316] font-bold' : 'text-white font-medium'
                        }`}
                      >
                        {item.time}
                      </span>

                      <div className="h-1.5 flex items-center justify-center mt-0.5">
                        {isHighlighted ? (
                          <span className="w-1 h-1 rounded-full bg-[#f97316]" />
                        ) : (
                          <span className="w-1 h-1 opacity-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Buttons on notification */}
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-800/80 text-[11px]">
              <button
                onClick={onTriggerRealNotification}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Bildirimi Güncelle / Bildirim Çubuğuna Gönder</span>
              </button>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white"
              >
                Tam Ekrana Dön
              </button>
            </div>
          </div>

          {/* Dummy 2nd notification to demonstrate that Prayer times stay at #1 */}
          <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3 opacity-50">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
              <span>Android Sistemi</span>
              <span>· 25 dk önce</span>
            </div>
            <p className="text-xs text-neutral-300">
              Diğer bildirimler her zaman ezan vakitlerinin altında sıralanır.
            </p>
          </div>
        </div>

        {/* Pull-up / Close Handle */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-neutral-900 border-t border-neutral-800 flex flex-col items-center justify-center text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <div className="w-10 h-1 bg-neutral-700 rounded-full mb-1" />
          <div className="flex items-center gap-1">
            <ChevronUp className="w-4 h-4" />
            <span>Paneli Kapat (Yukarı Kaydır)</span>
          </div>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CityData, PrayerTimes, PrayerName } from '../types/prayer';
import { NextPrayerInfo } from '../utils/prayerTimes';
import { X, Smartphone, Clock, Sparkles, ExternalLink, Maximize2 } from 'lucide-react';

interface WidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityData;
  times: PrayerTimes;
  nextInfo: NextPrayerInfo;
  isDark: boolean;
}

export const WidgetModal: React.FC<WidgetModalProps> = ({
  isOpen,
  onClose,
  city,
  times,
  nextInfo,
  isDark
}) => {
  const [isLiveWidgetFullscreen, setIsLiveWidgetFullscreen] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-xl rounded-3xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl border transition-all ${
          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold">Ana Ekran Widget Tasarımı</h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {city.name} — Canlı Vakit Şeridi
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Main Widget Card Preview - Exactly Matching User's resim.png */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-400 font-medium">
                Gönderdiğiniz Şablon Widget Görünümü:
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Canlı Zamanlı
              </span>
            </div>

            {/* Android Home Screen Simulated Canvas */}
            <div className="w-full rounded-2xl bg-[#090b0e] p-4 sm:p-6 border border-neutral-800/80 relative overflow-hidden shadow-2xl">
              {/* Wallpaper soft glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/10 via-neutral-950 to-neutral-950 pointer-events-none" />

              {/* The Exact Horizontal Widget Container */}
              <div 
                className="relative z-10 w-full rounded-2xl py-3 px-2 transition-all border border-[#27292f]"
                style={{
                  backgroundColor: '#14161a',
                  boxShadow: '0 10px 30px -5px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)'
                }}
              >
                {/* Top ambient orange glow beam identical to resim.png */}
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
                <div className="grid grid-cols-7 gap-1 text-center items-center relative z-10">
                  {prayerList.map((item) => {
                    const isNext = nextInfo.nextPrayer === item.id;
                    const isCurrent = nextInfo.currentPrayer === item.id;
                    const isHighlighted = isNext || (item.id === 'yatsi' && isCurrent);

                    return (
                      <div
                        key={item.name}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                          isHighlighted 
                            ? 'bg-[#29190e] border border-[#f97316]/30 shadow-inner' 
                            : ''
                        }`}
                      >
                        {/* Prayer Name */}
                        <span 
                          className={`text-[12px] sm:text-[13px] tracking-tight leading-tight ${
                            isHighlighted ? 'text-[#f97316] font-bold' : 'text-neutral-200'
                          }`}
                        >
                          {item.name}
                        </span>

                        {/* Prayer Time */}
                        <span 
                          className={`text-[13px] sm:text-[14px] tabular-nums mt-1 font-mono tracking-tight leading-none ${
                            isHighlighted ? 'text-[#f97316] font-bold' : 'text-white font-bold'
                          }`}
                        >
                          {item.time}
                        </span>

                        {/* Orange Dot Indicator */}
                        <div className="h-2 flex items-center justify-center mt-1">
                          {isHighlighted ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_6px_#f97316]" />
                          ) : (
                            <span className="w-1.5 h-1.5 opacity-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Explanation on How Android Handles this Widget */}
          <div className={`p-4 rounded-2xl border text-xs space-y-3 ${
            isDark ? 'bg-neutral-950/40 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
          }`}>
            <div className="flex items-center gap-1.5 font-bold text-amber-500">
              <Sparkles className="w-4 h-4" />
              <span>Android Ana Ekranda Nasıl Kullanılır?</span>
            </div>
            
            <p className="leading-relaxed">
              Android işletim sisteminde web tabanlı uygulamaların ana ekranda çalışması şu 3 pratik yolla sağlanır:
            </p>

            <ul className="space-y-2 text-neutral-400 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">1.</span>
                <span>
                  <strong>Ana Ekrana Ekleme (WebAPK):</strong> Telefonunuzda Google Chrome veya Samsung Internet menüsünden (<strong>⋮</strong>) <em>"Ana ekrana ekle"</em> seçtiğinizde telefonunuza yerleşir ve tek dokunuşla açılır.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">2.</span>
                <span>
                  <strong>Pop-up / Kayan Pencere Modu:</strong> Android'de Son Uygulamalar ekranından simgeye basıp <em>"Açılır pencere görünümünde aç"</em> (Pop-up view) seçtiğinizde bu şerit widget ana ekranınızın üzerinde dilediğiniz köşede minik bir çubuk olarak canlı kalabilir.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">3.</span>
                <span>
                  <strong>Masa Saati / Always-On:</strong> Telefonunuz masada veya şarjdayken sürekli açık kalarak vakitleri ve sıradaki ezana kalan süreyi otomatik günceller.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

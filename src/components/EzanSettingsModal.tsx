import React, { useState } from 'react';
import { AdhanMakam, PrayerName, PrayerNotificationConfig } from '../types/prayer';
import { ADHAN_MAKAMLARI, adhanEngine } from '../utils/audioSynthesizer';
import { X, Volume2, Bell, Play, Square, Check, Music, Sliders } from 'lucide-react';

interface EzanSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const EzanSettingsModal: React.FC<EzanSettingsModalProps> = ({
  isOpen,
  onClose,
  isDark
}) => {
  const [playingMakam, setPlayingMakam] = useState<AdhanMakam | null>(null);

  // Default notification configs for all prayers
  const [notifications, setNotifications] = useState<Record<PrayerName, PrayerNotificationConfig>>(() => {
    const saved = localStorage.getItem('namaz_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      imsak: { prayer: 'imsak', enabled: true, minutesBefore: 30, makam: 'saba', soundEnabled: true, vibrateEnabled: true },
      gunes: { prayer: 'gunes', enabled: false, minutesBefore: 15, makam: 'bip', soundEnabled: false, vibrateEnabled: false },
      ogle: { prayer: 'ogle', enabled: true, minutesBefore: 0, makam: 'rast', soundEnabled: true, vibrateEnabled: true },
      ikindi: { prayer: 'ikindi', enabled: true, minutesBefore: 0, makam: 'hicaz', soundEnabled: true, vibrateEnabled: true },
      aksam: { prayer: 'aksam', enabled: true, minutesBefore: 0, makam: 'segah', soundEnabled: true, vibrateEnabled: true },
      yatsi: { prayer: 'yatsi', enabled: true, minutesBefore: 15, makam: 'ussak', soundEnabled: true, vibrateEnabled: true },
    };
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    return typeof Notification !== 'undefined' ? Notification.permission : 'default';
  });

  const handlePlayToggle = (makam: AdhanMakam) => {
    if (playingMakam === makam) {
      adhanEngine.stop();
      setPlayingMakam(null);
    } else {
      adhanEngine.stop();
      setPlayingMakam(makam);
      adhanEngine.playMakam(makam, () => {
        setPlayingMakam(null);
      });
    }
  };

  const handleClose = () => {
    adhanEngine.stop();
    setPlayingMakam(null);
    localStorage.setItem('namaz_notifications', JSON.stringify(notifications));
    onClose();
  };

  const updatePrayerConfig = (prayer: PrayerName, updates: Partial<PrayerNotificationConfig>) => {
    setNotifications(prev => ({
      ...prev,
      [prayer]: { ...prev[prayer], ...updates }
    }));
  };

  const requestPermission = async () => {
    if (typeof Notification !== 'undefined') {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        new Notification('Namaz Vakti & Ezan Pro', {
          body: 'Ezan ve vakit hatırlatıcı bildirimler başarıyla etkinleştirildi.',
          icon: '/pwa-192x192.png'
        });
      }
    }
  };

  if (!isOpen) return null;

  const prayerLabels: { id: PrayerName; title: string; defaultMakam: string }[] = [
    { id: 'imsak', title: 'İmsak / Sabah', defaultMakam: 'Saba Makamı' },
    { id: 'gunes', title: 'Güneş Doğuşu', defaultMakam: 'Kısa Uyarı' },
    { id: 'ogle', title: 'Öğle Namazı', defaultMakam: 'Rast Makamı' },
    { id: 'ikindi', title: 'İkindi Namazı', defaultMakam: 'Hicaz Makamı' },
    { id: 'aksam', title: 'Akşam (İftar)', defaultMakam: 'Segah Makamı' },
    { id: 'yatsi', title: 'Yatsı Namazı', defaultMakam: 'Uşşak Makamı' },
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
            <Volume2 className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold">Ezan Makamları & Bildirimler</h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Özelleştirilebilir Ezan Tınıları & Hatırlatıcılar
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Notification Permission Banner */}
          {notificationPermission !== 'granted' && (
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
              isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-xs text-amber-500 block">
                    Vakit Bildirimleri
                  </span>
                  <span className={`text-[11px] ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    Namaz vakitlerinde ezan sesi ve hatırlatıcı alabilmek için izin verin.
                  </span>
                </div>
              </div>

              <button
                onClick={requestPermission}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs whitespace-nowrap cursor-pointer shadow-sm"
              >
                İzin Ver
              </button>
            </div>
          )}

          {/* SECTION 1: EZAN MAKAMLARI (AUDIO PREVIEW) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Music className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-500">
                Geleneksel Türk Ezan Makamları
              </h3>
            </div>
            <p className={`text-xs mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Osmanlı'dan günümüze her vakit ezanı, günün ruhuna uygun farklı bir makamda okunur. Dinlemek için oynatın:
            </p>

            <div className="space-y-2">
              {ADHAN_MAKAMLARI.map((makam) => {
                const isThisPlaying = playingMakam === makam.id;

                return (
                  <div
                    key={makam.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isThisPlaying
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : isDark
                          ? 'bg-neutral-950/40 border-neutral-800'
                          : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-amber-400">{makam.name}</span>
                        <span className="text-[10px] text-neutral-400 font-medium">({makam.prayerName})</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                          {makam.mood}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 line-clamp-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {makam.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlayToggle(makam.id)}
                      className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isThisPlaying
                          ? 'bg-amber-500 text-neutral-950 shadow-md animate-pulse'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-amber-400'
                      }`}
                      title={isThisPlaying ? 'Durdur' : 'Ön Dinleme'}
                    >
                      {isThisPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: VAKİT BİLDİRİM & HATIRLATMA AYARLARI */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-500">
                Yaklaşan Vakit Bildirimleri
              </h3>
            </div>
            <p className={`text-xs mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Her vakit için kaç dakika önce haber verileceğini ve atanacak makamı seçebilirsiniz:
            </p>

            <div className="space-y-2.5">
              {prayerLabels.map((p) => {
                const cfg = notifications[p.id];

                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      cfg.enabled 
                        ? isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-white border-neutral-200' 
                        : 'opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={cfg.enabled}
                          onChange={(e) => updatePrayerConfig(p.id, { enabled: e.target.checked })}
                          className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                          id={`notify-${p.id}`}
                        />
                        <label htmlFor={`notify-${p.id}`} className="font-bold text-xs cursor-pointer">
                          {p.title}
                        </label>
                      </div>

                      {/* Time Offset Selector */}
                      <select
                        value={cfg.minutesBefore}
                        disabled={!cfg.enabled}
                        onChange={(e) => updatePrayerConfig(p.id, { minutesBefore: Number(e.target.value) })}
                        className={`text-[11px] px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                          isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-100 border-neutral-300 text-neutral-900'
                        }`}
                      >
                        <option value={0}>Tam Vaktinde</option>
                        <option value={15}>15 Dk Önce</option>
                        <option value={30}>30 Dk Önce</option>
                        <option value={45}>45 Dk Önce</option>
                      </select>
                    </div>

                    {/* Makam Selector per prayer */}
                    <div className="flex items-center justify-between pt-2 border-t border-inherit/40 text-[11px]">
                      <span className="text-neutral-400">Çalınacak Makam:</span>
                      <select
                        value={cfg.makam}
                        disabled={!cfg.enabled}
                        onChange={(e) => updatePrayerConfig(p.id, { makam: e.target.value as AdhanMakam })}
                        className={`text-[11px] px-2 py-0.5 rounded-lg border cursor-pointer focus:outline-none ${
                          isDark ? 'bg-neutral-900 border-neutral-700 text-amber-400' : 'bg-neutral-100 border-neutral-300 text-amber-600'
                        }`}
                      >
                        {ADHAN_MAKAMLARI.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Ayarları Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

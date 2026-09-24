import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdhanMakam, CityData, PrayerName, PrayerNotificationConfig } from '../types/prayer';
import { ADHAN_MAKAMLARI, ADHAN_READERS, AdhanReaderId, adhanPlayer, resolveAdhan } from '../utils/adhan';
import {
  AdhanDownloadStatus,
  DEFAULT_NOTIFICATION_SETTINGS,
  MINUTES_BEFORE_OPTIONS,
  NotificationSettings,
  PermissionState,
  checkExactAlarmPermission,
  checkNotificationPermission,
  downloadAdhans,
  getAdhanDownloadStatus,
  makamsInUse,
  openExactAlarmSettings,
  requestNotificationPermission,
  sendTestAdhan,
} from '../utils/prayerNotifications';
import {
  X, Volume2, Bell, BellOff, Play, Square, Music, Settings, Moon, Sun, MapPin, Mic,
  ChevronRight, Vibrate, RotateCcw, Send, Pin, AlarmClock, Loader2, Download, CheckCircle2, AlertCircle
} from 'lucide-react';

interface EzanSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  city: CityData;
  onOpenCityPicker: () => void;
  isOngoingEnabled: boolean;
  onToggleOngoing: (enabled: boolean) => void;
  settings: NotificationSettings;
  onChangeSettings: (settings: NotificationSettings) => void;
  focusPrayer?: PrayerName | null;
  adhanReader: AdhanReaderId;
  onChangeAdhanReader: (reader: AdhanReaderId) => void;
}

const PRAYER_ROWS: { id: PrayerName; title: string }[] = [
  { id: 'imsak', title: 'İmsak / Sabah' },
  { id: 'gunes', title: 'Güneş Doğuşu' },
  { id: 'ogle', title: 'Öğle Namazı' },
  { id: 'ikindi', title: 'İkindi Namazı' },
  { id: 'aksam', title: 'Akşam (İftar)' },
  { id: 'yatsi', title: 'Yatsı Namazı' },
];

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; label: string }> = ({
  checked, onChange, disabled, label
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
      checked ? 'bg-amber-500' : 'bg-neutral-500/40'
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-4' : ''
      }`}
    />
  </button>
);

export const EzanSettingsModal: React.FC<EzanSettingsModalProps> = ({
  isOpen,
  onClose,
  isDark,
  onToggleTheme,
  city,
  onOpenCityPicker,
  isOngoingEnabled,
  onToggleOngoing,
  settings,
  onChangeSettings,
  focusPrayer,
  adhanReader,
  onChangeAdhanReader
}) => {
  const [playingMakam, setPlayingMakam] = useState<AdhanMakam | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [permission, setPermission] = useState<PermissionState>('default');
  const [exactAlarm, setExactAlarm] = useState<PermissionState>('unsupported');
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [downloads, setDownloads] = useState<AdhanDownloadStatus>({});
  const [downloading, setDownloading] = useState(false);

  const isNative = Capacitor.isNativePlatform();
  const neededMakams = makamsInUse(settings);
  const missingMakams = neededMakams.filter(m => !downloads[m]);

  // Refresh permission state and stop any preview whenever the modal opens/closes
  // (it can also be closed externally, e.g. when the app is backgrounded).
  useEffect(() => {
    if (isOpen) {
      checkNotificationPermission().then(setPermission).catch(() => setPermission('unsupported'));
      checkExactAlarmPermission().then(setExactAlarm).catch(() => setExactAlarm('unsupported'));
    } else {
      adhanPlayer.stop();
      setPlayingMakam(null);
      setPreviewError(false);
      setTestMessage(null);
    }
  }, [isOpen]);

  // Which recordings are already on the phone (Android downloads them for offline, app-closed playback).
  const neededKey = `${adhanReader}:${neededMakams.join(',')}`;
  useEffect(() => {
    if (!isOpen || !isNative) return;
    getAdhanDownloadStatus(neededMakams, adhanReader).then(setDownloads).catch(() => setDownloads({}));
  }, [isOpen, isNative, neededKey]);

  useEffect(() => {
    if (isOpen && focusPrayer) {
      document.getElementById(`notify-row-${focusPrayer}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen, focusPrayer]);

  if (!isOpen) return null;

  const handlePlayToggle = (makam: AdhanMakam) => {
    setPreviewError(false);
    if (playingMakam === makam) {
      adhanPlayer.stop();
      setPlayingMakam(null);
      return;
    }
    adhanPlayer.play(resolveAdhan(adhanReader, makam).url, {
      onEnd: () => setPlayingMakam(current => (current === makam ? null : current)),
      onError: () => setPreviewError(true),
    });
    setPlayingMakam(makam);
  };

  const handleRetryDownload = async () => {
    setDownloading(true);
    try {
      const result = await downloadAdhans(neededMakams, adhanReader);
      setDownloads(prev => ({ ...prev, ...result }));
    } catch {
      // status stays "missing"
    } finally {
      setDownloading(false);
    }
  };

  const updatePrayerConfig = (prayer: PrayerName, updates: Partial<PrayerNotificationConfig>) => {
    onChangeSettings({ ...settings, [prayer]: { ...settings[prayer], ...updates } });
  };

  const handleRequestPermission = async () => {
    try {
      setPermission(await requestNotificationPermission());
    } catch {
      setPermission('unsupported');
    }
  };

  const handleOpenExactAlarm = async () => {
    try {
      setExactAlarm(await openExactAlarmSettings());
    } catch (err) {
      console.debug('Exact alarm settings error:', err);
    }
  };

  const handleTest = async () => {
    const makam = neededMakams[0] ?? 'rast';
    setTestMessage(isNative ? 'Ezan sesi hazırlanıyor…' : null);
    try {
      const { delaySeconds, downloaded } = await sendTestAdhan(makam, adhanReader);
      if (isNative) {
        setDownloads(prev => ({ ...prev, [makam]: downloaded }));
        setTestMessage(downloaded
          ? `${delaySeconds} saniye içinde ezan okunacak. Uygulamayı kapatıp deneyebilirsiniz.`
          : 'Ezan sesi indirilemedi; test bildirimi normal bildirim sesiyle gelecek.');
      } else {
        setPlayingMakam(null);
        setTestMessage('Test bildirimi gönderildi.');
      }
    } catch (err) {
      console.debug('Test adhan error:', err);
      setTestMessage('Test başlatılamadı.');
    }
  };

  const handleReset = () => {
    if (confirm('Bildirim ayarları varsayılan değerlere dönsün mü?')) {
      onChangeSettings(DEFAULT_NOTIFICATION_SETTINGS);
    }
  };

  const muted = isDark ? 'text-neutral-400' : 'text-neutral-500';
  const card = isDark ? 'bg-neutral-950/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200';
  const selectCls = `text-[11px] px-2 py-1 rounded-lg border cursor-pointer focus:outline-none disabled:opacity-50 ${
    isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
  }`;
  const iconBtn = isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-amber-400' : 'bg-neutral-200 hover:bg-neutral-300 text-amber-600';

  const SectionTitle: React.FC<{ icon: React.ElementType; children: React.ReactNode }> = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-amber-500" />
      <h3 className="font-bold text-xs uppercase tracking-wider text-amber-500">{children}</h3>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl rounded-3xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl border transition-all ${
          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold">Ayarlar</h2>
              <p className={`text-xs ${muted}`}>Değişiklikler otomatik kaydedilir</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* SECTION: GENEL */}
          <section>
            <SectionTitle icon={Settings}>Genel</SectionTitle>
            <div className={`rounded-2xl border divide-y ${card} ${isDark ? 'divide-neutral-800' : 'divide-neutral-200'}`}>
              <button
                onClick={onOpenCityPicker}
                className="w-full p-3 flex items-center gap-3 text-left cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-xs block">Konum</span>
                  <span className={`text-[11px] truncate block ${muted}`}>{city.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${muted}`} />
              </button>

              <div className="p-3 flex items-center gap-3">
                {isDark ? <Moon className="w-4 h-4 text-amber-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <div className="flex-1">
                  <span className="font-bold text-xs block">Koyu Tema</span>
                  <span className={`text-[11px] ${muted}`}>AMOLED dostu karanlık görünüm</span>
                </div>
                <Toggle checked={isDark} onChange={onToggleTheme} label="Koyu tema" />
              </div>

              <div className="p-3 flex items-center gap-3">
                <Pin className="w-4 h-4 text-amber-500" />
                <div className="flex-1">
                  <span className="font-bold text-xs block">Kalıcı Vakit Bildirimi</span>
                  <span className={`text-[11px] ${muted}`}>Bildirim panelinde günün vakitlerini göster</span>
                </div>
                <Toggle checked={isOngoingEnabled} onChange={onToggleOngoing} label="Kalıcı vakit bildirimi" />
              </div>
            </div>
          </section>

          {/* SECTION: VAKİT BİLDİRİMLERİ */}
          <section>
            <SectionTitle icon={Bell}>Vakit Bildirimleri</SectionTitle>

            {permission !== 'granted' && (
              <div className={`p-3.5 mb-3 rounded-2xl border flex items-center justify-between gap-3 ${
                isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <BellOff className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className={`text-[11px] ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {permission === 'unsupported'
                      ? 'Bu tarayıcı bildirimleri desteklemiyor. Ezan sesi yalnızca uygulama açıkken çalar.'
                      : permission === 'denied'
                        ? 'Bildirim izni reddedildi. Cihaz ayarlarından uygulamaya bildirim izni verin.'
                        : 'Vakit hatırlatmalarını alabilmek için bildirim izni verin.'}
                  </span>
                </div>
                {permission === 'default' && (
                  <button
                    onClick={handleRequestPermission}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    İzin Ver
                  </button>
                )}
              </div>
            )}

            {permission === 'granted' && exactAlarm === 'denied' && (
              <div className={`p-3.5 mb-3 rounded-2xl border flex items-center justify-between gap-3 ${
                isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <AlarmClock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className={`text-[11px] ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    Bildirimler birkaç dakika gecikebilir. Tam vaktinde gelmesi için "Alarmlar ve hatırlatıcılar" iznini açın.
                  </span>
                </div>
                <button
                  onClick={handleOpenExactAlarm}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs whitespace-nowrap cursor-pointer shadow-sm"
                >
                  İzni Aç
                </button>
              </div>
            )}

            <div className="space-y-2.5">
              {PRAYER_ROWS.map((p) => {
                const cfg = settings[p.id];
                const isFocused = focusPrayer === p.id;

                return (
                  <div
                    key={p.id}
                    id={`notify-row-${p.id}`}
                    className={`p-3 rounded-2xl border transition-all ${
                      isFocused ? 'border-amber-500/60' : ''
                    } ${cfg.enabled ? card : `${card} opacity-60`}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs">{p.title}</span>
                      <Toggle
                        checked={cfg.enabled}
                        onChange={(v) => updatePrayerConfig(p.id, { enabled: v })}
                        label={`${p.title} bildirimi`}
                      />
                    </div>

                    {cfg.enabled && (
                      <div className={`mt-2.5 pt-2.5 border-t space-y-2 text-[11px] ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                        {p.id === 'gunes' ? (
                          <p className={muted}>Güneş vaktinde ezan okunmaz; güneş doğduğunda bildirim gelir.</p>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <span className={`flex items-center gap-1.5 ${muted}`}>
                              <Volume2 className="w-3.5 h-3.5" /> Vakitte ezan okunsun
                            </span>
                            <Toggle
                              checked={cfg.soundEnabled}
                              onChange={(v) => updatePrayerConfig(p.id, { soundEnabled: v })}
                              label={`${p.title} ezan sesi`}
                            />
                          </div>
                        )}

                        {p.id !== 'gunes' && (
                        <div className="flex items-center justify-between gap-2">
                          <span className={muted}>Ezan makamı</span>
                          <div className="flex items-center gap-1.5">
                            <select
                              value={cfg.makam}
                              disabled={!cfg.soundEnabled}
                              onChange={(e) => updatePrayerConfig(p.id, { makam: e.target.value as AdhanMakam })}
                              className={selectCls}
                            >
                              {ADHAN_MAKAMLARI.map((m) => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handlePlayToggle(cfg.makam)}
                              disabled={!cfg.soundEnabled}
                              aria-label={playingMakam === cfg.makam ? 'Durdur' : 'Dinle'}
                              className={`p-1.5 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                playingMakam === cfg.makam ? 'bg-amber-500 text-neutral-950' : iconBtn
                              }`}
                            >
                              {playingMakam === cfg.makam
                                ? <Square className="w-3.5 h-3.5 fill-current" />
                                : <Play className="w-3.5 h-3.5 fill-current" />}
                            </button>
                          </div>
                        </div>
                        )}

                        <div className="flex items-center justify-between gap-2">
                          <span className={muted}>Önceden hatırlat</span>
                          <select
                            value={cfg.minutesBefore}
                            onChange={(e) => updatePrayerConfig(p.id, { minutesBefore: Number(e.target.value) })}
                            className={selectCls}
                          >
                            {MINUTES_BEFORE_OPTIONS.map(m => (
                              <option key={m} value={m}>{m === 0 ? 'Hatırlatma yok' : `${m} dk önce`}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className={`flex items-center gap-1.5 ${muted}`}>
                            <Vibrate className="w-3.5 h-3.5" /> Titreşim
                          </span>
                          <Toggle
                            checked={cfg.vibrateEnabled}
                            onChange={(v) => updatePrayerConfig(p.id, { vibrateEnabled: v })}
                            label={`${p.title} titreşim`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className={`text-[10px] mt-2 ${muted}`}>
              {isNative
                ? 'Ezan, vakit girdiğinde uygulama kapalıyken de okunur ve bildirimdeki "Durdur" ile susturulabilir. Telefon sessizde veya Rahatsız Etme açıkken ezan okunmaz, yalnızca bildirim gelir.'
                : 'Tarayıcıda ezan yalnızca bu sayfa açıkken okunur. Uygulama kapalıyken de okunması için Android uygulamasını kurun.'}
            </p>

            {isNative && neededMakams.length > 0 && (
              <div className={`mt-2 p-2.5 rounded-xl border flex items-center gap-2 text-[11px] ${card}`}>
                {downloading ? (
                  <><Loader2 className="w-4 h-4 animate-spin text-amber-500" /><span className="flex-1">Ezan sesleri indiriliyor…</span></>
                ) : missingMakams.length === 0 ? (
                  <><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="flex-1">Ezan sesleri telefona indirildi, internetsiz de okunur.</span></>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-amber-500" />
                    <span className="flex-1">{missingMakams.length} ezan sesi henüz indirilmedi. İnternet gerekiyor (~5 MB/makam).</span>
                    <button
                      onClick={handleRetryDownload}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 text-neutral-950 font-bold cursor-pointer"
                    >
                      İndir
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleTest}
                disabled={permission !== 'granted'}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${iconBtn}`}
              >
                <Send className="w-3.5 h-3.5" />
                Ezanı Test Et
              </button>
              <button
                onClick={handleReset}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${iconBtn}`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Varsayılana Dön
              </button>
            </div>
            {testMessage && <p className="text-[11px] mt-2 text-amber-500">{testMessage}</p>}
          </section>

          {/* SECTION: EZAN MAKAMLARI */}
          <section>
            <SectionTitle icon={Mic}>Müezzin</SectionTitle>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {ADHAN_READERS.map(r => {
                const active = r.id === adhanReader;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      adhanPlayer.stop();
                      setPlayingMakam(null);
                      onChangeAdhanReader(r.id);
                    }}
                    aria-pressed={active}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-colors ${
                      active ? 'bg-amber-500/10 border-amber-500/60' : card
                    }`}
                  >
                    <span className={`font-bold text-xs block ${active ? 'text-amber-500' : ''}`}>{r.name}</span>
                    <span className={`text-[10px] ${muted}`}>
                      {ADHAN_MAKAMLARI.filter(m => r.recordings[m.id]).length} makam
                    </span>
                  </button>
                );
              })}
            </div>

            <SectionTitle icon={Music}>Ezan Makamları</SectionTitle>
            <p className={`text-xs mb-3 ${muted}`}>
              Her vakit ezanı, günün ruhuna uygun bir makamda okunur. Dinlemek için oynatın:
            </p>
            {previewError && (
              <p className="text-[11px] text-amber-500 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Ezan yüklenemedi. İnternet bağlantınızı kontrol edin.
              </p>
            )}

            <div className="space-y-2">
              {ADHAN_MAKAMLARI.map((makam) => {
                const isThisPlaying = playingMakam === makam.id;
                const rec = resolveAdhan(adhanReader, makam.id);
                const fallback = rec.reader.id !== adhanReader;

                return (
                  <div
                    key={makam.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isThisPlaying ? 'bg-amber-500/10 border-amber-500/50' : card
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{makam.name}</span>
                        <span className={`text-[10px] font-medium ${muted}`}>({makam.prayerName} · {rec.duration})</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                          isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-600'
                        }`}>
                          {makam.mood}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 line-clamp-1 ${muted}`}>{makam.description}</p>
                      {fallback && (
                        <p className="text-[10px] mt-0.5 text-amber-500">Bu makamda {rec.reader.name} okuyuşu çalınır.</p>
                      )}
                    </div>

                    <button
                      onClick={() => handlePlayToggle(makam.id)}
                      className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isThisPlaying ? 'bg-amber-500 text-neutral-950 shadow-md animate-pulse' : iconBtn
                      }`}
                      aria-label={isThisPlaying ? 'Durdur' : 'Ön dinleme'}
                    >
                      {isThisPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};

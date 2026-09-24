import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { DEFAULT_CITY, calculatePrayerTimes, getHijriDate, getNextPrayerInfo, formatTurkishDate, TURKEY_CITIES } from './utils/prayerTimes';
import { CityData, PrayerName } from './types/prayer';
import { DAILY_VERSES, DAILY_HADITHS, WISDOM_QUOTES, DAILY_DUAS } from './data/islamicContent';
import { Header } from './components/Header';
import { MainClock } from './components/MainClock';
import { PrayerTimeline } from './components/PrayerTimeline';
import { QuickActionBadges } from './components/QuickActionBadges';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { CityPickerModal } from './components/CityPickerModal';
import { CompassModal } from './components/CompassModal';
import { ImsakiyeModal } from './components/ImsakiyeModal';
import { MosqueFinderModal } from './components/MosqueFinderModal';
import { QuranModal } from './components/QuranModal';
import { EzanSettingsModal } from './components/EzanSettingsModal';
import { WidgetModal } from './components/WidgetModal';
import { DiniBilgilerModal } from './components/DiniBilgilerModal';
import { ShareCardModal } from './components/ShareCardModal';
import { ApkInstallModal } from './components/ApkInstallModal';
import { updateOngoingNotification, clearOngoingNotification } from './utils/ongoingNotification';
import { updatePrayerWidget } from './utils/prayerWidget';
import { loadNotificationSettings, saveNotificationSettings, schedulePrayerNotifications, NotificationSettings } from './utils/prayerNotifications';
import { usePrayerAlerts } from './hooks/usePrayerAlerts';
import { AdhanReaderId, loadAdhanReader, saveAdhanReader } from './utils/adhan';
import { MapPin, BookOpen, BellRing, AlertCircle } from 'lucide-react';

export default function App() {
  // Theme state: dark mode defaults to true matching the template screenshot
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('namaz_theme');
    if (saved) return saved === 'dark';
    return true; // default dark obsidian AMOLED
  });

  // Selected city state: defaults to 'Sarıyer (İstanbul)' as in screenshot
  const [currentCity, setCurrentCity] = useState<CityData>(() => {
    const saved = localStorage.getItem('namaz_city');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_CITY;
      }
    }
    return DEFAULT_CITY;
  });

  const [isLocating, setIsLocating] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [now, setNow] = useState<Date>(() => new Date());
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Persistent Notification in Top Shade state
  const [isOngoingEnabled, setIsOngoingEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('namaz_ongoing_shade');
    return saved !== 'false'; // default enabled
  });

  // Per-prayer notification settings (edited in Ayarlar)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(loadNotificationSettings);
  const [settingsFocusPrayer, setSettingsFocusPrayer] = useState<PrayerName | null>(null);
  const [adhanReader, setAdhanReader] = useState<AdhanReaderId>(loadAdhanReader);
  // Bumped when the app returns to the foreground so alerts get re-planned
  // (e.g. after the user grants the exact-alarm permission in system settings).
  const [resumeCount, setResumeCount] = useState(0);

  // Modals state
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showCompass, setShowCompass] = useState(false);
  const [showImsakiye, setShowImsakiye] = useState(false);
  const [showMosques, setShowMosques] = useState(false);
  const [showQuran, setShowQuran] = useState(false);
  const [showEzanSettings, setShowEzanSettings] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [showDiniBilgiler, setShowDiniBilgiler] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCardType, setShareCardType] = useState<'verse' | 'hadith' | 'quote' | 'dua'>('verse');
  const [showApkModal, setShowApkModal] = useState(false);
  // Keep the Quran screen open across app switches while a recitation is playing.
  const quranAudioActiveRef = useRef(false);
  const handleQuranAudioActive = useCallback((active: boolean) => { quranAudioActiveRef.current = active; }, []);

  // Daily content index based on day of month
  const dayIndex = now.getDate() % DAILY_VERSES.length;
  const currentVerse = DAILY_VERSES[dayIndex];
  const currentHadith = DAILY_HADITHS[dayIndex % DAILY_HADITHS.length];
  const currentQuote = WISDOM_QUOTES[dayIndex % WISDOM_QUOTES.length];
  const currentDua = DAILY_DUAS[dayIndex % DAILY_DUAS.length];

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('namaz_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('namaz_theme', 'light');
    }
  }, [isDark]);

  // Persist city
  useEffect(() => {
    localStorage.setItem('namaz_city', JSON.stringify(currentCity));
  }, [currentCity]);

  // Persist ongoing notification setting
  useEffect(() => {
    localStorage.setItem('namaz_ongoing_shade', String(isOngoingEnabled));
    if (!isOngoingEnabled) {
      clearOngoingNotification();
    }
  }, [isOngoingEnabled]);

  // Persist notification settings
  useEffect(() => {
    saveNotificationSettings(notificationSettings);
  }, [notificationSettings]);

  useEffect(() => {
    saveAdhanReader(adhanReader);
  }, [adhanReader]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Always reopen from home when the app becomes visible again after backgrounding.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setResumeCount(c => c + 1);
        setActiveTab('home');
        setShowCityPicker(false);
        setShowCompass(false);
        setShowImsakiye(false);
        setShowMosques(false);
        if (!quranAudioActiveRef.current) setShowQuran(false);
        setShowEzanSettings(false);
        setShowWidget(false);
        setShowDiniBilgiler(false);
        setShowShareCard(false);
        setShowApkModal(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Live timer interval: ticks every second for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate prayer times
  const prayerTimes = useMemo(() => {
    return calculatePrayerTimes(currentCity.lat, currentCity.lng, now, currentCity.timezone);
  }, [currentCity, now.getFullYear(), now.getMonth(), now.getDate()]);

  // Hijri date
  const hijriDate = useMemo(() => {
    return getHijriDate(now);
  }, [now]);

  // Gregorian formatted date
  const gregorianDateStr = useMemo(() => {
    return formatTurkishDate(now);
  }, [now]);

  // Next prayer and countdown details
  const nextInfo = useMemo(() => {
    return getNextPrayerInfo(prayerTimes, now);
  }, [prayerTimes, now]);

  // Keep the system notification stable; the live countdown belongs to the widget.
  useEffect(() => {
    if (isOngoingEnabled) {
      updateOngoingNotification(currentCity, prayerTimes, nextInfo, true);
    }
  }, [currentCity, prayerTimes, nextInfo.nextPrayer, isOngoingEnabled]);

  // Update the home-screen widget only when its actual displayed data changes.
  useEffect(() => {
    updatePrayerWidget(currentCity, prayerTimes, nextInfo).catch(err => {
      console.debug('Prayer widget update error:', err);
    });
  }, [currentCity, prayerTimes, nextInfo.nextPrayer]);

  // Re-plan OS prayer alerts (Android) when location, settings or the day changes.
  const todayKey = now.toDateString();
  useEffect(() => {
    schedulePrayerNotifications(currentCity, notificationSettings, adhanReader).catch(err => {
      console.debug('Prayer notification scheduling error:', err);
    });
  }, [currentCity, notificationSettings, adhanReader, todayKey, resumeCount]);

  // In-app alerts (makam playback, web notifications) while the app is open.
  usePrayerAlerts(now, currentCity, notificationSettings, adhanReader);

  // Handle Bottom Navigation clicks
  const handleSelectTab = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'settings') {
      setSettingsFocusPrayer(null);
      setShowEzanSettings(true);
    } else if (tab === 'compass') {
      setShowCompass(true);
    } else if (tab === 'imsakiye') {
      setShowImsakiye(true);
    } else if (tab === 'quran') {
      setShowQuran(true);
    } else if (tab === 'more') {
      setShowMosques(true);
    }
  }, []);

  // GPS Auto locate
  const handleAutoLocate = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum servisini desteklemiyor.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let closest = TURKEY_CITIES[0];
        let minDist = 999999;
        TURKEY_CITIES.forEach(c => {
          const d = Math.hypot(c.lat - latitude, c.lng - longitude);
          if (d < minDist) {
            minDist = d;
            closest = c;
          }
        });

        if (minDist < 0.5) {
          setCurrentCity(closest);
        } else {
          setCurrentCity({
            id: 'gps-location',
            name: `${closest.name} (Konumunuz)`,
            country: 'Türkiye',
            lat: latitude,
            lng: longitude,
            timezone: 3
          });
        }
        setIsLocating(false);
      },
      (error) => {
        console.error('Konum hatası:', error);
        setIsLocating(false);
        alert('Konum alınamadı. Lütfen konum izinlerini kontrol edin veya listeden şehrinizi seçin.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  const handleOpenAyet = () => {
    setShareCardType('verse');
    setShowShareCard(true);
  };

  const handleOpenHadis = () => {
    setShareCardType('hadith');
    setShowShareCard(true);
  };

  const handleOpenOzluSozler = () => {
    setShowDiniBilgiler(true);
  };

  const handleOpenDua = () => {
    setShareCardType('dua');
    setShowShareCard(true);
  };

  const handleSelectPrayerFromTimeline = (prayer: PrayerName) => {
    setSettingsFocusPrayer(prayer);
    setActiveTab('settings');
    setShowEzanSettings(true);
  };

  return (
    <div 
      className={`min-h-screen w-full flex justify-center transition-colors duration-300 ${
        isDark ? 'bg-[#090d12] text-neutral-100' : 'bg-neutral-100 text-neutral-900'
      }`}
    >
      {/* Mobile-first app container with max width 450px to emulate native Android mobile app */}
      <div 
        className={`w-full max-w-[450px] min-h-screen flex flex-col justify-between relative pb-20 shadow-2xl transition-colors ${
          isDark ? 'bg-[#0a0e14] border-x border-neutral-900' : 'bg-white border-x border-neutral-200'
        }`}
      >
        {/* Offline notification badge */}
        {!isOnline && (
          <div className="w-full bg-amber-500 text-neutral-950 text-xs font-semibold py-1 px-3 text-center flex items-center justify-center gap-1.5 shadow-sm">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Çevrimdışı Mod — Vakitler ve dualar kesintisiz çalışıyor.</span>
          </div>
        )}

        {/* Top Section: Header with swipe pull indicator */}
        <Header
          currentCity={currentCity}
          onOpenCityPicker={() => setShowCityPicker(true)}
          onRefreshLocation={handleAutoLocate}
          isLocating={isLocating}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          onOpenWidgetModal={() => setShowWidget(true)}
          onOpenApkModal={() => setShowApkModal(true)}
        />

        {/* Centerpiece: Huge Time, Countdown, and Hijri Pill - Exactly matching template */}
        <main className="flex-1 flex flex-col justify-center">
          <MainClock
            nextInfo={nextInfo}
            hijriDate={hijriDate}
            gregorianDateStr={gregorianDateStr}
            isDark={isDark}
          />

          {/* Prayer Times Horizontal Ribbon - Exactly matching template */}
          <PrayerTimeline
            times={prayerTimes}
            nextInfo={nextInfo}
            isDark={isDark}
            onSelectPrayer={handleSelectPrayerFromTimeline}
          />

          {/* The 4 Circular Action Badges - Ayet, Hadis, Özlü Sözler, Dua */}
          <QuickActionBadges
            onOpenAyet={handleOpenAyet}
            onOpenHadis={handleOpenHadis}
            onOpenOzluSozler={handleOpenOzluSozler}
            onOpenDua={handleOpenDua}
            isDark={isDark}
          />

          {/* Quick Access Floating Action Tiles */}
          <div className="px-4 mb-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowMosques(true)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer group ${
                  isDark 
                    ? 'bg-neutral-900/60 border-neutral-800 hover:border-amber-500/50' 
                    : 'bg-neutral-50 border-neutral-200 hover:border-amber-400'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs group-hover:text-amber-500 transition-colors">Cami Bulucu</h4>
                  <p className="text-[10px] text-neutral-400">Yakındaki Camiler & Yol</p>
                </div>
              </button>

              <button
                onClick={() => setShowQuran(true)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer group ${
                  isDark 
                    ? 'bg-neutral-900/60 border-neutral-800 hover:border-amber-500/50' 
                    : 'bg-neutral-50 border-neutral-200 hover:border-amber-400'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs group-hover:text-emerald-400 transition-colors">Kur’an-ı Kerîm</h4>
                  <p className="text-[10px] text-neutral-400">Arapça, Meal & Dinle</p>
                </div>
              </button>
            </div>
          </div>
        </main>

        {/* Bottom Navigation Bar - Exactly matching template icons */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isDark={isDark}
        />

        {/* MODALS */}
        <CityPickerModal
          isOpen={showCityPicker}
          onClose={() => setShowCityPicker(false)}
          selectedCity={currentCity}
          onSelectCity={(city) => setCurrentCity(city)}
          onAutoLocate={handleAutoLocate}
          isLocating={isLocating}
          isDark={isDark}
        />

        <CompassModal
          isOpen={showCompass}
          onClose={() => {
            setShowCompass(false);
            setActiveTab('home');
          }}
          city={currentCity}
          isDark={isDark}
        />

        <ImsakiyeModal
          isOpen={showImsakiye}
          onClose={() => {
            setShowImsakiye(false);
            setActiveTab('home');
          }}
          city={currentCity}
          isDark={isDark}
        />

        <MosqueFinderModal
          isOpen={showMosques}
          onClose={() => {
            setShowMosques(false);
            setActiveTab('home');
          }}
          city={currentCity}
          isDark={isDark}
        />

        <QuranModal
          isOpen={showQuran}
          onClose={() => {
            setShowQuran(false);
            setActiveTab('home');
          }}
          isDark={isDark}
          onAudioActiveChange={handleQuranAudioActive}
        />

        <EzanSettingsModal
          isOpen={showEzanSettings}
          onClose={() => {
            setShowEzanSettings(false);
            setActiveTab('home');
          }}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          city={currentCity}
          onOpenCityPicker={() => {
            setShowEzanSettings(false);
            setActiveTab('home');
            setShowCityPicker(true);
          }}
          isOngoingEnabled={isOngoingEnabled}
          onToggleOngoing={setIsOngoingEnabled}
          settings={notificationSettings}
          onChangeSettings={setNotificationSettings}
          adhanReader={adhanReader}
          onChangeAdhanReader={setAdhanReader}
          focusPrayer={settingsFocusPrayer}
        />

        <WidgetModal
          isOpen={showWidget}
          onClose={() => setShowWidget(false)}
          city={currentCity}
          times={prayerTimes}
          nextInfo={nextInfo}
          isDark={isDark}
        />

        <DiniBilgilerModal
          isOpen={showDiniBilgiler}
          onClose={() => setShowDiniBilgiler(false)}
          isDark={isDark}
        />

        <ShareCardModal
          isOpen={showShareCard}
          onClose={() => setShowShareCard(false)}
          verse={currentVerse}
          hadith={currentHadith}
          quote={currentQuote}
          dua={currentDua}
          isDark={isDark}
          initialType={shareCardType}
        />

        <ApkInstallModal
          isOpen={showApkModal}
          onClose={() => setShowApkModal(false)}
          isDark={isDark}
        />
      </div>
    </div>
  );
}

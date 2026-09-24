import React from 'react';
import { MapPin, RefreshCw, Moon, Sun, Smartphone, QrCode } from 'lucide-react';
import { CityData } from '../types/prayer';

interface HeaderProps {
  currentCity: CityData;
  onOpenCityPicker: () => void;
  onRefreshLocation: () => void;
  isLocating: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenWidgetModal: () => void;
  onOpenApkModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onOpenCityPicker,
  onRefreshLocation,
  isLocating,
  isDark,
  onToggleTheme,
  onOpenWidgetModal,
  onOpenApkModal
}) => {
  return (
    <div className="w-full relative">
      <header className="w-full pt-2 pb-2 px-5 flex items-start justify-between z-20">
        {/* City & Diyanet Takvimi info - mirrors user screenshot */}
        <div className="flex flex-col">
          <button
            onClick={onOpenCityPicker}
            className="flex items-center gap-1.5 group text-left cursor-pointer focus:outline-none"
            title="Şehir değiştirmek için tıklayın"
          >
            <h1 className={`text-2xl font-bold tracking-tight transition-colors ${
              isDark ? 'text-white group-hover:text-amber-400' : 'text-neutral-900 group-hover:text-amber-600'
            }`}>
              {currentCity.name}
            </h1>
            <MapPin className="w-4 h-4 text-amber-500 opacity-80 group-hover:opacity-100 transition-opacity" />
          </button>

          <p className={`text-xs font-medium tracking-wide ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Diyanet Takvimi
          </p>

          <button
            onClick={onRefreshLocation}
            disabled={isLocating}
            className={`flex items-center gap-1 text-[11px] mt-0.5 cursor-pointer transition-colors ${
              isDark ? 'text-neutral-400 hover:text-amber-400' : 'text-neutral-500 hover:text-amber-600'
            }`}
            title="GPS ile konumu güncelle"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span>Konum Güncelleme: <span className="font-semibold">{isLocating ? 'Alınıyor...' : 'Şimdi'}</span></span>
            <RefreshCw className={`w-2.5 h-2.5 ml-0.5 ${isLocating ? 'animate-spin text-amber-500' : ''}`} />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* APK / Mobile Install Helper */}
          <button
            onClick={onOpenApkModal}
            className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer border flex items-center gap-1 ${
              isDark 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                : 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100'
            }`}
            title="Telefona APK Olarak Yükle & QR Kod"
            aria-label="Telefona APK Olarak Yükle & QR Kod"
          >
            <QrCode className="w-4 h-4" />
            <span className="text-[11px] font-bold hidden xs:inline">APK</span>
          </button>

          {/* Widget helper button */}
          <button
            onClick={onOpenWidgetModal}
            className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer border ${
              isDark 
                ? 'bg-neutral-900/70 border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-neutral-700' 
                : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:text-amber-600'
            }`}
            title="Ana Ekran Widget Görünümü"
            aria-label="Ana Ekran Widget Görünümü"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer border ${
              isDark 
                ? 'bg-neutral-900/70 border-neutral-800 text-neutral-300 hover:text-amber-400' 
                : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:text-amber-600'
            }`}
            title={isDark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
            aria-label="Tema değiştir"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>
    </div>
  );
};

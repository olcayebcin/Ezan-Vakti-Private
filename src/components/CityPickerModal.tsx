import React, { useState } from 'react';
import { CityData } from '../types/prayer';
import { TURKEY_CITIES } from '../utils/prayerTimes';
import { Search, MapPin, X, Navigation, Check } from 'lucide-react';

interface CityPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: CityData;
  onSelectCity: (city: CityData) => void;
  onAutoLocate: () => void;
  isLocating: boolean;
  isDark: boolean;
}

export const CityPickerModal: React.FC<CityPickerModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
  onAutoLocate,
  isLocating,
  isDark
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredCities = TURKEY_CITIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md rounded-2xl flex flex-col max-h-[85vh] overflow-hidden shadow-2xl border transition-all ${
          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold">Şehir & Konum Seçimi</h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                81 İl ve Dünya Şehirleri İçin Otomatik Vakitler
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Location Button */}
        <div className="p-3 border-b border-inherit">
          <button
            onClick={() => {
              onAutoLocate();
            }}
            disabled={isLocating}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'GPS Konumu Alınıyor...' : 'Mevcut Konumumu Kullan (GPS Otomatik)'}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-inherit">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
            isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
          }`}>
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Şehir adı yazın (örn: İstanbul, Sarıyer, Ankara, Mekke...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs w-full focus:outline-none"
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-neutral-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Cities List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-neutral-800/40">
          {filteredCities.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              Aradığınız kriterde şehir bulunamadı.
            </div>
          ) : (
            filteredCities.map((city) => {
              const isSelected = selectedCity.id === city.id || selectedCity.name === city.name;
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className={`w-full py-2.5 px-3 flex items-center justify-between rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-amber-500/10 text-amber-500 font-bold' 
                      : isDark 
                        ? 'hover:bg-neutral-800 text-neutral-300' 
                        : 'hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{city.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {city.country}
                    </span>
                    {city.isCapital && (
                      <span className="text-[10px] text-amber-500 font-medium">Başkent</span>
                    )}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

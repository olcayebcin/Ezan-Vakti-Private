import React, { useState, useMemo } from 'react';
import { CityData, Mosque } from '../types/prayer';
import { getNearbyMosques } from '../data/mosquesData';
import { X, MapPin, Navigation, Search, Check, ExternalLink, Car, Users, Landmark } from 'lucide-react';

interface MosqueFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityData;
  isDark: boolean;
}

export const MosqueFinderModal: React.FC<MosqueFinderModalProps> = ({
  isOpen,
  onClose,
  city,
  isDark
}) => {
  const [search, setSearch] = useState('');
  const [filterParking, setFilterParking] = useState(false);
  const [filterHistorical, setFilterHistorical] = useState(false);
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

  const allMosques = useMemo(() => {
    return getNearbyMosques(city.lat, city.lng, city.name);
  }, [city]);

  const filteredMosques = allMosques.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                          m.address.toLowerCase().includes(search.toLowerCase());
    const matchesParking = !filterParking || m.hasParking;
    const matchesHistorical = !filterHistorical || m.historical;
    return matchesSearch && matchesParking && matchesHistorical;
  });

  const activeMosque = selectedMosque || (filteredMosques.length > 0 ? filteredMosques[0] : null);

  const openNavigation = (m: Mosque) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}&destination_place_id=${encodeURIComponent(m.name)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-2xl rounded-3xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl border transition-all ${
          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Yakındaki Camiler</h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {city.name} ve Çevresindeki Camiler & Mescidler
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

        {/* Search & Filters */}
        <div className={`p-3 border-b space-y-2 ${isDark ? 'border-neutral-800 bg-neutral-950/40' : 'border-neutral-200 bg-neutral-50'}`}>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
            isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
          }`}>
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Cami veya mahalle adı ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs w-full focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-neutral-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive filter toggle pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterParking(!filterParking)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                filterParking 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-500' 
                  : isDark ? 'border-neutral-800 text-neutral-400 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Otoparklı</span>
            </button>
            <button
              onClick={() => setFilterHistorical(!filterHistorical)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                filterHistorical 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-500' 
                  : isDark ? 'border-neutral-800 text-neutral-400 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Tarihi Camiler</span>
            </button>
          </div>
        </div>

        {/* Interactive Map Visualizer */}
        <div className="relative w-full h-44 sm:h-52 bg-neutral-950 overflow-hidden border-b border-inherit">
          {/* Stylized Dark Grid Map Tile Visual */}
          <svg className="w-full h-full opacity-40" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Roads */}
            <path d="M -20 120 Q 150 80 420 140" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
            <path d="M 120 -20 Q 200 100 250 220" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <path d="M 280 -20 Q 240 80 350 220" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          </svg>

          {/* User Location Radar Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
            <div className="relative">
              <span className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white block shadow-lg shadow-blue-500/50" />
              <span className="w-12 h-12 rounded-full border border-blue-400/40 absolute -top-4 -left-4 animate-ping" />
            </div>
            <span className="text-[10px] font-semibold text-blue-300 mt-1 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
              Siz
            </span>
          </div>

          {/* Mosque Pins on Map */}
          {filteredMosques.map((m, idx) => {
            const isSelected = activeMosque?.id === m.id;
            // Spread points circularly around center
            const angle = (idx * 45) * (Math.PI / 180);
            const dist = Math.min(80, 25 + m.distanceKm * 14);
            const x = 50 + (Math.cos(angle) * dist) / 4;
            const y = 50 + (Math.sin(angle) * dist) / 2;

            return (
              <button
                key={m.id}
                onClick={() => setSelectedMosque(m)}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-transform ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
                style={{ left: `${Math.max(10, Math.min(90, x))}%`, top: `${Math.max(15, Math.min(85, y))}%` }}
                title={`${m.name} (${m.distanceKm} km)`}
              >
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shadow-md transition-all ${
                    isSelected 
                      ? 'bg-amber-500 border-white text-neutral-950 scale-110' 
                      : 'bg-neutral-900 border-amber-500/80 text-amber-400 hover:bg-amber-500 hover:text-black'
                  }`}
                >
                  <span className="text-xs">🕌</span>
                </div>
                <span className={`text-[9px] font-semibold mt-0.5 px-1.5 py-0.5 rounded backdrop-blur-sm whitespace-nowrap shadow ${
                  isSelected ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-900/80 text-white'
                }`}>
                  {m.name.split(' ')[0]} ({m.distanceKm} km)
                </span>
              </button>
            );
          })}
        </div>

        {/* Mosques List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-neutral-800/40">
          {filteredMosques.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              Kriterlere uygun cami bulunamadı.
            </div>
          ) : (
            filteredMosques.map((m) => {
              const isSelected = activeMosque?.id === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMosque(m)}
                  className={`p-3 rounded-2xl transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected 
                      ? isDark ? 'bg-neutral-800/60' : 'bg-neutral-100'
                      : isDark ? 'hover:bg-neutral-800/30' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                      🕌
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm">{m.name}</h3>
                        {m.historical && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-medium">
                            Tarihi
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {m.address}
                      </p>

                      {/* Badges */}
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-neutral-400">
                        <span className="text-amber-500 font-semibold">{m.distanceKm} km mesafe</span>
                        {m.hasParking && (
                          <span className="flex items-center gap-1">
                            <Car className="w-3 h-3 text-emerald-400" />
                            Otopark
                          </span>
                        )}
                        {m.hasWomenSection && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-cyan-400" />
                            Hanımlar Bölümü
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openNavigation(m);
                    }}
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold text-xs flex items-center gap-1 flex-shrink-0 shadow-sm transition-all"
                    title="Google Haritalar ile Yol Tarifi Al"
                  >
                    <Navigation className="w-4 h-4" />
                    <span className="hidden sm:inline">Yol Tarifi</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

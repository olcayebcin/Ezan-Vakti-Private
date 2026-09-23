import React, { useState, useMemo } from 'react';
import { CityData } from '../types/prayer';
import { generateMonthlyImsakiye } from '../utils/prayerTimes';
import { X, Calendar, Download, Printer, ChevronLeft, ChevronRight, Moon } from 'lucide-react';

interface ImsakiyeModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityData;
  isDark: boolean;
}

export const ImsakiyeModal: React.FC<ImsakiyeModalProps> = ({
  isOpen,
  onClose,
  city,
  isDark
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<'month' | 'ramadan'>('month');

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const imsakiyeDays = useMemo(() => {
    return generateMonthlyImsakiye(city.lat, city.lng, year, month, city.timezone);
  }, [city, year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

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
            <Calendar className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold">Vakit Takvimi & İmsakiye</h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {city.name} — Diyanet İşleri Başkanlığı Takvimi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                isDark ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-300' : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
              }`}
              title="Yazdır veya PDF olarak kaydet"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Month selector & Navigation */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? 'border-neutral-800 bg-neutral-950/40' : 'border-neutral-200 bg-neutral-50'}`}>
          <button
            onClick={handlePrevMonth}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-300' : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 font-bold text-sm">
            <span>{monthNames[month]} {year}</span>
            <span className="text-xs font-normal text-amber-500 flex items-center gap-1">
              <Moon className="w-3 h-3" />
              Hicrî 1448
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-300' : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${
                isDark ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-500'
              }`}>
                <th className="py-2.5 px-2">Tarih</th>
                <th className="py-2.5 px-2">Hicri</th>
                <th className="py-2.5 px-1.5 text-center">İmsak</th>
                <th className="py-2.5 px-1.5 text-center">Güneş</th>
                <th className="py-2.5 px-1.5 text-center">Öğle</th>
                <th className="py-2.5 px-1.5 text-center">İkindi</th>
                <th className="py-2.5 px-1.5 text-center font-bold text-amber-500">Akşam (İftar)</th>
                <th className="py-2.5 px-1.5 text-center">Yatsı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/40">
              {imsakiyeDays.map((item) => {
                const isToday = isCurrentMonth && item.dayNumber === today.getDate();

                return (
                  <tr
                    key={item.dayNumber}
                    className={`transition-colors font-mono ${
                      isToday
                        ? isDark
                          ? 'bg-amber-500/15 text-amber-300 font-bold'
                          : 'bg-amber-100 text-amber-900 font-bold'
                        : isDark
                          ? 'hover:bg-neutral-800/50 text-neutral-300'
                          : 'hover:bg-neutral-100/70 text-neutral-800'
                    }`}
                  >
                    <td className="py-2 px-2 whitespace-nowrap font-sans font-medium">
                      <span>{item.dateStr}</span>
                      <span className="text-[10px] text-neutral-500 ml-1">({item.dayName.slice(0, 3)})</span>
                    </td>
                    <td className="py-2 px-2 whitespace-nowrap text-[10px] text-neutral-400 font-sans">
                      {item.hijriDay} {item.hijriMonth.slice(0, 5)}
                    </td>
                    <td className="py-2 px-1.5 text-center tabular-nums">{item.times.imsak}</td>
                    <td className="py-2 px-1.5 text-center tabular-nums text-neutral-400">{item.times.gunes}</td>
                    <td className="py-2 px-1.5 text-center tabular-nums">{item.times.ogle}</td>
                    <td className="py-2 px-1.5 text-center tabular-nums">{item.times.ikindi}</td>
                    <td className="py-2 px-1.5 text-center tabular-nums font-bold text-amber-500">{item.times.aksam}</td>
                    <td className="py-2 px-1.5 text-center tabular-nums">{item.times.yatsi}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

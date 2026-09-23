import React, { useState } from 'react';
import { ESMA_UL_HUSNA, DINI_BILGILER, DAILY_DUAS } from '../data/islamicContent';
import { X, BookCheck, Sparkles, Heart, HelpCircle, Shield, Check } from 'lucide-react';

interface DiniBilgilerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  initialTab?: 'esma' | 'farzlar' | 'namaz' | 'dualar';
}

export const DiniBilgilerModal: React.FC<DiniBilgilerModalProps> = ({
  isOpen,
  onClose,
  isDark,
  initialTab = 'farzlar'
}) => {
  const [tab, setTab] = useState<'farzlar' | 'namaz' | 'esma' | 'dualar'>(initialTab);
  const [esmaSearch, setEsmaSearch] = useState('');

  if (!isOpen) return null;

  const filteredEsma = ESMA_UL_HUSNA.filter(e =>
    e.nameTurkish.toLowerCase().includes(esmaSearch.toLowerCase()) ||
    e.meaning.toLowerCase().includes(esmaSearch.toLowerCase())
  );

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
            <BookCheck className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold">Dini Bilgiler & İlmihal Rehberi</h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Farzlar, Namaz Kılınışı, Esma-ül Hüsna ve Günlük Dualar
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

        {/* Tab Switcher */}
        <div className={`px-4 pt-3 border-b flex items-center gap-2 overflow-x-auto ${isDark ? 'border-neutral-800 bg-neutral-950/40' : 'border-neutral-200 bg-neutral-50'}`}>
          <button
            onClick={() => setTab('farzlar')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              tab === 'farzlar'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            32 Farz & Şartlar
          </button>
          <button
            onClick={() => setTab('namaz')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              tab === 'namaz'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Namaz Tablosu & Rekatlar
          </button>
          <button
            onClick={() => setTab('esma')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              tab === 'esma'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Esma-ül Hüsna (99 İsim)
          </button>
          <button
            onClick={() => setTab('dualar')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              tab === 'dualar'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Günlük Dualar
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: 32 FARZ */}
          {tab === 'farzlar' && (
            <div className="space-y-3">
              {DINI_BILGILER.otuzIkiFarz.map((category, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <h3 className="font-bold text-sm text-amber-500 mb-2 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    <span>{category.title}</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: NAMAZ TABLOSU */}
          {tab === 'namaz' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <h3 className="font-bold text-sm text-amber-500 mb-3">5 Vakit Namazın Rekatları</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className={`border-b text-[11px] font-semibold text-neutral-400 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                        <th className="py-2">Vakit</th>
                        <th className="py-2">İlk Sünnet</th>
                        <th className="py-2 font-bold text-amber-400">Farz</th>
                        <th className="py-2">Son Sünnet</th>
                        <th className="py-2">Vitir</th>
                        <th className="py-2 text-right">Toplam</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/40">
                      <tr>
                        <td className="py-2 font-bold">Sabah</td>
                        <td className="py-2">2 Rekat</td>
                        <td className="py-2 font-bold text-amber-400">2 Rekat</td>
                        <td className="py-2">-</td>
                        <td className="py-2">-</td>
                        <td className="py-2 text-right font-bold">4 Rekat</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold">Öğle</td>
                        <td className="py-2">4 Rekat</td>
                        <td className="py-2 font-bold text-amber-400">4 Rekat</td>
                        <td className="py-2">2 Rekat</td>
                        <td className="py-2">-</td>
                        <td className="py-2 text-right font-bold">10 Rekat</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold">İkindi</td>
                        <td className="py-2">4 Rekat</td>
                        <td className="py-2 font-bold text-amber-400">4 Rekat</td>
                        <td className="py-2">-</td>
                        <td className="py-2">-</td>
                        <td className="py-2 text-right font-bold">8 Rekat</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold">Akşam</td>
                        <td className="py-2">-</td>
                        <td className="py-2 font-bold text-amber-400">3 Rekat</td>
                        <td className="py-2">2 Rekat</td>
                        <td className="py-2">-</td>
                        <td className="py-2 text-right font-bold">5 Rekat</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold">Yatsı</td>
                        <td className="py-2">4 Rekat</td>
                        <td className="py-2 font-bold text-amber-400">4 Rekat</td>
                        <td className="py-2">2 Rekat</td>
                        <td className="py-2 font-bold text-amber-400">3 Rekat</td>
                        <td className="py-2 text-right font-bold">13 Rekat</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Abdest Nasıl Alınır Kısa Bilgi */}
              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <h4 className="font-bold text-xs text-amber-500 mb-2">Abdestin Sırası</h4>
                <ol className="list-decimal list-inside text-xs space-y-1 text-neutral-300">
                  <li>Eûzü Besmele çekilir, niyet edilir ve eller bileklere kadar 3 defa yıkanır.</li>
                  <li>Ağza 3 defa sağ elle su verilip çalkalanır (mazmaza).</li>
                  <li>Burna 3 defa sağ elle su çekilip sol elle sümkürülür (istinşak).</li>
                  <li>Yüzün tamamı 3 defa yıkanır.</li>
                  <li>Önce sağ, sonra sol kol dirseklerle beraber 3 defa yıkanır.</li>
                  <li>Sağ elin ıslak ayası ile başın en az dörtte biri meshedilir.</li>
                  <li>Kulaklar içten ve dıştan meshedilir, boyun iki elin tersiyle meshedilir.</li>
                  <li>Önce sağ, sonra sol ayak topuklarla beraber parmak aralarından başlanarak yıkanır.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: ESMA-ÜL HÜSNA */}
          {tab === 'esma' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="İsim veya anlam ara (Rahman, Rahim, Melik...)"
                value={esmaSearch}
                onChange={(e) => setEsmaSearch(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                  isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
                }`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredEsma.map((e) => (
                  <div
                    key={e.number}
                    className={`p-3 rounded-2xl border flex items-start justify-between gap-3 ${
                      isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-white border-neutral-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-500 px-1.5 py-0.5 rounded bg-amber-500/10">
                          #{e.number}
                        </span>
                        <h4 className="font-bold text-sm">{e.nameTurkish}</h4>
                      </div>
                      <p className={`text-xs mt-1 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {e.meaning}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-neutral-400">
                        <span>Ebced: <strong className="text-amber-500">{e.ebcedValue}</strong></span>
                        <span>Fazilet: {e.virtue}</span>
                      </div>
                    </div>

                    <span className="font-arabic text-2xl text-amber-400 font-bold whitespace-nowrap">
                      {e.nameArabic}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DUALAR */}
          {tab === 'dualar' && (
            <div className="space-y-3">
              {DAILY_DUAS.map((d) => (
                <div
                  key={d.id}
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-white border-neutral-200'
                  }`}
                >
                  <h4 className="font-bold text-sm text-amber-500 mb-2">{d.title}</h4>
                  <p className="font-arabic text-xl sm:text-2xl text-right leading-loose text-amber-100 mb-2 p-2 rounded-xl bg-black/20">
                    {d.arabic}
                  </p>
                  <p className="text-xs text-neutral-400 italic mb-1.5">
                    {d.turkishReading}
                  </p>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed mb-2 ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                    {d.meaning}
                  </p>
                  <p className="text-[11px] text-amber-500/80">
                    ✦ {d.benefit}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

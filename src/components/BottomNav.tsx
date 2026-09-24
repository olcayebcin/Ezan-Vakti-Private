import React from 'react';
import { Settings, Compass, Calendar, BookOpen, Menu } from 'lucide-react';

export type ActiveTab = 'home' | 'settings' | 'compass' | 'imsakiye' | 'quran' | 'more';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isDark: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  isDark
}) => {
  const tabs = [
    {
      id: 'settings' as ActiveTab,
      label: 'Ayarlar',
      icon: Settings,
      description: 'Ezan Makamları & Bildirim'
    },
    {
      id: 'compass' as ActiveTab,
      label: 'Kıble',
      icon: Compass,
      description: 'Kıble Pusulası'
    },
    {
      id: 'imsakiye' as ActiveTab,
      label: 'İmsakiye',
      icon: Calendar,
      description: 'Yıllık Takvim & İmsakiye'
    },
    {
      id: 'quran' as ActiveTab,
      label: 'Kur’an',
      icon: BookOpen,
      description: 'Kur’an-ı Kerîm: Arapça, Meal & Dinle'
    },
    {
      id: 'more' as ActiveTab,
      label: 'Menü',
      icon: Menu,
      description: 'Cami Bulucu & Bilgiler'
    }
  ];

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-30 transition-all border-t safe-bottom ${
        isDark 
          ? 'bg-neutral-950/95 border-neutral-800/80 backdrop-blur-md' 
          : 'bg-white/95 border-neutral-200/80 backdrop-blur-md shadow-lg shadow-neutral-400/20'
      }`}
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(isActive ? 'home' : tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all cursor-pointer group focus:outline-none ${
                isActive 
                  ? 'text-amber-500 scale-105' 
                  : isDark 
                    ? 'text-neutral-400 hover:text-neutral-200' 
                    : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title={tab.description}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 transition-transform ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

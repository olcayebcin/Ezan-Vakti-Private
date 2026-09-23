import React from 'react';
import { BookOpen, Sparkles, MessageSquareQuote, HeartHandshake } from 'lucide-react';

interface QuickActionBadgesProps {
  onOpenAyet: () => void;
  onOpenHadis: () => void;
  onOpenOzluSozler: () => void;
  onOpenDua: () => void;
  isDark: boolean;
}

export const QuickActionBadges: React.FC<QuickActionBadgesProps> = ({
  onOpenAyet,
  onOpenHadis,
  onOpenOzluSozler,
  onOpenDua,
  isDark
}) => {
  const badges = [
    {
      id: 'ayet',
      title: 'Ayet',
      subtitle: 'Günün Ayeti',
      ringColor: '#ec4899', // Pink / Rose ring as in screenshot
      bgGradient: 'from-rose-500/20 to-pink-900/40',
      icon: (
        <svg className="w-8 h-8 text-amber-100" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <path d="M6 36C12 33 18 33 24 36C30 33 36 33 42 36V12C36 9 30 9 24 12C18 9 12 9 6 12V36Z" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"/>
          <path d="M24 12V36" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M12 21H18M12 27H18M30 21H36M30 27H36" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      onClick: onOpenAyet
    },
    {
      id: 'hadis',
      title: 'Hadis',
      subtitle: 'Günün Hadisi',
      ringColor: '#eab308', // Gold / Amber ring as in screenshot
      bgGradient: 'from-amber-500/20 to-amber-900/40',
      icon: (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="font-arabic text-xl font-bold text-amber-200 leading-none">محمد</span>
          <span className="text-[8px] text-amber-400 mt-0.5 tracking-tighter">ﷺ</span>
        </div>
      ),
      onClick: onOpenHadis
    },
    {
      id: 'ozlu-sozler',
      title: 'Özlü Sözler',
      subtitle: 'Hikmet & İlim',
      ringColor: '#d97706', // Warm Bronze / Orange ring as in screenshot
      bgGradient: 'from-amber-600/20 to-neutral-900/40',
      icon: (
        <svg className="w-8 h-8 text-amber-300" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          {/* Islamic Mihrab Arch */}
          <path d="M12 40V22C12 14 24 8 24 8C24 8 36 14 36 22V40" strokeWidth="2.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.2"/>
          <path d="M18 40V26C18 20 24 16 24 16C24 16 30 20 30 26V40" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="24" cy="28" r="3" fill="currentColor"/>
          <line x1="8" y1="40" x2="40" y2="40" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      onClick: onOpenOzluSozler
    },
    {
      id: 'dua',
      title: 'Dua',
      subtitle: 'Günün Duası',
      ringColor: '#06b6d4', // Cyan / Sky Blue ring as in screenshot
      bgGradient: 'from-cyan-500/20 to-blue-950/40',
      icon: (
        <svg className="w-8 h-8 text-cyan-200" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          {/* Praying Hands Silhouette */}
          <path d="M16 34C15 28 17 22 19 18C20 16 23 17 23 20V26" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M32 34C33 28 31 22 29 18C28 16 25 17 25 20V26" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 28C19 36 23 40 24 40C25 40 29 36 29 28" strokeWidth="2.2" strokeLinecap="round"/>
          {/* Subtle Divine Light Rays */}
          <circle cx="24" cy="14" r="2" fill="currentColor"/>
          <line x1="24" y1="6" x2="24" y2="9" strokeWidth="2" strokeLinecap="round"/>
          <line x1="17" y1="8" x2="19" y2="10" strokeWidth="2" strokeLinecap="round"/>
          <line x1="31" y1="8" x2="29" y2="10" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      onClick: onOpenDua
    }
  ];

  return (
    <div className="w-full px-4 mb-6">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
        {badges.map((b) => (
          <button
            key={b.id}
            onClick={b.onClick}
            className="flex flex-col items-center justify-center group focus:outline-none cursor-pointer transition-transform active:scale-90"
            title={`${b.subtitle} - Görüntülemek için tıkla`}
          >
            {/* Outer Circular Ring with Glowing Border */}
            <div 
              className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] transition-transform group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${b.ringColor} 0%, rgba(255,255,255,0.4) 50%, ${b.ringColor} 100%)`,
                boxShadow: `0 0 16px ${b.ringColor}44`
              }}
            >
              {/* Inner Circle Content */}
              <div 
                className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-colors ${
                  isDark ? 'bg-neutral-950' : 'bg-neutral-900'
                }`}
              >
                {b.icon}
              </div>
            </div>

            {/* Label Underneath */}
            <span 
              className={`text-xs font-semibold mt-2 tracking-tight transition-colors text-center ${
                isDark ? 'text-neutral-200 group-hover:text-amber-400' : 'text-neutral-800 group-hover:text-amber-600'
              }`}
            >
              {b.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

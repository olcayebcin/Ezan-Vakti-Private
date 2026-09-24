import React from 'react';

export interface QuickActionBadge {
  id: string;
  title: string;
  ringColor: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface QuickActionBadgesProps {
  badges: QuickActionBadge[];
  isDark: boolean;
}

/** Circular shortcuts on the home screen ("Günün" page and topic pages). */
export const QuickActionBadges: React.FC<QuickActionBadgesProps> = ({ badges, isDark }) => (
  <div className="w-full px-4 mb-6">
    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
      {badges.map((b) => (
        <button
          key={b.id}
          onClick={b.onClick}
          className="flex flex-col items-center justify-center group focus:outline-none cursor-pointer transition-transform active:scale-90"
          title={b.title}
        >
          {/* Outer circular ring with glowing border */}
          <div
            className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] transition-transform group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${b.ringColor} 0%, rgba(255,255,255,0.4) 50%, ${b.ringColor} 100%)`,
              boxShadow: `0 0 16px ${b.ringColor}44`
            }}
          >
            <div
              className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-colors ${
                isDark ? 'bg-neutral-950' : 'bg-neutral-900'
              }`}
            >
              {b.icon}
            </div>
          </div>

          <span
            className={`text-xs font-semibold mt-2 tracking-tight transition-colors text-center leading-tight ${
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

/** Icon for the "Günün" badge: open book with a rising sun. */
export const DailyBadgeIcon = () => (
  <svg className="w-8 h-8 text-amber-100" viewBox="0 0 48 48" fill="none" stroke="currentColor">
    <path d="M6 38C12 35 18 35 24 38C30 35 36 35 42 38V20C36 17 30 17 24 20C18 17 12 17 6 20V38Z" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
    <path d="M24 20V38" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M17 12a7 7 0 0 1 14 0" strokeWidth="2.2" strokeLinecap="round" className="text-amber-400" stroke="#fbbf24" />
    <path d="M24 3v2.5M14.5 7l1.8 1.8M33.5 7l-1.8 1.8" strokeWidth="2" strokeLinecap="round" stroke="#fbbf24" />
  </svg>
);

/** Icon for a topic badge: the name in Arabic script, like the old "Hadis" badge. */
export const ArabicNameIcon: React.FC<{ text: string }> = ({ text }) => (
  <span className="font-arabic text-lg font-bold text-amber-200 leading-none px-1 text-center">{text}</span>
);

import React, { useEffect, useRef } from 'react';
import { TopicPage } from '../data/topics';
import { X, Info, CalendarDays, BookMarked, Lightbulb, Quote, AlertTriangle, Library } from 'lucide-react';

interface TopicModalProps {
  topic: TopicPage | null;
  onClose: () => void;
  isDark: boolean;
}

export const TopicModal: React.FC<TopicModalProps> = ({ topic, onClose, isDark }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [topic?.id]);

  if (!topic) return null;

  const muted = isDark ? 'text-neutral-400' : 'text-neutral-500';
  const body = isDark ? 'text-neutral-200' : 'text-neutral-700';
  const card = isDark ? 'bg-neutral-950/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200';
  const accent = { color: topic.ringColor };

  const Section: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <section>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className="w-4 h-4" style={accent} />
        <h3 className="font-bold text-xs uppercase tracking-wider" style={accent}>{title}</h3>
      </div>
      {children}
    </section>
  );

  const RivayetTag = () => (
    <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 align-middle">rivayet</span>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl h-full sm:h-[92vh] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border ${
          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div
          className="relative p-5 pb-4 border-b"
          style={{
            borderColor: `${topic.ringColor}44`,
            background: `linear-gradient(160deg, ${topic.ringColor}26 0%, transparent 70%)`,
          }}
        >
          <button
            onClick={onClose}
            aria-label="Kapat"
            className={`absolute top-3 right-3 p-2 rounded-xl cursor-pointer ${
              isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4 pr-8">
            <div
              className="w-16 h-16 rounded-full p-[2.5px] flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${topic.ringColor}, rgba(255,255,255,0.4), ${topic.ringColor})` }}
            >
              <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center">
                <span className="font-arabic text-lg text-amber-100 leading-none">{topic.arabicTitle}</span>
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold leading-tight">{topic.title}</h2>
              <p className={`text-xs ${muted}`}>{topic.subtitle}</p>
              <p className="text-xs font-semibold mt-0.5" style={accent}>{topic.lifespan}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6">
          <p className={`text-sm leading-relaxed ${body}`}>{topic.intro}</p>

          <Section icon={Info} title="Künye">
            <dl className={`rounded-2xl border divide-y ${card} ${isDark ? 'divide-neutral-800' : 'divide-neutral-200'}`}>
              {topic.facts.map(f => (
                <div key={f.label} className="p-3 grid grid-cols-[88px_1fr] gap-3 text-xs">
                  <dt className={`font-semibold ${muted}`}>{f.label}</dt>
                  <dd className={body}>{f.value}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section icon={CalendarDays} title="Hayatı">
            <ol className="relative ml-2 border-l pl-5 space-y-3.5" style={{ borderColor: `${topic.ringColor}55` }}>
              {topic.timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span
                    className="absolute -left-[26px] top-1 w-2.5 h-2.5 rounded-full"
                    style={{ background: topic.ringColor, boxShadow: `0 0 0 4px ${isDark ? '#171717' : '#fff'}` }}
                  />
                  <span className="text-[11px] font-bold tabular-nums" style={accent}>{t.date}</span>
                  <p className={`text-xs leading-relaxed ${body}`}>
                    {t.text}
                    {t.rivayet && <RivayetTag />}
                  </p>
                </li>
              ))}
            </ol>
          </Section>

          <Section icon={BookMarked} title="Eserleri">
            <div className="space-y-2">
              {topic.works.map(w => (
                <div key={w.title} className={`p-3 rounded-2xl border ${card}`}>
                  <h4 className="font-bold text-sm">{w.title}</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${body}`}>{w.text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={Lightbulb} title="Temel Kavramlar">
            <div className="space-y-2">
              {topic.concepts.map(c => (
                <div key={c.term} className="text-xs leading-relaxed">
                  <span className="font-bold" style={accent}>{c.term}: </span>
                  <span className={body}>{c.text}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={Quote} title="Sözlerinden">
            <div className="space-y-3">
              {topic.quotes.map((q, i) => (
                <figure key={i} className="pl-3 border-l-2" style={{ borderColor: topic.ringColor }}>
                  <blockquote className={`text-sm italic leading-relaxed ${body}`}>{q.text}</blockquote>
                  <figcaption className={`text-[11px] mt-1 ${muted}`}>— {q.source}</figcaption>
                </figure>
              ))}
            </div>
          </Section>

          {topic.corrections && topic.corrections.length > 0 && (
            <Section icon={AlertTriangle} title="Yanlış Bilinenler">
              <div className="space-y-2">
                {topic.corrections.map(c => (
                  <div key={c.claim} className={`p-3 rounded-2xl border ${isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                    <p className="text-xs font-bold">{c.claim}</p>
                    <p className={`text-xs mt-1 leading-relaxed ${body}`}>{c.text}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section icon={Library} title="Kaynaklar">
            <ul className={`text-[11px] space-y-1 list-disc pl-4 ${muted}`}>
              {topic.sources.map(s => <li key={s}>{s}</li>)}
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { Calendar, ExternalLink, MapPin } from 'lucide-react';
import type { BixusEvent } from '@/types/bixus';
import { useApp } from '@/context/AppContext';

export function EventsClient({ events }: { events: BixusEvent[] }) {
  const { t } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-2">
        <h1 className="font-display text-4xl font-bold">{t('eventsTitle')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('eventsSubtitle')}</p>
      </div>

      {events.length === 0 ? (
        <div className="bixus-card rounded-3xl p-12 text-center" style={{ color: 'var(--text-secondary)' }}>
          Brevemente anunciaremos as próximas feiras e eventos!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div key={ev.id} className="bixus-card rounded-3xl p-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent-gold-soft)] text-[#e5a400]">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {ev.event_date}
                  {ev.end_date && ev.end_date !== ev.event_date ? ` → ${ev.end_date}` : ''}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold">{ev.title}</h2>
              <p className="text-sm flex items-center gap-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                <MapPin className="w-4 h-4 text-[#e5a400] shrink-0" />
                {ev.location}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {ev.description}
              </p>
              {ev.link && (
                <a
                  href={ev.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#e5a400] hover:underline"
                >
                  Mais informações <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

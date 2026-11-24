import React from 'react';
import { getEvents } from '@/lib/db';
import { EventsClient } from '@/components/EventsClient';

export const dynamic = 'force-dynamic';

export default async function EventosPage() {
  const events = await getEvents(true);
  return <EventsClient events={events} />;
}

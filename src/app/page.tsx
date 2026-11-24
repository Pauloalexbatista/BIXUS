import React from 'react';
import { getEvents, getProducts } from '@/lib/db';
import { HomeClient } from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, events] = await Promise.all([getProducts(), getEvents(true)]);
  const featured = products.filter((p) => p.featured || (p.promo_price !== null && p.promo_price !== undefined));

  return (
    <HomeClient
      featuredProducts={featured.length > 0 ? featured : products.slice(0, 4)}
      upcomingEvents={events}
    />
  );
}

import React from 'react';
import { getProducts } from '@/lib/db';
import { ShopClient } from '@/components/ShopClient';

export const dynamic = 'force-dynamic';

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const [products, params] = await Promise.all([getProducts(), searchParams]);
  return <ShopClient products={products} initialCategory={params.cat} />;
}

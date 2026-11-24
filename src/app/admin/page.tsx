import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getEvents, getOrders, getProducts, getPromotions } from '@/lib/db';
import { AdminDashboard } from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect('/auth/login');
  }

  const [products, orders, events, promotions] = await Promise.all([
    getProducts(),
    getOrders(),
    getEvents(false),
    getPromotions(),
  ]);

  return (
    <AdminDashboard
      initialProducts={products}
      initialOrders={orders}
      initialEvents={events}
      initialPromotions={promotions}
    />
  );
}

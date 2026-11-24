'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Cookie, Box, Shirt, Sparkles, MapPin, Heart } from 'lucide-react';
import type { BixusEvent, Product } from '@/types/bixus';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';

export function HomeClient({
  featuredProducts,
  upcomingEvents,
}: {
  featuredProducts: Product[];
  upcomingEvents: BixusEvent[];
}) {
  const { t } = useApp();
  const [email, setEmail] = useState('');
  const [subOk, setSubOk] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setSubOk(true);
      setEmail('');
    }
  };

  return (
    <div className="space-y-20 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--accent-gold-soft)] text-[#b88200] dark:text-[#f5b700]">
              <Sparkles className="w-3.5 h-3.5" />
              {t('heroBadge')}
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-lg leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              {t('tagline')}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/loja"
                className="bixus-btn-primary px-7 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 shadow-md"
              >
                {t('heroCtaShop')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/eventos"
                className="px-7 py-3.5 rounded-2xl font-bold text-base border transition-colors hover:bg-[var(--bg-accent-soft)]"
                style={{ borderColor: 'var(--border-color)' }}
              >
                {t('heroCtaEvents')}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden border-4 border-[#f5b700] shadow-xl aspect-square">
                  <img src="/images/brand/logo.jpg" alt="BIXUS Logo" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
                  <img src="/images/products/biscoito-osso-1.jpg" alt="Biscoito Osso" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
                  <img src="/images/brand/quem-somos.jpg" alt="BIXUS Família" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg aspect-square">
                  <img src="/images/products/biscoito-osso-2.jpg" alt="Caixa Biscoito" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">{t('catTitle')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('catSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { href: '/loja?cat=comida', icon: Cookie, title: t('catFood'), desc: t('catFoodDesc') },
            { href: '/loja?cat=roupa', icon: Shirt, title: t('catClothes'), desc: t('catClothesDesc') },
            { href: '/loja?cat=3d', icon: Box, title: t('cat3d'), desc: t('cat3dDesc') },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="bixus-card rounded-3xl p-7 space-y-4 group hover:-translate-y-1 transition-all"
            >
              <div className="w-13 h-13 rounded-2xl bg-[var(--accent-gold-soft)] flex items-center justify-center text-[#e5a400] group-hover:scale-110 transition-transform">
                <c.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-bold">{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {c.desc}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#e5a400]">
                {t('heroCtaShop')} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured & Promos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold">{t('featuredTitle')}</h2>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{t('featuredSubtitle')}</p>
          </div>
          <Link href="/loja" className="text-sm font-bold text-[#e5a400] flex items-center gap-1 hover:underline">
            {t('viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Upcoming Events / Fairs */}
      {upcomingEvents.length > 0 && (
        <section className="py-14" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-bold">{t('eventsTitle')}</h2>
                <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{t('eventsSubtitle')}</p>
              </div>
              <Link href="/eventos" className="text-sm font-bold text-[#e5a400] flex items-center gap-1 hover:underline">
                {t('viewAllEvents')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.slice(0, 2).map((ev) => (
                <div key={ev.id} className="bixus-card rounded-3xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#e5a400]">
                    <Calendar className="w-4 h-4" />
                    <span>{ev.event_date}{ev.end_date && ev.end_date !== ev.event_date ? ` → ${ev.end_date}` : ''}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold">{ev.title}</h3>
                  <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                    <MapPin className="w-4 h-4 shrink-0" />
                    {ev.location}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {ev.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bixus-card rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
            <img src="/images/brand/quem-somos.jpg" alt="Quem Somos BIXUS" className="w-full h-full object-cover" />
          </div>
          <div className="p-8 sm:p-12 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent-gold-soft)] text-[#e5a400]">
              <Heart className="w-3.5 h-3.5" />
              BIXUS®
            </span>
            <h2 className="font-display text-3xl font-bold">{t('aboutTitle')}</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('aboutText')}
            </p>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 bixus-btn-primary px-6 py-3 rounded-2xl font-bold text-sm"
            >
              {t('aboutCta')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bixus-card rounded-3xl p-8 sm:p-10 text-center space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">{t('newsletterTitle')}</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('newsletterSubtitle')}</p>
          {subOk ? (
            <p className="font-bold text-[#198754]">{t('newsletterOk')}</p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletterPlaceholder')}
                className="flex-1 px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:border-[#f5b700]"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              />
              <button type="submit" className="bixus-btn-primary px-6 py-3 rounded-2xl font-bold text-sm cursor-pointer">
                {t('newsletterBtn')}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

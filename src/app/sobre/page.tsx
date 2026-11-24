'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SobrePage() {
  const { t } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-[#f5b700]">
          <img src="/images/brand/quem-somos.jpg" alt="Quem Somos BIXUS" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent-gold-soft)] text-[#e5a400]">
            <Heart className="w-3.5 h-3.5" />
            BIXUS® — {t('slogan')}
          </span>
          <h1 className="font-display text-4xl font-bold">{t('aboutTitle')}</h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('aboutText')}
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Dos snacks 100% naturais desidratados e biscoitos personalizados às roupas confortáveis e peças impressas em 3D, tudo é pensado para o bem-estar, saúde e alegria dos nossos patudos.
          </p>
          <Link
            href="/loja"
            className="inline-flex items-center gap-2 bixus-btn-primary px-6 py-3 rounded-2xl font-bold text-sm"
          >
            {t('heroCtaShop')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Price sheets showcase */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#f5b700]" />
          Os Nossos Preçários Naturais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bixus-card rounded-3xl overflow-hidden">
            <img src="/images/brand/precario-snacks.jpg" alt="Preçário Snacks Naturais" className="w-full h-auto" />
          </div>
          <div className="bixus-card rounded-3xl overflow-hidden">
            <img src="/images/brand/precario-biscoitos.jpg" alt="Preçário Biscoitos Naturais" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

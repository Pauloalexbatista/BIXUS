'use client';

import React, { useMemo, useState } from 'react';
import { Search, Tag } from 'lucide-react';
import type { AnimalTarget, Product, ProductCategory } from '@/types/bixus';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';

export function ShopClient({
  products,
  initialCategory = 'all',
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const { t } = useApp();
  const [category, setCategory] = useState<'all' | ProductCategory>(
    initialCategory === 'comida' || initialCategory === 'roupa' || initialCategory === '3d'
      ? initialCategory
      : 'all'
  );
  const [animal, setAnimal] = useState<'all' | AnimalTarget>('all');
  const [promoOnly, setPromoOnly] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (animal !== 'all' && p.animal !== animal && p.animal !== 'ambos') return false;
      if (promoOnly && !(p.promo_price !== null && p.promo_price !== undefined && p.promo_price < p.price)) {
        return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${p.name} ${p.description} ${p.ingredients || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, category, animal, promoOnly, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-4xl font-bold">{t('navShop')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('catSubtitle')}</p>
      </div>

      {/* Filters bar */}
      <div className="bixus-card rounded-3xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'all', label: t('filterAll') },
                { id: 'comida', label: t('catFood') },
                { id: 'roupa', label: t('catClothes') },
                { id: '3d', label: t('cat3d') },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  category === c.id
                    ? 'bixus-btn-primary shadow-xs'
                    : 'border hover:bg-[var(--bg-accent-soft)]'
                }`}
                style={{ borderColor: 'var(--border-color)' }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 opacity-60" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 rounded-2xl border text-sm focus:outline-none focus:border-[#f5b700]"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
          {/* Animal pills */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'all', label: t('filterAll') },
                { id: 'cao', label: `🐶 ${t('filterDog')}` },
                { id: 'gato', label: `🐱 ${t('filterCat')}` },
                { id: 'ambos', label: `🐾 ${t('filterBoth')}` },
              ] as const
            ).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAnimal(a.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  animal === a.id
                    ? 'bg-[var(--accent-gold)] text-[#082d20] border-transparent'
                    : 'hover:bg-[var(--bg-accent-soft)]'
                }`}
                style={{ borderColor: 'var(--border-color)' }}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* Promo toggle */}
          <button
            type="button"
            onClick={() => setPromoOnly((v) => !v)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
              promoOnly
                ? 'bg-[#f5b700] text-[#082d20] border-transparent'
                : 'hover:bg-[var(--bg-accent-soft)]'
            }`}
            style={{ borderColor: 'var(--border-color)' }}
          >
            <Tag className="w-3.5 h-3.5" />
            {t('filterPromoOnly')}
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bixus-card rounded-3xl p-12 text-center" style={{ color: 'var(--text-secondary)' }}>
          Nenhum produto encontrado com estes filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

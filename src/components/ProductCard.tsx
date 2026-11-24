'use client';

import React, { useState } from 'react';
import { Check, Dog, Cat, Sparkles, ShoppingBag, Tag } from 'lucide-react';
import type { Product } from '@/types/bixus';
import { useApp } from '@/context/AppContext';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, t } = useApp();
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0] : ''
  );
  const [added, setAdded] = useState(false);

  const hasPromo = product.promo_price !== null && product.promo_price !== undefined && product.promo_price < product.price;
  const activePrice = hasPromo ? Number(product.promo_price) : Number(product.price);

  const categoryLabel =
    product.category === 'comida'
      ? t('catFood')
      : product.category === 'roupa'
      ? t('catClothes')
      : t('cat3d');

  const animalLabel =
    product.animal === 'cao'
      ? t('filterDog')
      : product.animal === 'gato'
      ? t('filterCat')
      : t('filterBoth');

  const handleAdd = () => {
    if (!product.in_stock) return;
    addToCart(product, 1, selectedVariant || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="bixus-card rounded-3xl overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1">
      <div>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-secondary)]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0e4b35]/90 text-white backdrop-blur-xs">
              {categoryLabel}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-[#0e4b35] flex items-center gap-1 shadow-xs">
              {product.animal === 'cao' && <Dog className="w-3 h-3" />}
              {product.animal === 'gato' && <Cat className="w-3 h-3" />}
              {product.animal === 'ambos' && <Sparkles className="w-3 h-3" />}
              {animalLabel}
            </span>
          </div>
          {hasPromo && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#f5b700] text-[#082d20] flex items-center gap-1 shadow-sm">
              <Tag className="w-3 h-3" />
              {t('promoBadge')}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-bold leading-snug">{product.name}</h3>
            <div className="text-right shrink-0">
              {hasPromo && (
                <span className="block text-xs line-through opacity-60">
                  {Number(product.price).toFixed(2)} €
                </span>
              )}
              <span className="font-display text-lg font-bold text-[#e5a400]">
                {activePrice.toFixed(2)} €
              </span>
              <span className="block text-[10px] opacity-65">/ {product.unit_label}</span>
            </div>
          </div>

          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {product.description}
          </p>

          {product.ingredients && (
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
              <strong>{t('ingredientsLabel')}</strong> {product.ingredients}
            </p>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.variants.map((variant) => (
                <button
                  key={variant}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedVariant === variant
                      ? 'bg-[var(--accent-gold)] text-[#082d20] border-transparent'
                      : 'hover:bg-[var(--bg-accent-soft)]'
                  }`}
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  {variant}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="px-5 pb-5 pt-1">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.in_stock}
          className={`w-full py-2.5 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer ${
            !product.in_stock
              ? 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
              : added
              ? 'bg-[#198754] text-white'
              : 'bixus-btn-primary'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              {t('added')}
            </>
          ) : !product.in_stock ? (
            t('outOfStock')
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              {t('addToCart')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

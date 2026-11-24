'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, Tag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { DeliveryMethod, Promotion } from '@/types/bixus';

export default function CarrinhoPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartSubtotal, t } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('envio');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [promoMsg, setPromoMsg] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [orderDone, setOrderDone] = useState<{ orderNumber: string; total: number } | null>(null);
  const [error, setError] = useState('');

  const discountAmount = appliedPromo
    ? appliedPromo.discount_percent > 0
      ? (cartSubtotal * appliedPromo.discount_percent) / 100
      : Math.min(cartSubtotal, appliedPromo.discount_fixed)
    : 0;

  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyPromo = async () => {
    setPromoMsg('');
    if (!promoInput.trim()) return;
    const res = await fetch(`/api/promotions?code=${encodeURIComponent(promoInput.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setAppliedPromo(data.promotion);
      setPromoMsg(`Código ${data.promotion.code} aplicado!`);
    } else {
      setAppliedPromo(null);
      setPromoMsg('Código inválido ou expirado.');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          delivery_method: deliveryMethod,
          notes,
          promo_code: appliedPromo?.code || '',
          items: cart.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: Number(item.product.promo_price ?? item.product.price),
            quantity: item.quantity,
            variant: item.variant,
            image: item.product.image,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao enviar encomenda');
      } else {
        setOrderDone({ orderNumber: data.order.order_number, total: Number(data.order.total_amount) });
        clearCart();
      }
    } catch {
      setError('Erro de ligação ao servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderDone) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="bixus-card rounded-3xl p-10 space-y-5">
          <CheckCircle2 className="w-16 h-16 text-[#198754] mx-auto" />
          <h1 className="font-display text-3xl font-bold">{t('orderSuccessTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{t('orderSuccessDesc')}</p>
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] inline-block">
            <span className="text-xs block opacity-75">{t('orderNumberLabel')}</span>
            <strong className="font-display text-2xl text-[#e5a400]">{orderDone.orderNumber}</strong>
            <span className="block text-sm font-bold mt-1">{orderDone.total.toFixed(2)} €</span>
          </div>
          <div>
            <Link href="/loja" className="inline-block bixus-btn-primary px-6 py-3 rounded-2xl font-bold text-sm">
              {t('cartEmptyCta')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <h1 className="font-display text-4xl font-bold">{t('cartTitle')}</h1>

      {cart.length === 0 ? (
        <div className="bixus-card rounded-3xl p-12 text-center space-y-5">
          <ShoppingBag className="w-12 h-12 mx-auto opacity-40" />
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>{t('cartEmpty')}</p>
          <Link href="/loja" className="inline-block bixus-btn-primary px-6 py-3 rounded-2xl font-bold text-sm">
            {t('cartEmptyCta')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => {
              const unitPrice = Number(item.product.promo_price ?? item.product.price);
              return (
                <div
                  key={`${item.product.id}-${item.variant || ''}`}
                  className="bixus-card rounded-3xl p-4 flex items-center gap-4"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-base truncate">{item.product.name}</h3>
                    {item.variant && (
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-[var(--bg-secondary)] inline-block mt-0.5">
                        {item.variant}
                      </span>
                    )}
                    <p className="text-sm font-bold text-[#e5a400] mt-1">{unitPrice.toFixed(2)} €</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant)}
                      className="p-1.5 rounded-xl border cursor-pointer"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant)}
                      className="p-1.5 rounded-xl border cursor-pointer"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id, item.variant)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            {/* Promo code */}
            <div className="bixus-card rounded-3xl p-5 space-y-3">
              <label className="text-xs font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#e5a400]" />
                {t('promoCodeLabel')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Ex: BIXUS10"
                  className="flex-1 px-4 py-2.5 rounded-2xl border text-sm uppercase focus:outline-none focus:border-[#f5b700]"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-5 py-2.5 rounded-2xl border text-sm font-bold hover:bg-[var(--bg-accent-soft)] cursor-pointer"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  {t('applyPromo')}
                </button>
              </div>
              {promoMsg && <p className="text-xs font-semibold text-[#e5a400]">{promoMsg}</p>}
            </div>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmitOrder} className="bixus-card rounded-3xl p-6 space-y-4">
              <div className="p-3.5 rounded-2xl text-xs leading-relaxed bg-[var(--accent-gold-soft)] text-[#9a6b00] dark:text-[#f5b700]">
                {t('cartNoteNoPay')}
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t('customerName')} *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border text-sm"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">{t('customerEmail')} *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border text-sm"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">{t('customerPhone')} *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border text-sm"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t('deliveryMethod')}</label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                  className="w-full px-4 py-2.5 rounded-2xl border text-sm"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                >
                  <option value="envio">{t('deliveryShipping')}</option>
                  <option value="feira">{t('deliveryFair')}</option>
                  <option value="mao">{t('deliveryHand')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t('customerAddress')}</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border text-sm"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t('notesLabel')}</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border text-sm"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
              </div>

              <div className="pt-3 border-t space-y-1.5 text-sm" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span>{cartSubtotal.toFixed(2)} €</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#198754] font-semibold">
                    <span>{t('discount')} ({appliedPromo?.code})</span>
                    <span>-{discountAmount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between font-display text-lg font-bold pt-1">
                  <span>{t('total')}</span>
                  <span className="text-[#e5a400]">{finalTotal.toFixed(2)} €</span>
                </div>
              </div>

              {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bixus-btn-primary py-3.5 rounded-2xl font-bold text-sm cursor-pointer"
              >
                {submitting ? 'A enviar...' : t('submitOrder')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

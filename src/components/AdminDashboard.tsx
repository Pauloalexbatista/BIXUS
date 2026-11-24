'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, LogOut, Package, Plus, ShoppingBag, Tag, Trash2, Star } from 'lucide-react';
import type { AnimalTarget, BixusEvent, Order, OrderStatus, Product, ProductCategory, Promotion } from '@/types/bixus';

type Tab = 'products' | 'orders' | 'events' | 'promos';

export function AdminDashboard({
  initialProducts,
  initialOrders,
  initialEvents,
  initialPromotions,
}: {
  initialProducts: Product[];
  initialOrders: Order[];
  initialEvents: BixusEvent[];
  initialPromotions: Promotion[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [events, setEvents] = useState<BixusEvent[]>(initialEvents);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);

  // Product Form
  const [pName, setPName] = useState('');
  const [pCat, setPCat] = useState<ProductCategory>('comida');
  const [pAnimal, setPAnimal] = useState<AnimalTarget>('ambos');
  const [pPrice, setPPrice] = useState('');
  const [pPromoPrice, setPPromoPrice] = useState('');
  const [pUnit, setPUnit] = useState('unidade');
  const [pVariants, setPVariants] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pIngredients, setPIngredients] = useState('');
  const [pImage, setPImage] = useState('/images/products/biscoito-osso-1.jpg');
  const [pFeatured, setPFeatured] = useState(false);

  // Event Form
  const [eTitle, setETitle] = useState('');
  const [eLocation, setELocation] = useState('');
  const [eDate, setEDate] = useState('');
  const [eDesc, setEDesc] = useState('');

  // Promo Form
  const [prCode, setPrCode] = useState('');
  const [prPercent, setPrPercent] = useState('10');
  const [prDesc, setPrDesc] = useState('');

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'POST' });
    router.push('/auth/login');
    router.refresh();
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: pName,
        category: pCat,
        animal: pAnimal,
        price: Number(pPrice),
        promo_price: pPromoPrice ? Number(pPromoPrice) : null,
        unit_label: pUnit,
        variants: pVariants,
        description: pDesc,
        ingredients: pIngredients,
        image: pImage,
        featured: pFeatured,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setProducts((prev) => [data.product, ...prev]);
      setPName('');
      setPPrice('');
      setPPromoPrice('');
      setPVariants('');
      setPDesc('');
      setPIngredients('');
      setPFeatured(false);
    }
  };

  const handleToggleFeatured = async (p: Product) => {
    const res = await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, featured: !p.featured }),
    });
    if (res.ok) {
      const data = await res.json();
      setProducts((prev) => prev.map((x) => (x.id === p.id ? data.product : x)));
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) setProducts((prev) => prev.filter((x) => x.id !== id));
  };

  const handleOrderStatus = async (id: number, status: OrderStatus) => {
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: eTitle,
        location: eLocation,
        event_date: eDate,
        description: eDesc,
        active: true,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setEvents((prev) => [...prev, data.event]);
      setETitle('');
      setELocation('');
      setEDate('');
      setEDesc('');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
    if (res.ok) setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: prCode,
        discount_percent: Number(prPercent),
        discount_fixed: 0,
        description: prDesc,
        active: true,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setPromotions((prev) => [data.promotion, ...prev]);
      setPrCode('');
      setPrDesc('');
    }
  };

  const handleDeletePromo = async (id: number) => {
    const res = await fetch(`/api/promotions?id=${id}`, { method: 'DELETE' });
    if (res.ok) setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Backoffice BIXUS.PT</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Gestão de produtos, encomendas, feiras/eventos e códigos promocionais.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 hover:bg-red-500/10 text-red-500 cursor-pointer"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'products', label: `Produtos (${products.length})`, icon: Package },
          { id: 'orders', label: `Encomendas (${orders.length})`, icon: ShoppingBag },
          { id: 'events', label: `Eventos & Feiras (${events.length})`, icon: Calendar },
          { id: 'promos', label: `Promoções (${promotions.length})`, icon: Tag },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id as Tab)}
            className={`px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 cursor-pointer ${
              tab === item.id ? 'bixus-btn-primary' : 'border hover:bg-[var(--bg-accent-soft)]'
            }`}
            style={{ borderColor: 'var(--border-color)' }}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* PRODUCTS TAB */}
      {tab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleCreateProduct} className="lg:col-span-4 bixus-card rounded-3xl p-6 space-y-3 h-fit">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#e5a400]" /> Novo Produto
            </h2>
            <input
              type="text"
              required
              placeholder="Nome do produto *"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={pCat}
                onChange={(e) => setPCat(e.target.value as ProductCategory)}
                className="px-3 py-2.5 rounded-xl border text-sm"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <option value="comida">Comida / Biscoitos</option>
                <option value="roupa">Roupas</option>
                <option value="3d">Objetos 3D</option>
              </select>
              <select
                value={pAnimal}
                onChange={(e) => setPAnimal(e.target.value as AnimalTarget)}
                className="px-3 py-2.5 rounded-xl border text-sm"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <option value="ambos">Cães & Gatos</option>
                <option value="cao">Só Cães</option>
                <option value="gato">Só Gatos</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                step="0.01"
                required
                placeholder="Preço €"
                value={pPrice}
                onChange={(e) => setPPrice(e.target.value)}
                className="px-3 py-2.5 rounded-xl border text-sm"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Promo €"
                value={pPromoPrice}
                onChange={(e) => setPPromoPrice(e.target.value)}
                className="px-3 py-2.5 rounded-xl border text-sm"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              />
              <input
                type="text"
                placeholder="Unid. (100g)"
                value={pUnit}
                onChange={(e) => setPUnit(e.target.value)}
                className="px-3 py-2.5 rounded-xl border text-sm"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              />
            </div>
            <input
              type="text"
              placeholder="Variantes (ex: S, M, L)"
              value={pVariants}
              onChange={(e) => setPVariants(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
            <input
              type="text"
              placeholder="URL da Imagem"
              value={pImage}
              onChange={(e) => setPImage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
            <textarea
              rows={2}
              placeholder="Descrição"
              value={pDesc}
              onChange={(e) => setPDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
            <input
              type="text"
              placeholder="Ingredientes / Material"
              value={pIngredients}
              onChange={(e) => setPIngredients(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
            <label className="flex items-center gap-2 text-xs font-semibold">
              <input type="checkbox" checked={pFeatured} onChange={(e) => setPFeatured(e.target.checked)} />
              Destaque na Página Inicial
            </label>
            <button type="submit" className="w-full bixus-btn-primary py-2.5 rounded-xl font-bold text-sm cursor-pointer">
              Adicionar Produto
            </button>
          </form>

          <div className="lg:col-span-8 space-y-3">
            {products.map((p) => (
              <div key={p.id} className="bixus-card rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm truncate">{p.name}</h3>
                    <p className="text-xs opacity-75">
                      {p.category.toUpperCase()} · {p.animal.toUpperCase()} · {Number(p.price).toFixed(2)} €
                      {p.promo_price ? ` (Promo: ${Number(p.promo_price).toFixed(2)} €)` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(p)}
                    className={`p-2 rounded-xl border cursor-pointer ${
                      p.featured ? 'bg-[#f5b700] text-[#082d20] border-transparent' : ''
                    }`}
                    style={{ borderColor: 'var(--border-color)' }}
                    title="Destaque"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bixus-card rounded-3xl p-10 text-center opacity-75">
              Ainda não existem encomendas registadas.
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="bixus-card rounded-3xl p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-display font-bold text-lg text-[#e5a400]">{o.order_number}</span>
                    <span className="ml-3 text-sm font-bold">{o.customer_name}</span>
                    <span className="ml-2 text-xs opacity-75">({o.customer_phone} · {o.customer_email})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-lg">{Number(o.total_amount).toFixed(2)} €</span>
                    <select
                      value={o.status}
                      onChange={(e) => handleOrderStatus(o.id, e.target.value as OrderStatus)}
                      className="px-3 py-1.5 rounded-xl border text-xs font-bold"
                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="em_preparacao">Em Preparação</option>
                      <option value="enviada">Enviada</option>
                      <option value="concluida">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>
                <div className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <p>
                    <strong>Entrega:</strong> {o.delivery_method} {o.customer_address ? `— ${o.customer_address}` : ''}
                  </p>
                  {o.notes && <p><strong>Notas:</strong> {o.notes}</p>}
                  <p>
                    <strong>Artigos:</strong>{' '}
                    {o.items.map((it) => `${it.quantity}x ${it.name}${it.variant ? ` (${it.variant})` : ''}`).join(', ')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* EVENTS TAB */}
      {tab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleCreateEvent} className="lg:col-span-4 bixus-card rounded-3xl p-6 space-y-3 h-fit">
            <h2 className="font-display text-lg font-bold">Novo Evento / Feira</h2>
            <input
              type="text"
              required
              placeholder="Título da Feira / Evento"
              value={eTitle}
              onChange={(e) => setETitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
            <input
              type="text"
              required
              placeholder="Local"
              value={eLocation}
              onChange={(e) => setELocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
            <input
              type="date"
              required
              value={eDate}
              onChange={(e) => setEDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
            <textarea
              rows={3}
              placeholder="Descrição"
              value={eDesc}
              onChange={(e) => setEDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
            <button type="submit" className="w-full bixus-btn-primary py-2.5 rounded-xl font-bold text-sm cursor-pointer">
              Criar Evento
            </button>
          </form>

          <div className="lg:col-span-8 space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="bixus-card rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#e5a400]">{ev.event_date}</span>
                  <h3 className="font-bold text-sm">{ev.title}</h3>
                  <p className="text-xs opacity-75">{ev.location}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(ev.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROMOS TAB */}
      {tab === 'promos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleCreatePromo} className="lg:col-span-4 bixus-card rounded-3xl p-6 space-y-3 h-fit">
            <h2 className="font-display text-lg font-bold">Novo Código Promocional</h2>
            <input
              type="text"
              required
              placeholder="Código (ex: BIXUS15)"
              value={prCode}
              onChange={(e) => setPrCode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm uppercase"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
            <input
              type="number"
              required
              placeholder="Desconto (%)"
              value={prPercent}
              onChange={(e) => setPrPercent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
            <input
              type="text"
              placeholder="Descrição"
              value={prDesc}
              onChange={(e) => setPrDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            />
            <button type="submit" className="w-full bixus-btn-primary py-2.5 rounded-xl font-bold text-sm cursor-pointer">
              Criar Código
            </button>
          </form>

          <div className="lg:col-span-8 space-y-3">
            {promotions.map((pr) => (
              <div key={pr.id} className="bixus-card rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <span className="font-display font-bold text-base text-[#e5a400]">{pr.code}</span>
                  <span className="ml-2 text-xs font-bold">({pr.discount_percent}% OFF)</span>
                  <p className="text-xs opacity-75">{pr.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePromo(pr.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

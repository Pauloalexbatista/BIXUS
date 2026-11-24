'use client';

import React, { useState } from 'react';
import { Facebook, Instagram, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ContactosPage() {
  const { t } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    if (res.ok) {
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-2">
        <h1 className="font-display text-4xl font-bold">{t('contactTitle')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('contactSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Info */}
        <div className="md:col-span-2 bixus-card rounded-3xl p-7 space-y-6">
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#f5b700] shrink-0 mt-0.5" />
              <div>
                <strong className="block">Telefone / WhatsApp</strong>
                <span style={{ color: 'var(--text-secondary)' }}>+351 964 581 323</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#f5b700] shrink-0 mt-0.5" />
              <div>
                <strong className="block">Email</strong>
                <span style={{ color: 'var(--text-secondary)' }}>geral@bixus.pt (a atualizar)</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#f5b700] shrink-0 mt-0.5" />
              <div>
                <strong className="block">Localização & Feiras</strong>
                <span style={{ color: 'var(--text-secondary)' }}>Portugal — Envios, Feiras e Entrega em Mão</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t space-y-3" style={{ borderColor: 'var(--border-color)' }}>
            <strong className="text-sm block">Redes Sociais</strong>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/bixus.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold hover:bg-[var(--bg-accent-soft)]"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Facebook className="w-4 h-4 text-[#f5b700]" /> Facebook
              </a>
              <a
                href="https://www.instagram.com/bixus.pt/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold hover:bg-[var(--bg-accent-soft)]"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Instagram className="w-4 h-4 text-[#f5b700]" /> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-3 bixus-card rounded-3xl p-7">
          {sent ? (
            <div className="p-6 rounded-2xl bg-[var(--bg-accent-soft)] text-center font-bold">
              {t('messageSent')}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">{t('customerName')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:border-[#f5b700]"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">{t('customerEmail')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:border-[#f5b700]"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">Mensagem</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:border-[#f5b700]"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
              </div>
              <button type="submit" className="bixus-btn-primary px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 cursor-pointer">
                <Send className="w-4 h-4" />
                {t('sendMessage')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

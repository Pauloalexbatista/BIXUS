'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Mail, MapPin, Phone, PawPrint } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Footer() {
  const { t } = useApp();
  const pathname = usePathname();

  if (pathname?.startsWith('/acesso')) return null;

  return (
    <footer
      className="border-t mt-16"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/brand/logo.jpg"
              alt="BIXUS"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-[#f5b700]"
            />
            <div>
              <h3 className="font-display text-xl font-bold">BIXUS.PT</h3>
              <p className="text-xs font-semibold text-[#e5a400]">{t('slogan')}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('tagline')}
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-base flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-[#f5b700]" />
            BIXUS.PT
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li><Link href="/loja" className="hover:underline">{t('navShop')}</Link></li>
            <li><Link href="/eventos" className="hover:underline">{t('navEvents')}</Link></li>
            <li><Link href="/sobre" className="hover:underline">{t('navAbout')}</Link></li>
            <li><Link href="/contactos" className="hover:underline">{t('navContact')}</Link></li>
            <li><Link href="/carrinho" className="hover:underline">{t('navCart')}</Link></li>
          </ul>
        </div>

        {/* Contacts & Socials (with editable placeholders) */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-base">{t('navContact')}</h4>
          <ul className="space-y-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#f5b700] shrink-0" />
              <span>+351 964 581 323</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#f5b700] shrink-0" />
              <span>geral@bixus.pt (a atualizar)</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#f5b700] shrink-0" />
              <span>Portugal — Feiras, Envios & Entrega em Mão</span>
            </li>
          </ul>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://www.facebook.com/bixus.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border hover:scale-105 transition-transform"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              aria-label="Facebook BIXUS"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/bixus.pt/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border hover:scale-105 transition-transform"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              title="Instagram BIXUS"
              aria-label="Instagram BIXUS"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div
        className="border-t py-4 text-center text-xs"
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
      >
        © {new Date().getFullYear()} BIXUS.PT — {t('footerRights')}
      </div>
    </footer>
  );
}

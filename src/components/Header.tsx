'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, ShoppingBag, Sun, X, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LANGUAGES } from '@/lib/i18n';

export function Header() {
  const { theme, toggleTheme, lang, setLang, t, cartCount } = useApp();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname?.startsWith('/acesso')) return null;

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/loja', label: t('navShop') },
    { href: '/eventos', label: t('navEvents') },
    { href: '/sobre', label: t('navAbout') },
    { href: '/contactos', label: t('navContact') },
  ];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(8, 45, 32, 0.92)' : 'rgba(255, 255, 255, 0.92)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-[#f5b700] shadow-sm group-hover:scale-105 transition-transform">
            <img src="/images/brand/logo.jpg" alt="BIXUS" className="w-full h-full object-cover" />
          </div>
          <div className="leading-tight">
            <span className="font-display text-xl font-bold tracking-tight block">BIXUS.PT</span>
            <span className="text-[11px] font-medium opacity-75 hidden sm:block">{t('slogan')}</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[var(--accent-green)] text-white dark:text-[#082d20]'
                    : 'hover:bg-[var(--bg-accent-soft)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div
            className="hidden sm:flex items-center rounded-xl p-1 border"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lang === l.code
                    ? 'bg-[var(--accent-gold)] text-[#082d20] shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title={l.label}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border transition-all hover:scale-105 cursor-pointer"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            title={theme === 'light' ? t('darkMode') : t('lightMode')}
            aria-label="Alternar tema"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#f5b700]" />}
          </button>

          {/* Backoffice link */}
          <Link
            href="/admin"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold hover:bg-[var(--bg-accent-soft)] transition-colors"
            style={{ borderColor: 'var(--border-color)' }}
            title={t('navAdmin')}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('navAdmin')}</span>
          </Link>

          {/* Cart */}
          <Link
            href="/carrinho"
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bixus-btn-primary text-sm font-semibold shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t('navCart')}</span>
            {cartCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-[#f5b700] text-[#082d20]">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 rounded-xl border cursor-pointer"
            style={{ borderColor: 'var(--border-color)' }}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t px-4 py-4 space-y-2"
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold hover:bg-[var(--bg-accent-soft)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2.5 rounded-xl font-semibold hover:bg-[var(--bg-accent-soft)]"
          >
            {t('navAdmin')}
          </Link>
          <div className="flex items-center gap-2 pt-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  lang === l.code ? 'bg-[var(--accent-gold)] text-[#082d20] border-transparent' : ''
                }`}
                style={{ borderColor: 'var(--border-color)' }}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CartItem, Language, Product, ThemeMode } from '@/types/bixus';
import { DICTIONARY } from '@/lib/i18n';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: number, variant?: string) => void;
  updateQuantity: (productId: number, quantity: number, variant?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [lang, setLangState] = useState<Language>('pt');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const savedTheme = localStorage.getItem('bixus_theme') as ThemeMode | null;
      const savedLang = localStorage.getItem('bixus_lang') as Language | null;
      const savedCart = localStorage.getItem('bixus_cart');

      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }
      if (savedLang && ['pt', 'en', 'es', 'fr'].includes(savedLang)) {
        setLangState(savedLang);
      }
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch {
          setCart([]);
        }
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bixus_theme', theme);
  }, [theme, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('bixus_lang', lang);
  }, [lang, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('bixus_cart', JSON.stringify(cart));
  }, [cart, hydrated]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const setLang = (newLang: Language) => setLangState(newLang);
  const t = (key: string) => DICTIONARY[lang]?.[key] ?? DICTIONARY.pt[key] ?? key;

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.product.id === product.id && (item.variant || '') === (variant || '')
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
        return updated;
      }
      return [...prev, { product, quantity, variant }];
    });
  };

  const removeFromCart = (productId: number, variant?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && (item.variant || '') === (variant || '')))
    );
  };

  const updateQuantity = (productId: number, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && (item.variant || '') === (variant || '')
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.promo_price ?? item.product.price;
    return acc + Number(unitPrice) * item.quantity;
  }, 0);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        setLang,
        t,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}

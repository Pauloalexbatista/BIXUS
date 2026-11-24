'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@bixus.pt');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Email ou password incorretos.');
      }
    } catch {
      setError('Erro de ligação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bixus-card rounded-3xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-gold-soft)] text-[#e5a400] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl font-bold">Backoffice BIXUS.PT</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Inicia sessão para gerir produtos, encomendas, feiras e promoções.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 opacity-60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 opacity-60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bixus-btn-primary py-3 rounded-2xl font-bold text-sm cursor-pointer"
          >
            {loading ? 'A entrar...' : 'Entrar no Backoffice'}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function AcessoPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const params = new URLSearchParams(window.location.search);
        const nextUrl = params.get('next') || '/';
        window.location.href = nextUrl;
      } else {
        setError('Password incorreta. Tenta novamente.');
      }
    } catch {
      setError('Erro de ligação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#082d20] text-white">
      <div className="w-full max-w-md rounded-3xl p-8 bg-[#0e4b35] border border-[#1c664a] shadow-2xl space-y-6 text-center">
        <img
          src="/images/brand/logo.jpg"
          alt="BIXUS"
          className="w-24 h-24 rounded-3xl mx-auto object-cover border-4 border-[#f5b700] shadow-lg"
        />
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold">BIXUS.PT</h1>
          <p className="text-sm font-semibold text-[#f5b700]">O melhor de Nós para Eles</p>
          <p className="text-xs text-[#d4ebe1] pt-2">
            Área de pré-visualização privada. Insere a password de acesso para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#f5b700]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password de acesso..."
              required
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#082d20] border border-[#1c664a] text-white placeholder:text-[#9bc4b4] focus:outline-none focus:border-[#f5b700]"
            />
          </div>
          {error && <p className="text-xs text-amber-300 font-semibold">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#f5b700] hover:bg-[#ffc72c] text-[#082d20] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>{loading ? 'A verificar...' : 'Entrar no Site'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

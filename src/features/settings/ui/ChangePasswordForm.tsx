"use client";

import React, { useState } from 'react';
import { z } from 'zod';
import { ShieldCheck, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Aktualne hasło jest wymagane'),
  newPassword: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
  confirmPassword: z.string().min(1, 'Potwierdzenie hasła jest wymagane')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"],
});

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    
    try {
      changePasswordSchema.parse(formData);
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach(e => {
          if (e.path[0]) newErrors[e.path[0].toString()] = e.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ type: 'success', message: 'Hasło zostało pomyślnie zmienione.' });
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Wystąpił błąd podczas zmiany hasła.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Błąd połączenia z serwerem.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[var(--radius-brand-card)] p-8 shadow-sm border border-slate-200">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center">
          <KeyRound size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800">Zmiana hasła</h3>
          <p className="text-sm font-medium text-slate-500">Zaktualizuj swoje hasło dostępowe do platformy.</p>
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-[var(--radius-brand-button)] mb-6 flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {status.type === 'success' ? <ShieldCheck size={20} /> : <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">!</div>}
          <p className="font-bold text-sm">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Aktualne hasło</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-50 border ${errors.currentPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-blue focus:ring-brand-blue/20'} rounded-[var(--radius-brand-button)] font-medium text-slate-800 focus:outline-none focus:ring-4 transition-all pr-12`}
              placeholder="Wpisz aktualne hasło"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && <p className="text-red-500 text-xs font-bold mt-2">{errors.currentPassword}</p>}
        </div>

        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nowe hasło</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-50 border ${errors.newPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-blue focus:ring-brand-blue/20'} rounded-[var(--radius-brand-button)] font-medium text-slate-800 focus:outline-none focus:ring-4 transition-all pr-12`}
              placeholder="Min. 8 znaków"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && <p className="text-red-500 text-xs font-bold mt-2">{errors.newPassword}</p>}
        </div>

        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Powtórz nowe hasło</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-50 border ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-blue focus:ring-brand-blue/20'} rounded-[var(--radius-brand-button)] font-medium text-slate-800 focus:outline-none focus:ring-4 transition-all pr-12`}
              placeholder="Powtórz hasło"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs font-bold mt-2">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black uppercase tracking-widest text-sm hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Zmień hasło'}
        </button>
      </form>
    </div>
  );
}

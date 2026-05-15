'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Coins } from 'lucide-react';

import { RoleSelector } from '@/components/forms/RoleSelector';
import { AlunoForm } from '@/components/forms/AlunoForm';
import { EmpresaForm } from '@/components/forms/EmpresaForm';

type Role = 'aluno' | 'empresa' | null;

export default function CadastroPage() {
  const [role, setRole] = useState<Role>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30">
      {/* Minimal header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-slate-900 hover:text-indigo-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Coins className="w-4 h-4 text-white" />
            </div>
            <span>MoedaEstudantil</span>
          </Link>
          <Link
            href="/login"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Já tem conta?{' '}
            <span className="text-indigo-600 font-medium hover:underline">Entrar</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {role === null && (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <RoleSelector onSelect={setRole} />
            </motion.div>
          )}

          {role === 'aluno' && (
            <motion.div
              key="aluno"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AlunoForm onBack={() => setRole(null)} />
            </motion.div>
          )}

          {role === 'empresa' && (
            <motion.div
              key="empresa"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <EmpresaForm onBack={() => setRole(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

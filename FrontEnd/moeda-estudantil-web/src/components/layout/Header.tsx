'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coins, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Início', href: '/' },
  { label: 'Como Funciona', href: '/#como-funciona' },
  { label: 'Vantagens', href: '/#vantagens' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10'
          : 'bg-transparent',
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Coins className="w-5 h-5 text-amber-950" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Moeda<span className="text-amber-400">Estudantil</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-300 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 h-9 rounded-md text-slate-300 hover:text-white hover:bg-white/10 font-medium transition-colors text-sm"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center px-4 h-9 rounded-md bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-semibold border-0 shadow-lg shadow-amber-500/20 transition-all text-sm"
            >
              Cadastre-se
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/10"
        >
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-slate-300 hover:text-white py-2 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cadastro"
              onClick={() => setMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-4 h-10 rounded-md bg-gradient-to-r from-amber-400 to-amber-600 text-amber-950 font-semibold border-0 mt-2 transition-all text-sm"
            >
              Cadastre-se
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

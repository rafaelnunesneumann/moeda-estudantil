'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Building2, Coins, GraduationCap } from 'lucide-react';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function FloatingCoin() {
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-3xl scale-110" />

      {/* Main coin */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 shadow-2xl shadow-amber-500/40 flex items-center justify-center border-4 border-amber-200/40"
        animate={{ y: [0, -20, 0], rotate: [0, 4, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Inner coin face */}
        <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center border-2 border-amber-200/50">
          <GraduationCap className="w-24 h-24 md:w-32 md:h-32 text-amber-900/70" />
        </div>
      </motion.div>

      {/* Orbiting mini-coins */}
      {[
        { delay: 0, angle: 0, top: '50%', left: '102%' },
        { delay: 0.5, angle: 120, top: '95%', left: '24%' },
        { delay: 1, angle: 240, top: '5%', left: '24%' },
      ].map(({ delay, angle, top, left }) => (
          <motion.div
            key={angle}
            className="absolute w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 shadow-lg shadow-amber-400/40 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{ top, left }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Coins className="w-5 h-5 md:w-6 md:h-6 text-amber-800" />
          </motion.div>
        ))}

      {/* Sparkle dots */}
      {[
        { top: '8%', left: '70%', delay: 0 },
        { top: '75%', left: '85%', delay: 0.7 },
        { top: '85%', left: '15%', delay: 1.4 },
        { top: '10%', left: '20%', delay: 0.3 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-amber-300"
          style={{ top: s.top, left: s.left }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: s.delay, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 overflow-hidden flex items-center"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/3 -right-1/4 w-[900px] h-[900px] rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-400/5 blur-3xl" />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-28">
          {/* Left: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 text-amber-300 text-sm font-medium border border-amber-500/25 backdrop-blur-sm">
                <Coins className="w-4 h-4" />
                Sistema de Mérito Estudantil
              </span>
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                Reconheça o{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  Mérito
                </span>
                .<br />
                Distribua{' '}
                <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                  Valor
                </span>
                .
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-300/90 max-w-lg leading-relaxed"
            >
              Professores distribuem moedas virtuais para reconhecer a dedicação
              dos alunos. Alunos trocam por vantagens reais em empresas parceiras.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-bold shadow-xl shadow-amber-500/30 border-0 text-base px-8 h-12 rounded-md transition-all"
              >
                <GraduationCap className="w-5 h-5" />
                Sou Aluno
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-2 border border-slate-600 text-white hover:bg-white/10 hover:border-slate-400 text-base px-8 h-12 rounded-md transition-all bg-transparent"
              >
                <Building2 className="w-5 h-5" />
                Sou Empresa
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Mini stats */}
            <motion.div
              variants={itemVariants}
              className="flex gap-10 pt-2 border-t border-white/10"
            >
              {[
                { value: '500+', label: 'Alunos' },
                { value: '120+', label: 'Professores' },
                { value: '80+', label: 'Vantagens' },
              ].map((s) => (
                <div key={s.label} className="pt-4">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-slate-400 text-sm mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Coin */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <FloatingCoin />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-5 h-9 rounded-full border-2 border-slate-600 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-slate-400" />
        </div>
      </motion.div>
    </section>
  );
}

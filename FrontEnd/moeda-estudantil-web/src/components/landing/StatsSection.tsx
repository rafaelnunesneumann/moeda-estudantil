'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { GradientText } from '@/components/shared/GradientText';
import { AnimatedSection } from '@/components/shared/AnimatedSection';

const stats = [
  { end: 500, suffix: '+', label: 'Alunos Cadastrados', description: 'em instituições parceiras' },
  { end: 120, suffix: '+', label: 'Professores Ativos', description: 'distribuindo reconhecimento' },
  { end: 80, suffix: '+', label: 'Vantagens Disponíveis', description: 'para troca de moedas' },
  { end: 25, suffix: '+', label: 'Empresas Parceiras', description: 'oferecendo benefícios' },
];

function AnimatedCounter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Números que{' '}
            <GradientText variant="amber">impactam</GradientText>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            O sistema já está transformando a forma como o mérito é reconhecido nas
            instituições de ensino.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1}>
              <div className="text-center group">
                <div className="relative inline-block">
                  <div className="text-4xl md:text-5xl font-extrabold text-white mb-1 tracking-tight">
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="absolute -inset-2 bg-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
                </div>
                <p className="text-amber-300 font-semibold text-sm mt-2">{stat.label}</p>
                <p className="text-slate-500 text-xs mt-1">{stat.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

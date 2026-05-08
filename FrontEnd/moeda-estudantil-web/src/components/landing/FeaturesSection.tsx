'use client';

import { motion } from 'framer-motion';
import { Award, Coins, ShoppingBag, TrendingUp } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { GradientText } from '@/components/shared/GradientText';
import { AnimatedSection } from '@/components/shared/AnimatedSection';

const features = [
  {
    icon: Award,
    title: 'Reconhecimento Real',
    description:
      'Professores distribuem moedas para reconhecer participação, bom comportamento e dedicação dos alunos em sala de aula.',
    color: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    icon: Coins,
    title: 'Moeda com Propósito',
    description:
      'As moedas acumuladas têm valor real: podem ser trocadas por descontos, produtos ou vantagens exclusivas em empresas parceiras.',
    color: 'from-amber-400 to-amber-600',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: ShoppingBag,
    title: 'Vantagens Exclusivas',
    description:
      'Empresas parceiras oferecem descontos em restaurantes, material escolar, mensalidades e muito mais para os alunos do sistema.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: TrendingUp,
    title: 'Extrato Transparente',
    description:
      'Alunos e professores acompanham em tempo real o saldo e o histórico completo de transações realizadas.',
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
];

export function FeaturesSection() {
  return (
    <section id="vantagens" className="py-28 bg-white">
      <div className="container mx-auto px-6">
        <SectionHeader
          badge="Por que usar?"
          title={
            <>
              Um ecossistema de{' '}
              <GradientText>reconhecimento</GradientText>
            </>
          }
          subtitle="Conectamos alunos, professores e empresas numa plataforma que valoriza o mérito e cria oportunidades reais."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <AnimatedSection key={feat.title} delay={i * 0.1}>
                <motion.div
                  className="group relative h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-default overflow-hidden"
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-5`}
                  >
                    <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{feat.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feat.description}</p>

                  {/* Bottom gradient bar */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

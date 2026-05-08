'use client';

import { Building2, Coins, GraduationCap } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { GradientText } from '@/components/shared/GradientText';
import { AnimatedSection } from '@/components/shared/AnimatedSection';

const steps = [
  {
    number: '01',
    icon: GraduationCap,
    title: 'Cadastre-se',
    description:
      'Alunos e empresas parceiras se cadastram na plataforma. Professores já vêm pré-cadastrados pela instituição.',
    color: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    role: 'Aluno / Empresa',
  },
  {
    number: '02',
    icon: Coins,
    title: 'Receba & Distribua',
    description:
      'Professores recebem 1.000 moedas por semestre e as distribuem aos alunos como reconhecimento. Alunos acumulam saldo.',
    color: 'from-amber-400 to-amber-600',
    bg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    role: 'Professor',
  },
  {
    number: '03',
    icon: Building2,
    title: 'Troque por Vantagens',
    description:
      'Alunos usam as moedas acumuladas para resgatar vantagens cadastradas pelas empresas parceiras. Cupom é enviado por email.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    role: 'Aluno',
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-28 bg-slate-50">
      <div className="container mx-auto px-6">
        <SectionHeader
          badge="Como funciona"
          title={
            <>
              Três passos para o{' '}
              <GradientText>reconhecimento</GradientText>
            </>
          }
          subtitle="Um processo simples que conecta todos os envolvidos no ecossistema educacional."
        />

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-indigo-200 via-amber-200 to-emerald-200" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={step.number} delay={i * 0.18}>
                  <div className="flex flex-col items-center text-center group">
                    {/* Step badge + icon */}
                    <div className="relative mb-6">
                      <div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-9 h-9 text-white" />
                      </div>
                      {/* Number badge */}
                      <span
                        className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br ${step.color} text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow`}
                      >
                        {step.number.slice(1)}
                      </span>
                    </div>

                    {/* Role chip */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${step.bg} mb-3`}
                    >
                      <span className={step.iconColor}>{step.role}</span>
                    </span>

                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm max-w-xs">
                      {step.description}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Building2, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

type Role = 'aluno' | 'empresa';

interface RoleSelectorProps {
  onSelect: (role: Role) => void;
}

const roles = [
  {
    id: 'aluno' as Role,
    icon: GraduationCap,
    title: 'Sou Aluno',
    description:
      'Cadastre-se para acumular moedas reconhecidas pelos seus professores e trocar por vantagens exclusivas.',
    bullets: ['Receba moedas dos professores', 'Troque por vantagens reais', 'Consulte seu extrato'],
    gradient: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200 hover:border-indigo-400',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-500',
    accent: 'text-indigo-600',
  },
  {
    id: 'empresa' as Role,
    icon: Building2,
    title: 'Sou Empresa Parceira',
    description:
      'Cadastre sua empresa e ofereça vantagens exclusivas para os alunos do sistema em troca de moedas.',
    bullets: ['Cadastre vantagens e produtos', 'Alcance novos clientes', 'Gerencie cupons gerados'],
    gradient: 'from-amber-400 to-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200 hover:border-amber-400',
    iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600',
    accent: 'text-amber-600',
  },
];

export function RoleSelector({ onSelect }: RoleSelectorProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          Bem-vindo ao{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            MoedaEstudantil
          </span>
        </h1>
        <p className="text-slate-500 text-lg">Como você quer se cadastrar?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {roles.map((role, i) => {
          const Icon = role.icon;
          return (
            <motion.button
              key={role.id}
              onClick={() => onSelect(role.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'group relative text-left rounded-2xl border-2 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer',
                role.border,
              )}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`}
              />

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl ${role.iconBg} flex items-center justify-center mb-5 shadow-lg`}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{role.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">{role.description}</p>

              {/* Bullets */}
              <ul className="space-y-2">
                {role.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                    <span
                      className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.gradient} flex-shrink-0`}
                    />
                    {b}
                  </li>
                ))}
              </ul>

              {/* Bottom bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

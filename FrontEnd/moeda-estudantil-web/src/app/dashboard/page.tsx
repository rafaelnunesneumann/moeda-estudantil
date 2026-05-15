'use client';

import { motion } from 'framer-motion';
import {
  Coins,
  ArrowDownLeft,
  ShoppingBag,
  Award,
  Tag,
  Ticket,
  TrendingUp,
  Gift,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { TransactionList, type Transaction } from '@/components/dashboard/TransactionList';

const mockAlunoTransactions: Transaction[] = [
  { id: 1, tipo: 'RECEBIMENTO', valor: 50, descricao: 'Prof. Carlos — Excelente participação em aula', data: '14/05/2026' },
  { id: 2, tipo: 'RECEBIMENTO', valor: 30, descricao: 'Prof. Ana — Destaque no projeto final', data: '12/05/2026' },
  { id: 3, tipo: 'RESGATE', valor: 40, descricao: 'Desconto no Restaurante Universitário', data: '10/05/2026' },
  { id: 4, tipo: 'RECEBIMENTO', valor: 25, descricao: 'Prof. Ricardo — Ajuda aos colegas', data: '08/05/2026' },
  { id: 5, tipo: 'RESGATE', valor: 80, descricao: 'Kit Material Escolar — Papelaria Campus', data: '05/05/2026' },
];

const mockVantagens = [
  { id: 1, descricao: 'Desconto 15% no Restaurante Universitário', custo: 40, empresa: 'RU Central' },
  { id: 2, descricao: 'Kit Material Escolar Completo', custo: 80, empresa: 'Papelaria Campus' },
  { id: 3, descricao: '20% off na mensalidade', custo: 200, empresa: 'UniEducação' },
  { id: 4, descricao: 'Café + Lanche no Café do Campus', custo: 25, empresa: 'Café Acadêmico' },
];

const mockEmpresaResgates: Transaction[] = [
  { id: 1, tipo: 'RESGATE', valor: 40, descricao: 'João Silva resgatou Desconto 15%', data: '14/05/2026' },
  { id: 2, tipo: 'RESGATE', valor: 40, descricao: 'Maria Santos resgatou Desconto 15%', data: '13/05/2026' },
  { id: 3, tipo: 'RESGATE', valor: 80, descricao: 'Pedro Costa resgatou Kit Material', data: '11/05/2026' },
  { id: 4, tipo: 'RESGATE', valor: 40, descricao: 'Ana Oliveira resgatou Desconto 15%', data: '09/05/2026' },
];

function AlunoDashboard() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">Meu Painel</h1>
        <p className="text-sm text-slate-500 mt-1">Acompanhe suas moedas e vantagens</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Saldo Atual"
          value="185"
          subtitle="moedas disponíveis"
          icon={Coins}
          gradient="from-indigo-500 to-violet-500"
          iconBg="bg-gradient-to-br from-indigo-500 to-violet-500"
          delay={0}
        />
        <StatCard
          title="Moedas Recebidas"
          value="305"
          subtitle="total acumulado"
          icon={ArrowDownLeft}
          gradient="from-emerald-500 to-teal-500"
          iconBg="bg-gradient-to-br from-emerald-500 to-teal-500"
          delay={0.1}
        />
        <StatCard
          title="Trocas Realizadas"
          value="3"
          subtitle="vantagens resgatadas"
          icon={ShoppingBag}
          gradient="from-rose-500 to-pink-500"
          iconBg="bg-gradient-to-br from-rose-500 to-pink-500"
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <div className="lg:col-span-2">
          <TransactionList transactions={mockAlunoTransactions} title="Últimas Transações" />
        </div>

        {/* Vantagens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-50">
            <h3 className="font-semibold text-slate-900">Vantagens Disponíveis</h3>
          </div>
          <ul className="divide-y divide-slate-50">
            {mockVantagens.map((v) => (
              <li key={v.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{v.descricao}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{v.empresa}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold whitespace-nowrap">
                    <Coins className="w-3 h-3" />
                    {v.custo}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

function EmpresaDashboard() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">Painel da Empresa</h1>
        <p className="text-sm text-slate-500 mt-1">Gerencie suas vantagens e acompanhe resgates</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Vantagens Ativas"
          value="4"
          subtitle="ofertas cadastradas"
          icon={Tag}
          gradient="from-amber-400 to-amber-600"
          iconBg="bg-gradient-to-br from-amber-400 to-amber-600"
          delay={0}
        />
        <StatCard
          title="Cupons Gerados"
          value="23"
          subtitle="resgates realizados"
          icon={Ticket}
          gradient="from-emerald-500 to-teal-500"
          iconBg="bg-gradient-to-br from-emerald-500 to-teal-500"
          delay={0.1}
        />
        <StatCard
          title="Total em Moedas"
          value="1.840"
          subtitle="valor movimentado"
          icon={TrendingUp}
          gradient="from-violet-500 to-purple-500"
          iconBg="bg-gradient-to-br from-violet-500 to-purple-500"
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resgates recentes */}
        <div className="lg:col-span-2">
          <TransactionList transactions={mockEmpresaResgates} title="Últimos Resgates" />
        </div>

        {/* Minhas Vantagens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Minhas Vantagens</h3>
            <span className="text-xs text-slate-400 font-medium">4 ativas</span>
          </div>
          <ul className="divide-y divide-slate-50">
            {mockVantagens.map((v) => (
              <li key={v.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{v.descricao}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">
                        <Coins className="w-2.5 h-2.5" />
                        {v.custo} moedas
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        <Gift className="w-2.5 h-2.5" />
                        Ativa
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useAuth();
  return role === 'ALUNO' ? <AlunoDashboard /> : <EmpresaDashboard />;
}

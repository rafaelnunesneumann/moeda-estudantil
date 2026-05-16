'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Award,
  Tag,
  Ticket,
  TrendingUp,
  Gift,
  Send,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { TransactionList, type Transaction } from '@/components/dashboard/TransactionList';
import { EnviarMoedasForm } from '@/components/dashboard/EnviarMoedasForm';
import { getExtrato } from '@/lib/api/transacoes';
import type { ExtratoResponseDTO } from '@/types/api';

function useExtratoData() {
  const [extrato, setExtrato] = useState<ExtratoResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    getExtrato()
      .then(setExtrato)
      .catch(() => setExtrato(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const transactions: Transaction[] = (extrato?.transacoes ?? []).map((tx) => ({
    id: tx.id,
    tipo: tx.tipo,
    valor: tx.valor,
    descricao:
      tx.tipo === 'ENVIO'
        ? `${tx.nomeDestino} — ${tx.motivo}`
        : tx.tipo === 'RECEBIMENTO'
          ? `${tx.nomeOrigem} — ${tx.motivo}`
          : tx.motivo ?? '',
    data: new Date(tx.data).toLocaleDateString('pt-BR'),
  }));

  return { extrato, transactions, loading, refresh };
}

function AlunoDashboard() {
  const { extrato, transactions, loading } = useExtratoData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const saldo = extrato?.saldo ?? 0;
  const totalRecebido = (extrato?.transacoes ?? [])
    .filter((t) => t.tipo === 'RECEBIMENTO')
    .reduce((sum, t) => sum + t.valor, 0);
  const totalResgates = (extrato?.transacoes ?? []).filter((t) => t.tipo === 'RESGATE').length;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Saldo Atual"
          value={String(saldo)}
          subtitle="moedas disponíveis"
          icon={Coins}
          gradient="from-indigo-500 to-violet-500"
          iconBg="bg-gradient-to-br from-indigo-500 to-violet-500"
          delay={0}
        />
        <StatCard
          title="Moedas Recebidas"
          value={String(totalRecebido)}
          subtitle="total acumulado"
          icon={ArrowDownLeft}
          gradient="from-emerald-500 to-teal-500"
          iconBg="bg-gradient-to-br from-emerald-500 to-teal-500"
          delay={0.1}
        />
        <StatCard
          title="Trocas Realizadas"
          value={String(totalResgates)}
          subtitle="vantagens resgatadas"
          icon={ShoppingBag}
          gradient="from-rose-500 to-pink-500"
          iconBg="bg-gradient-to-br from-rose-500 to-pink-500"
          delay={0.2}
        />
      </div>

      <TransactionList transactions={transactions} title="Todas as Transações" />
    </div>
  );
}

function ProfessorDashboard() {
  const { extrato, transactions, loading, refresh } = useExtratoData();
  const [showEnviarForm, setShowEnviarForm] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const saldo = extrato?.saldo ?? 0;
  const totalEnviado = (extrato?.transacoes ?? [])
    .filter((t) => t.tipo === 'ENVIO')
    .reduce((sum, t) => sum + t.valor, 0);
  const totalTransacoes = (extrato?.transacoes ?? []).filter((t) => t.tipo === 'ENVIO').length;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Painel do Professor</h1>
          <p className="text-sm text-slate-500 mt-1">Distribua moedas e acompanhe seus envios</p>
        </div>
        <button
          onClick={() => setShowEnviarForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
          Enviar Moedas
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Saldo Disponível"
          value={String(saldo)}
          subtitle="moedas para distribuir"
          icon={Coins}
          gradient="from-emerald-500 to-teal-500"
          iconBg="bg-gradient-to-br from-emerald-500 to-teal-500"
          delay={0}
        />
        <StatCard
          title="Moedas Enviadas"
          value={String(totalEnviado)}
          subtitle="total distribuído"
          icon={ArrowUpRight}
          gradient="from-blue-500 to-indigo-500"
          iconBg="bg-gradient-to-br from-blue-500 to-indigo-500"
          delay={0.1}
        />
        <StatCard
          title="Envios Realizados"
          value={String(totalTransacoes)}
          subtitle="reconhecimentos feitos"
          icon={Award}
          gradient="from-amber-400 to-amber-600"
          iconBg="bg-gradient-to-br from-amber-400 to-amber-600"
          delay={0.2}
        />
      </div>

      <TransactionList transactions={transactions} title="Todas as Transações" />

      <EnviarMoedasForm
        open={showEnviarForm}
        onClose={() => setShowEnviarForm(false)}
        onSuccess={refresh}
      />
    </div>
  );
}

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
        <div className="lg:col-span-2">
          <TransactionList transactions={mockEmpresaResgates} title="Últimos Resgates" />
        </div>

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

  if (role === 'PROFESSOR') return <ProfessorDashboard />;
  if (role === 'EMPRESA') return <EmpresaDashboard />;
  return <AlunoDashboard />;
}

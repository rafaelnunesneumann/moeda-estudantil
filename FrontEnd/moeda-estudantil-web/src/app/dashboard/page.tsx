'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Award,
  Tag,
  TrendingUp,
  Gift,
  Send,
  Loader2,
  Plus,
  Trash2,
  ImageOff,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { TransactionList, type Transaction } from '@/components/dashboard/TransactionList';
import { EnviarMoedasForm } from '@/components/dashboard/EnviarMoedasForm';
import { CadastrarVantagemForm } from '@/components/dashboard/CadastrarVantagemForm';
import { getExtrato } from '@/lib/api/transacoes';
import { listarMinhasVantagens, deletarVantagem } from '@/lib/api/vantagens';
import type { ExtratoResponseDTO, VantagemResponseDTO } from '@/types/api';

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

function useMinhasVantagens() {
  const [vantagens, setVantagens] = useState<VantagemResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(
    () =>
      listarMinhasVantagens()
        .then(setVantagens)
        .catch(() => setVantagens([]))
        .finally(() => setLoading(false)),
    [],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { vantagens, loading, refresh };
}

function VantagemAdminCard({
  vantagem,
  onDeleted,
}: {
  vantagem: VantagemResponseDTO;
  onDeleted: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletarVantagem(vantagem.id);
      toast.success('Vantagem removida.');
      onDeleted();
    } catch {
      toast.error('Erro ao remover vantagem.');
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="h-36 bg-slate-100 flex items-center justify-center overflow-hidden">
        {imgError ? (
          <div className="flex flex-col items-center gap-1.5 text-slate-300">
            <ImageOff className="w-6 h-6" />
            <span className="text-xs">Imagem indisponível</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vantagem.foto}
            alt={vantagem.descricao}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-medium text-slate-800 leading-relaxed flex-1">
          {vantagem.descricao}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-sm font-bold">
            <Coins className="w-3.5 h-3.5" />
            {vantagem.custoMoedas}
          </span>
          {confirming ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirmar'}
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              aria-label="Remover vantagem"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmpresaDashboard() {
  const { vantagens, loading, refresh } = useMinhasVantagens();
  const [showCadastrarForm, setShowCadastrarForm] = useState(false);

  const total = vantagens.length;
  const custoMedio =
    total > 0 ? Math.round(vantagens.reduce((s, v) => s + v.custoMoedas, 0) / total) : 0;
  const menorCusto = total > 0 ? Math.min(...vantagens.map((v) => v.custoMoedas)) : 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Painel da Empresa</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie as vantagens que você oferece aos alunos
          </p>
        </div>
        <button
          onClick={() => setShowCadastrarForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Vantagem
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Vantagens Ativas"
          value={String(total)}
          subtitle="ofertas cadastradas"
          icon={Tag}
          gradient="from-amber-400 to-amber-600"
          iconBg="bg-gradient-to-br from-amber-400 to-amber-600"
          delay={0}
        />
        <StatCard
          title="Custo Médio"
          value={total > 0 ? String(custoMedio) : '—'}
          subtitle="moedas por vantagem"
          icon={TrendingUp}
          gradient="from-violet-500 to-purple-500"
          iconBg="bg-gradient-to-br from-violet-500 to-purple-500"
          delay={0.1}
        />
        <StatCard
          title="Menor Custo"
          value={total > 0 ? String(menorCusto) : '—'}
          subtitle="vantagem mais acessível"
          icon={Coins}
          gradient="from-emerald-500 to-teal-500"
          iconBg="bg-gradient-to-br from-emerald-500 to-teal-500"
          delay={0.2}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Minhas Vantagens</h3>
          <span className="text-xs text-slate-400 font-medium">
            {total} {total === 1 ? 'ativa' : 'ativas'}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-amber-500" />
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <Gift className="w-7 h-7 text-amber-400" />
            </div>
            <h4 className="text-base font-semibold text-slate-700">Nenhuma vantagem cadastrada</h4>
            <p className="text-sm text-slate-400 mt-1 mb-5">
              Cadastre sua primeira vantagem para que os alunos possam resgatá-la.
            </p>
            <button
              onClick={() => setShowCadastrarForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm shadow-md shadow-amber-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Vantagem
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
            {vantagens.map((v) => (
              <VantagemAdminCard key={v.id} vantagem={v} onDeleted={refresh} />
            ))}
          </div>
        )}
      </motion.div>

      <CadastrarVantagemForm
        open={showCadastrarForm}
        onClose={() => setShowCadastrarForm(false)}
        onSuccess={refresh}
      />
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useAuth();

  if (role === 'PROFESSOR') return <ProfessorDashboard />;
  if (role === 'EMPRESA') return <EmpresaDashboard />;
  return <AlunoDashboard />;
}

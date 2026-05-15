'use client';

import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, ShoppingBag, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Transaction {
  id: number;
  tipo: 'RECEBIMENTO' | 'RESGATE' | 'ENVIO' | 'CREDITO_SEMESTRAL';
  valor: number;
  descricao: string;
  data: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  title: string;
}

const tipoConfig = {
  RECEBIMENTO: {
    icon: ArrowDownLeft,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    label: 'Recebimento',
    sign: '+',
  },
  RESGATE: {
    icon: ShoppingBag,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    label: 'Resgate',
    sign: '-',
  },
  ENVIO: {
    icon: ArrowUpRight,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    label: 'Envio',
    sign: '-',
  },
  CREDITO_SEMESTRAL: {
    icon: Coins,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    label: 'Crédito Semestral',
    sign: '+',
  },
};

export function TransactionList({ transactions, title }: TransactionListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-slate-50">
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>

      {transactions.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-slate-400">Nenhuma transação encontrada</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-50">
          {transactions.map((tx, i) => {
            const config = tipoConfig[tx.tipo];
            const Icon = config.icon;
            return (
              <motion.li
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', config.bg)}>
                  <Icon className={cn('w-5 h-5', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{tx.descricao}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{config.label} &middot; {tx.data}</p>
                </div>
                <span
                  className={cn(
                    'text-sm font-bold tabular-nums',
                    config.sign === '+' ? 'text-emerald-600' : 'text-rose-600',
                  )}
                >
                  {config.sign}{tx.valor} moedas
                </span>
              </motion.li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}

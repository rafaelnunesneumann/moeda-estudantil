'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Loader2, Building2, ImageOff, Gift, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { listarVantagens } from '@/lib/api/vantagens';
import { getExtrato } from '@/lib/api/transacoes';
import type { VantagemResponseDTO } from '@/types/api';

function VantagemCard({
  vantagem,
  saldo,
  isAluno,
  delay,
}: {
  vantagem: VantagemResponseDTO;
  saldo: number | null;
  isAluno: boolean;
  delay: number;
}) {
  const [imgError, setImgError] = useState(false);
  const podeResgatar = saldo === null || saldo >= vantagem.custoMoedas;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
    >
      <div className="h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
        {imgError ? (
          <div className="flex flex-col items-center gap-1.5 text-slate-300">
            <ImageOff className="w-7 h-7" />
            <span className="text-xs">Imagem indisponível</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vantagem.foto}
            alt={vantagem.descricao}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span className="truncate">{vantagem.empresaNome}</span>
        </div>

        <p className="text-sm font-medium text-slate-800 leading-relaxed flex-1">
          {vantagem.descricao}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-sm font-bold">
            <Coins className="w-3.5 h-3.5" />
            {vantagem.custoMoedas}
          </span>

          {isAluno &&
            (podeResgatar ? (
              <button
                onClick={() =>
                  toast.info('Resgate em breve', {
                    description: 'O resgate de vantagens estará disponível em breve.',
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Resgatar
              </button>
            ) : (
              <span className="text-xs font-medium text-slate-400">Saldo insuficiente</span>
            ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function VantagensPage() {
  const { role } = useAuth();
  const isAluno = role === 'ALUNO';

  const [vantagens, setVantagens] = useState<VantagemResponseDTO[]>([]);
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requests: Promise<unknown>[] = [
      listarVantagens()
        .then(setVantagens)
        .catch(() => toast.error('Erro ao carregar vantagens')),
    ];

    if (isAluno) {
      requests.push(
        getExtrato()
          .then((extrato) => setSaldo(extrato.saldo))
          .catch(() => setSaldo(null)),
      );
    }

    Promise.all(requests).finally(() => setLoading(false));
  }, [isAluno]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vantagens Disponíveis</h1>
          <p className="text-sm text-slate-500 mt-1">
            Troque suas moedas por benefícios das empresas parceiras
          </p>
        </div>
        {isAluno && saldo !== null && (
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
            <Coins className="w-4 h-4" />
            <span className="text-sm font-semibold">{saldo} moedas</span>
          </div>
        )}
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : vantagens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">Nenhuma vantagem disponível</h3>
          <p className="text-sm text-slate-400 mt-1">
            Volte em breve — novas vantagens são adicionadas pelas empresas parceiras.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vantagens.map((vantagem, i) => (
            <VantagemCard
              key={vantagem.id}
              vantagem={vantagem}
              saldo={saldo}
              isAluno={isAluno}
              delay={Math.min(i * 0.05, 0.3)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

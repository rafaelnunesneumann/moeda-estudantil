'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Loader2,
  Building2,
  ImageOff,
  Gift,
  ShoppingBag,
  X,
  Check,
  Copy,
  Ticket,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

import { useAuth } from '@/contexts/AuthContext';
import { listarVantagens, resgatarVantagem } from '@/lib/api/vantagens';
import { getExtrato } from '@/lib/api/transacoes';
import type { ApiErrorResponse, CupomResponseDTO, VantagemResponseDTO } from '@/types/api';

function VantagemCard({
  vantagem,
  saldo,
  isAluno,
  onResgatar,
  delay,
}: {
  vantagem: VantagemResponseDTO;
  saldo: number | null;
  isAluno: boolean;
  onResgatar: (vantagem: VantagemResponseDTO) => void;
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
                onClick={() => onResgatar(vantagem)}
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

function ConfirmarResgateModal({
  vantagem,
  saldo,
  loading,
  onConfirm,
  onClose,
}: {
  vantagem: VantagemResponseDTO | null;
  saldo: number | null;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const saldoApos = vantagem && saldo !== null ? saldo - vantagem.custoMoedas : null;

  return (
    <AnimatePresence>
      {vantagem && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={() => !loading && onClose()}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-sm">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Confirmar Resgate</h3>
                    <p className="text-xs text-slate-400">Troque suas moedas por esta vantagem</p>
                  </div>
                </div>
                <button
                  onClick={() => !loading && onClose()}
                  disabled={loading}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="truncate">{vantagem.empresaNome}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {vantagem.descricao}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Custo da vantagem</span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-rose-600">
                      <Coins className="w-3.5 h-3.5" />− {vantagem.custoMoedas} moedas
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Saldo atual</span>
                    <span className="font-semibold text-slate-700">
                      {saldo ?? '—'} moedas
                    </span>
                  </div>
                  {saldoApos !== null && (
                    <div className="flex items-center justify-between text-sm pt-2.5 border-t border-slate-100">
                      <span className="text-slate-500">Saldo após o resgate</span>
                      <span className="font-bold text-indigo-600">{saldoApos} moedas</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100">
                <button
                  onClick={() => !loading && onClose()}
                  disabled={loading}
                  className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resgatando...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Confirmar Resgate
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CupomSucessoModal({
  cupom,
  onClose,
}: {
  cupom: CupomResponseDTO | null;
  onClose: () => void;
}) {
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = async () => {
    if (!cupom) return;
    try {
      await navigator.clipboard.writeText(cupom.codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error('Não foi possível copiar o código');
    }
  };

  return (
    <AnimatePresence>
      {cupom && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-500 to-violet-500 px-6 pt-7 pb-6 text-center relative">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-2 rounded-lg hover:bg-white/15 text-white/80 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-3">
                  <Check className="w-7 h-7 text-white" strokeWidth={3} />
                </div>
                <h3 className="text-lg font-bold text-white">Resgate confirmado!</h3>
                <p className="text-sm text-indigo-100 mt-1">
                  Apresente o código abaixo na troca presencial
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold text-center mb-2">
                    Código do Cupom
                  </p>
                  <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-4">
                    <Ticket className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span className="text-2xl font-extrabold tracking-[0.3em] text-indigo-700 font-mono">
                      {cupom.codigo}
                    </span>
                    <button
                      onClick={copiarCodigo}
                      className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-500 cursor-pointer flex-shrink-0"
                      aria-label="Copiar código"
                    >
                      {copiado ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100">
                  <div className="px-4 py-3">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Vantagem
                    </p>
                    <p className="text-sm font-medium text-slate-800 mt-0.5">
                      {cupom.vantagemDescricao}
                    </p>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-slate-500">Empresa</span>
                    <span className="text-sm font-medium text-slate-700">{cupom.empresaNome}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-slate-500">Moedas utilizadas</span>
                    <span className="text-sm font-bold text-rose-600">− {cupom.custoMoedas}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-slate-500">Saldo atual</span>
                    <span className="text-sm font-bold text-indigo-600">{cupom.novoSaldo} moedas</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  Enviamos o código para o seu email. A empresa parceira também recebeu uma cópia
                  para conferência.
                </p>

                <button
                  onClick={onClose}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function VantagensPage() {
  const { role } = useAuth();
  const isAluno = role === 'ALUNO';

  const [vantagens, setVantagens] = useState<VantagemResponseDTO[]>([]);
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [confirmando, setConfirmando] = useState<VantagemResponseDTO | null>(null);
  const [resgatando, setResgatando] = useState(false);
  const [cupom, setCupom] = useState<CupomResponseDTO | null>(null);

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

  const handleConfirmarResgate = async () => {
    if (!confirmando) return;
    setResgatando(true);
    try {
      const result = await resgatarVantagem(confirmando.id);
      setSaldo(result.novoSaldo);
      setConfirmando(null);
      setCupom(result);
      toast.success('Vantagem resgatada com sucesso!');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiErr = err.response?.data as ApiErrorResponse;
        toast.error('Não foi possível resgatar', {
          description: apiErr?.message || 'Verifique seu saldo e tente novamente.',
        });
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    } finally {
      setResgatando(false);
    }
  };

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
              onResgatar={setConfirmando}
              delay={Math.min(i * 0.05, 0.3)}
            />
          ))}
        </div>
      )}

      <ConfirmarResgateModal
        vantagem={confirmando}
        saldo={saldo}
        loading={resgatando}
        onConfirm={handleConfirmarResgate}
        onClose={() => setConfirmando(null)}
      />

      <CupomSucessoModal cupom={cupom} onClose={() => setCupom(null)} />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Coins, Loader2, Send, X, ChevronDown, Search, Check, GraduationCap } from 'lucide-react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AlunoResponseDTO, ApiErrorResponse } from '@/types/api';
import { enviarMoedas, listarAlunosDaInstituicao } from '@/lib/api/transacoes';

const enviarMoedasSchema = z.object({
  alunoId: z.number().min(1, 'Selecione um aluno'),
  valor: z.number().min(0.01, 'Valor deve ser positivo'),
  motivo: z.string().min(1, 'Motivo é obrigatório'),
});

type EnviarMoedasFormData = z.infer<typeof enviarMoedasSchema>;

interface EnviarMoedasFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AlunoSelectProps {
  value: number | undefined;
  onChange: (v: number) => void;
  alunos: AlunoResponseDTO[];
  loading: boolean;
  error?: string;
}

function AlunoSelect({ value, onChange, alunos, loading, error }: AlunoSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = alunos.find((a) => a.id === value);
  const filtered = query
    ? alunos.filter(
        (a) =>
          a.nome.toLowerCase().includes(query.toLowerCase()) ||
          a.curso.toLowerCase().includes(query.toLowerCase()) ||
          a.email.toLowerCase().includes(query.toLowerCase()),
      )
    : alunos;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-11 px-3 flex items-center justify-between rounded-lg border bg-white text-sm transition-all cursor-pointer
          ${error ? 'border-rose-400 focus:ring-rose-300' : 'border-slate-200 hover:border-emerald-400 focus:border-emerald-500'}
          ${open ? 'border-emerald-500 ring-2 ring-emerald-100' : ''}
          ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Carregando alunos...
          </span>
        ) : selected ? (
          <span className="flex items-center gap-2 text-slate-800 truncate pr-2">
            <GraduationCap className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="truncate">{selected.nome}</span>
            <span className="text-xs text-slate-400 flex-shrink-0">— {selected.curso}</span>
          </span>
        ) : (
          <span className="text-slate-400">Selecione um aluno</span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute z-[70] mt-1.5 w-full bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="p-2 border-b border-slate-100">
                <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-slate-50 border border-slate-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
                  <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <input
                    autoFocus
                    className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400"
                    placeholder="Buscar por nome, curso ou email..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <ul className="max-h-56 overflow-y-auto py-1">
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-slate-400 text-center">
                    Nenhum aluno encontrado
                  </li>
                ) : (
                  filtered.map((aluno) => (
                    <li key={aluno.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(aluno.id);
                          setOpen(false);
                          setQuery('');
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors cursor-pointer
                          ${value === aluno.id
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${value === aluno.id ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                            <GraduationCap className={`w-4 h-4 ${value === aluno.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm truncate ${value === aluno.id ? 'font-medium' : ''}`}>
                              {aluno.nome}
                            </p>
                            <p className="text-xs text-slate-400 truncate">{aluno.curso}</p>
                          </div>
                        </div>
                        {value === aluno.id && (
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function EnviarMoedasForm({ open, onClose, onSuccess }: EnviarMoedasFormProps) {
  const [alunos, setAlunos] = useState<AlunoResponseDTO[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EnviarMoedasFormData>({ resolver: zodResolver(enviarMoedasSchema) });

  useEffect(() => {
    if (open) {
      setLoadingAlunos(true);
      listarAlunosDaInstituicao()
        .then(setAlunos)
        .catch(() => toast.error('Erro ao carregar alunos'))
        .finally(() => setLoadingAlunos(false));
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: EnviarMoedasFormData) => {
    try {
      await enviarMoedas({
        alunoId: data.alunoId,
        valor: data.valor,
        motivo: data.motivo,
      });
      toast.success('Moedas enviadas com sucesso!');
      onSuccess();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiErr = err.response?.data as ApiErrorResponse;
        toast.error('Erro ao enviar moedas', {
          description: apiErr?.message || 'Verifique os dados e tente novamente.',
        });
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
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
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Enviar Moedas</h3>
                    <p className="text-xs text-slate-400">Reconheça o mérito de um aluno</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5" noValidate>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-medium text-sm">
                    Aluno <span className="text-rose-500 ml-0.5">*</span>
                  </Label>
                  <Controller
                    name="alunoId"
                    control={control}
                    render={({ field }) => (
                      <AlunoSelect
                        value={field.value}
                        onChange={(v) => setValue('alunoId', v, { shouldValidate: true })}
                        alunos={alunos}
                        loading={loadingAlunos}
                        error={errors.alunoId?.message}
                      />
                    )}
                  />
                  {errors.alunoId && (
                    <p className="text-rose-500 text-xs mt-1">{errors.alunoId.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-medium text-sm">
                    Valor (moedas) <span className="text-rose-500 ml-0.5">*</span>
                  </Label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Ex: 50"
                      className="h-11 pl-10"
                      {...register('valor', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.valor && (
                    <p className="text-rose-500 text-xs mt-1">{errors.valor.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-medium text-sm">
                    Motivo <span className="text-rose-500 ml-0.5">*</span>
                  </Label>
                  <textarea
                    rows={3}
                    placeholder="Descreva o motivo do reconhecimento..."
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    {...register('motivo')}
                  />
                  {errors.motivo && (
                    <p className="text-rose-500 text-xs mt-1">{errors.motivo.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || loadingAlunos}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-base border-0 shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Moedas
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

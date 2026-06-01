'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Coins, Loader2, Tag, X, ImageOff } from 'lucide-react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ApiErrorResponse } from '@/types/api';
import { cadastrarVantagem } from '@/lib/api/vantagens';

const vantagemSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(1000, 'Máximo de 1000 caracteres'),
  foto: z.string().min(1, 'Foto é obrigatória').url('Informe uma URL de imagem válida'),
  custoMoedas: z.number().min(0.01, 'Custo deve ser positivo'),
});

type VantagemFormData = z.infer<typeof vantagemSchema>;

interface CadastrarVantagemFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CadastrarVantagemForm({ open, onClose, onSuccess }: CadastrarVantagemFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VantagemFormData>({ resolver: zodResolver(vantagemSchema) });

  const [previewError, setPreviewError] = useState(false);
  const fotoUrl = watch('foto');

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  useEffect(() => {
    setPreviewError(false);
  }, [fotoUrl]);

  const onSubmit = async (data: VantagemFormData) => {
    try {
      await cadastrarVantagem(data);
      toast.success('Vantagem cadastrada com sucesso!', {
        description: 'Os alunos já podem visualizá-la.',
      });
      onSuccess();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiErr = err.response?.data as ApiErrorResponse;
        toast.error('Erro ao cadastrar vantagem', {
          description: apiErr?.message || apiErr?.errors?.join(', ') || 'Tente novamente.',
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Cadastrar Vantagem</h3>
                    <p className="text-xs text-slate-400">Ofereça um benefício aos alunos</p>
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
                    Descrição <span className="text-rose-500 ml-0.5">*</span>
                  </Label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Desconto de 15% no Restaurante Universitário"
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    {...register('descricao')}
                  />
                  {errors.descricao && (
                    <p className="text-rose-500 text-xs mt-1">{errors.descricao.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-medium text-sm">
                    Foto (URL) <span className="text-rose-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://exemplo.com/produto.jpg"
                    className="h-11"
                    {...register('foto')}
                  />
                  {errors.foto ? (
                    <p className="text-rose-500 text-xs mt-1">{errors.foto.message}</p>
                  ) : (
                    <p className="text-slate-400 text-xs mt-1">Cole o link de uma imagem do produto.</p>
                  )}

                  {fotoUrl && !errors.foto && (
                    <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden h-36 flex items-center justify-center">
                      {previewError ? (
                        <div className="flex flex-col items-center gap-1.5 text-slate-400">
                          <ImageOff className="w-6 h-6" />
                          <span className="text-xs">Não foi possível carregar a imagem</span>
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={fotoUrl}
                          alt="Pré-visualização da vantagem"
                          className="w-full h-full object-cover"
                          onError={() => setPreviewError(true)}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-medium text-sm">
                    Custo (moedas) <span className="text-rose-500 ml-0.5">*</span>
                  </Label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Ex: 50"
                      className="h-11 pl-10"
                      {...register('custoMoedas', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.custoMoedas && (
                    <p className="text-rose-500 text-xs mt-1">{errors.custoMoedas.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-base border-0 shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <Tag className="w-4 h-4 mr-2" />
                      Cadastrar Vantagem
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

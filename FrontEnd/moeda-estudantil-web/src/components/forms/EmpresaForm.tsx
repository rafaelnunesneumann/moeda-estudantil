'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { IMaskInput } from 'react-imask';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cadastrarEmpresa } from '@/lib/api/empresas';
import type { ApiErrorResponse } from '@/types/api';

const stripMask = (v: string) => v.replace(/\D/g, '');

const empresaSchema = z.object({
  nome: z.string().min(1, 'Nome da empresa é obrigatório'),
  cnpj: z.string().length(14, 'CNPJ deve ter 14 dígitos'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Mínimo de 6 caracteres'),
});

type EmpresaFormData = z.infer<typeof empresaSchema>;

interface EmpresaFormProps {
  onBack: () => void;
}

interface FieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}

function FieldWrapper({ label, error, children, required, hint }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-700 font-medium text-sm">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-slate-400 text-xs mt-1">{hint}</p>}
      {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function EmpresaForm({ onBack }: EmpresaFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmpresaFormData>({ resolver: zodResolver(empresaSchema) });

  const onSubmit = async (data: EmpresaFormData) => {
    try {
      await cadastrarEmpresa(data);
      setSuccess(true);
      toast.success('Empresa cadastrada com sucesso!', {
        description: 'Bem-vindo ao MoedaEstudantil.',
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiErr = err.response?.data as ApiErrorResponse;
        const message =
          apiErr?.errors?.join(', ') ||
          apiErr?.message ||
          'Erro ao realizar cadastro. Tente novamente.';
        toast.error('Erro no cadastro', { description: message });
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-16"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <span className="text-4xl">🏢</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Empresa cadastrada!</h2>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          Sua empresa foi cadastrada com sucesso. Agora você pode oferecer vantagens aos alunos.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30 hover:brightness-110 transition-all cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5" /> Fazer login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cadastro de Empresa Parceira</h2>
          <p className="text-slate-500 text-sm">Preencha os dados da sua empresa</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

          {/* Company data */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Dados da Empresa
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FieldWrapper label="Nome da empresa" error={errors.nome?.message} required>
                <Input placeholder="Empresa Parceira Ltda." className="h-11" {...register('nome')} />
              </FieldWrapper>

              {/* CNPJ with mask */}
              <FieldWrapper label="CNPJ" error={errors.cnpj?.message} required>
                <Controller
                  name="cnpj"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="00.000.000/0000-00"
                      placeholder="00.000.000/0000-00"
                      value={field.value ?? ''}
                      onAccept={(val: string) => field.onChange(stripMask(val))}
                      className={`flex h-11 w-full rounded-md border px-3 py-2 text-sm bg-white outline-none transition-all
                        placeholder:text-slate-400
                        ${errors.cnpj ? 'border-rose-400 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100'}`}
                    />
                  )}
                />
              </FieldWrapper>
            </div>
          </div>

          {/* Access data */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Acesso ao Sistema
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FieldWrapper label="Email corporativo" error={errors.email?.message} required>
                <Input type="email" placeholder="contato@empresa.com" className="h-11" {...register('email')} />
              </FieldWrapper>

              <FieldWrapper label="Senha" error={errors.senha?.message} required>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    className="h-11 pr-12"
                    {...register('senha')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FieldWrapper>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-base border-0 shadow-lg shadow-amber-500/25 mt-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar Empresa Parceira'
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}


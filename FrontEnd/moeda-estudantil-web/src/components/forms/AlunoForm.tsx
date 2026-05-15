'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff, Loader2, ChevronDown, Search, Check, LogIn } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { IMaskInput } from 'react-imask';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { cadastrarAluno } from '@/lib/api/alunos';
import { useInstituicoes } from '@/hooks/useInstituicoes';
import type { ApiErrorResponse, InstituicaoEnsinoResponseDTO } from '@/types/api';

const stripMask = (v: string) => v.replace(/\D/g, '');

const alunoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Mínimo de 6 caracteres'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  rg: z.string().min(1, 'RG é obrigatório'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  curso: z.string().min(1, 'Curso é obrigatório'),
  instituicaoId: z.number().min(1, 'Selecione uma instituição'),
});

type AlunoFormData = z.infer<typeof alunoSchema>;

interface AlunoFormProps {
  onBack: () => void;
}

interface FieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

function FieldWrapper({ label, error, children, required }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-700 font-medium text-sm">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Custom institution combobox
// ──────────────────────────────────────────────────────────────
interface InstSelectProps {
  value: number | undefined;
  onChange: (v: number) => void;
  instituicoes: InstituicaoEnsinoResponseDTO[];
  loading: boolean;
  error?: string;
}

function InstituicaoSelect({ value, onChange, instituicoes, loading, error }: InstSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = instituicoes.find((i) => i.id === value);
  const filtered = query
    ? instituicoes.filter((i) => i.nome.toLowerCase().includes(query.toLowerCase()))
    : instituicoes;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-11 px-3 flex items-center justify-between rounded-md border bg-white text-sm transition-all cursor-pointer
          ${error ? 'border-rose-400 focus:ring-rose-300' : 'border-slate-200 hover:border-indigo-400 focus:border-indigo-500'}
          ${open ? 'border-indigo-500 ring-2 ring-indigo-100' : ''}
          ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        <span className={selected ? 'text-slate-800 truncate pr-2' : 'text-slate-400'}>
          {loading ? 'Carregando instituições...' : selected ? selected.nome : 'Selecione a instituição'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 mt-1.5 w-full bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
            >
              {/* Search */}
              <div className="p-2 border-b border-slate-100">
                <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-slate-50 border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                  <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <input
                    autoFocus
                    className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400"
                    placeholder="Buscar instituição..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Options */}
              <ul className="max-h-56 overflow-y-auto py-1">
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-slate-400 text-center">Nenhuma encontrada</li>
                ) : (
                  filtered.map((inst) => (
                    <li key={inst.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(inst.id);
                          setOpen(false);
                          setQuery('');
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors cursor-pointer
                          ${value === inst.id
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        <span className="truncate">{inst.nome}</span>
                        {value === inst.id && <Check className="w-4 h-4 text-indigo-500 flex-shrink-0 ml-2" />}
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

// ──────────────────────────────────────────────────────────────
// Main form
// ──────────────────────────────────────────────────────────────
export function AlunoForm({ onBack }: AlunoFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { instituicoes, loading: loadingInst } = useInstituicoes();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AlunoFormData>({ resolver: zodResolver(alunoSchema) });

  const onSubmit = async (data: AlunoFormData) => {
    try {
      await cadastrarAluno(data);
      setSuccess(true);
      toast.success('Cadastro realizado com sucesso!', {
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
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <span className="text-4xl">🎓</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Cadastro concluído!</h2>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          Seu cadastro foi realizado com sucesso. Agora você faz parte do MoedaEstudantil.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:brightness-110 transition-all cursor-pointer"
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
          <h2 className="text-2xl font-bold text-slate-900">Cadastro de Aluno</h2>
          <p className="text-slate-500 text-sm">Preencha seus dados para criar sua conta</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

          {/* Personal data */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Dados Pessoais
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FieldWrapper label="Nome completo" error={errors.nome?.message} required>
                <Input placeholder="João da Silva" className="h-11" {...register('nome')} />
              </FieldWrapper>

              <FieldWrapper label="Email" error={errors.email?.message} required>
                <Input type="email" placeholder="joao@email.com" className="h-11" {...register('email')} />
              </FieldWrapper>

              {/* CPF with mask */}
              <FieldWrapper label="CPF" error={errors.cpf?.message} required>
                <Controller
                  name="cpf"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="000.000.000-00"
                      placeholder="000.000.000-00"
                      value={field.value ?? ''}
                      onAccept={(val: string) => field.onChange(stripMask(val))}
                      className={`flex h-11 w-full rounded-md border px-3 py-2 text-sm bg-white outline-none transition-all
                        placeholder:text-slate-400
                        ${errors.cpf ? 'border-rose-400 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
                    />
                  )}
                />
              </FieldWrapper>

              {/* RG with mask */}
              <FieldWrapper label="RG" error={errors.rg?.message} required>
                <Controller
                  name="rg"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="00.000.000-*"
                      placeholder="00.000.000-0"
                      value={field.value ?? ''}
                      onAccept={(val: string) => field.onChange(val)}
                      className={`flex h-11 w-full rounded-md border px-3 py-2 text-sm bg-white outline-none transition-all
                        placeholder:text-slate-400
                        ${errors.rg ? 'border-rose-400 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
                    />
                  )}
                />
              </FieldWrapper>
            </div>
          </div>

          {/* Academic data */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Dados Acadêmicos
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FieldWrapper label="Curso" error={errors.curso?.message} required>
                <Input placeholder="Ciências da Computação" className="h-11" {...register('curso')} />
              </FieldWrapper>

              <FieldWrapper label="Instituição de Ensino" error={errors.instituicaoId?.message} required>
                <Controller
                  name="instituicaoId"
                  control={control}
                  render={({ field }) => (
                    <InstituicaoSelect
                      value={field.value}
                      onChange={(v) => setValue('instituicaoId', v, { shouldValidate: true })}
                      instituicoes={instituicoes}
                      loading={loadingInst}
                      error={errors.instituicaoId?.message}
                    />
                  )}
                />
              </FieldWrapper>

              <div className="md:col-span-2">
                <FieldWrapper label="Endereço" error={errors.endereco?.message} required>
                  <Input placeholder="Rua Exemplo, 123 — Cidade" className="h-11" {...register('endereco')} />
                </FieldWrapper>
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Segurança
            </h3>
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-base border-0 shadow-lg shadow-indigo-500/25 mt-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Cadastrando...
              </>
            ) : (
              'Criar conta de Aluno'
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}


'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Pencil,
  X,
  Save,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  Mail,
  MapPin,
  CreditCard,
  BookOpen,
  School,
} from 'lucide-react';
import axios from 'axios';
import { IMaskInput } from 'react-imask';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituicoes } from '@/hooks/useInstituicoes';
import { atualizarAluno, atualizarEmpresa, deletarAluno, deletarEmpresa } from '@/lib/api/auth';
import type { ApiErrorResponse } from '@/types/api';

const stripMask = (v: string) => v.replace(/\D/g, '');

const alunoEditSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().optional().refine((v) => !v || v.length >= 6, 'Mínimo de 6 caracteres'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  rg: z.string().min(1, 'RG é obrigatório'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  curso: z.string().min(1, 'Curso é obrigatório'),
  instituicaoId: z.number().min(1, 'Selecione uma instituição'),
});

const empresaEditSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().optional().refine((v) => !v || v.length >= 6, 'Mínimo de 6 caracteres'),
  cnpj: z.string().length(14, 'CNPJ deve ter 14 dígitos'),
});

type AlunoEditData = z.infer<typeof alunoEditSchema>;
type EmpresaEditData = z.infer<typeof empresaEditSchema>;

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm text-slate-800 font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function AlunoProfile() {
  const { user, refreshUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { instituicoes, loading: loadingInst } = useInstituicoes();

  const aluno = user?.role === 'ALUNO' ? user : null;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AlunoEditData>({
    resolver: zodResolver(alunoEditSchema),
    defaultValues: aluno
      ? {
          nome: aluno.nome,
          email: aluno.email,
          cpf: aluno.cpf,
          rg: aluno.rg,
          endereco: aluno.endereco,
          curso: aluno.curso,
          instituicaoId: aluno.instituicao.id,
          senha: '',
        }
      : undefined,
  });

  if (!aluno) return null;

  const onSubmit = async (data: AlunoEditData) => {
    try {
      const payload = {
        ...data,
        senha: data.senha || aluno.email,
      };
      await atualizarAluno(aluno.id, payload);
      await refreshUser();
      setEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiErr = err.response?.data as ApiErrorResponse;
        toast.error('Erro ao atualizar', {
          description: apiErr?.message || apiErr?.errors?.join(', ') || 'Tente novamente.',
        });
      } else {
        toast.error('Erro inesperado.');
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletarAluno(aluno.id);
      toast.success('Conta excluída com sucesso.');
      logout();
    } catch {
      toast.error('Erro ao excluir conta.');
      setDeleting(false);
    }
  };

  if (!editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{aluno.nome}</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mt-1">
                Aluno
              </span>
            </div>
          </div>
          <Button
            onClick={() => setEditing(true)}
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Dados Pessoais
            </h3>
            <InfoRow icon={<Mail className="w-4 h-4 text-slate-400" />} label="Email" value={aluno.email} />
            <InfoRow icon={<CreditCard className="w-4 h-4 text-slate-400" />} label="CPF" value={aluno.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')} />
            <InfoRow icon={<CreditCard className="w-4 h-4 text-slate-400" />} label="RG" value={aluno.rg} />
            <InfoRow icon={<MapPin className="w-4 h-4 text-slate-400" />} label="Endereço" value={aluno.endereco} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Dados Acadêmicos
            </h3>
            <InfoRow icon={<BookOpen className="w-4 h-4 text-slate-400" />} label="Curso" value={aluno.curso} />
            <InfoRow icon={<School className="w-4 h-4 text-slate-400" />} label="Instituição" value={aluno.instituicao.nome} />
          </div>
        </div>

        {/* Delete */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-2">
            Zona de Perigo
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            A exclusão da conta é permanente e não pode ser desfeita.
          </p>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-3">
              <Button onClick={handleDelete} disabled={deleting} variant="destructive" size="sm" className="gap-2 cursor-pointer">
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Confirmar exclusão
              </Button>
              <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" size="sm" className="cursor-pointer">
                Cancelar
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowDeleteConfirm(true)} variant="outline" size="sm" className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" />
              Excluir minha conta
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Editar Perfil</h2>
        <Button
          onClick={() => {
            setEditing(false);
            reset();
          }}
          variant="ghost"
          size="sm"
          className="gap-2 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          Cancelar
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Dados Pessoais</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">Nome completo</Label>
                <Input className="h-11" {...register('nome')} />
                {errors.nome && <p className="text-rose-500 text-xs">{errors.nome.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">Email</Label>
                <Input type="email" className="h-11" {...register('email')} />
                {errors.email && <p className="text-rose-500 text-xs">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">CPF</Label>
                <Controller
                  name="cpf"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="000.000.000-00"
                      value={field.value ?? ''}
                      onAccept={(val: string) => field.onChange(stripMask(val))}
                      className="flex h-11 w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  )}
                />
                {errors.cpf && <p className="text-rose-500 text-xs">{errors.cpf.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">RG</Label>
                <Controller
                  name="rg"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="00.000.000-*"
                      value={field.value ?? ''}
                      onAccept={(val: string) => field.onChange(val)}
                      className="flex h-11 w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  )}
                />
                {errors.rg && <p className="text-rose-500 text-xs">{errors.rg.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Dados Acadêmicos</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">Curso</Label>
                <Input className="h-11" {...register('curso')} />
                {errors.curso && <p className="text-rose-500 text-xs">{errors.curso.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">Instituição</Label>
                <select
                  className="flex h-11 w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  disabled={loadingInst}
                  onChange={(e) => setValue('instituicaoId', Number(e.target.value), { shouldValidate: true })}
                  defaultValue={aluno.instituicao.id}
                >
                  {instituicoes.map((inst) => (
                    <option key={inst.id} value={inst.id}>{inst.nome}</option>
                  ))}
                </select>
                {errors.instituicaoId && <p className="text-rose-500 text-xs">{errors.instituicaoId.message}</p>}
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">Endereço</Label>
                <Input className="h-11" {...register('endereco')} />
                {errors.endereco && <p className="text-rose-500 text-xs">{errors.endereco.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Segurança</h3>
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-medium text-sm">Nova Senha (deixe vazio para manter)</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nova senha (opcional)"
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
              {errors.senha && <p className="text-rose-500 text-xs">{errors.senha.message}</p>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-base border-0 shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Salvando...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Salvar alterações</>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

function EmpresaProfile() {
  const { user, refreshUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const empresa = user?.role === 'EMPRESA' ? user : null;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmpresaEditData>({
    resolver: zodResolver(empresaEditSchema),
    defaultValues: empresa
      ? { nome: empresa.nome, email: empresa.email, cnpj: empresa.cnpj, senha: '' }
      : undefined,
  });

  if (!empresa) return null;

  const onSubmit = async (data: EmpresaEditData) => {
    try {
      const payload = {
        ...data,
        senha: data.senha || empresa.email,
      };
      await atualizarEmpresa(empresa.id, payload);
      await refreshUser();
      setEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiErr = err.response?.data as ApiErrorResponse;
        toast.error('Erro ao atualizar', {
          description: apiErr?.message || apiErr?.errors?.join(', ') || 'Tente novamente.',
        });
      } else {
        toast.error('Erro inesperado.');
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletarEmpresa(empresa.id);
      toast.success('Conta excluída com sucesso.');
      logout();
    } catch {
      toast.error('Erro ao excluir conta.');
      setDeleting(false);
    }
  };

  if (!editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{empresa.nome}</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mt-1">
                Empresa Parceira
              </span>
            </div>
          </div>
          <Button
            onClick={() => setEditing(true)}
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Dados da Empresa
            </h3>
            <InfoRow icon={<Mail className="w-4 h-4 text-slate-400" />} label="Email" value={empresa.email} />
            <InfoRow icon={<CreditCard className="w-4 h-4 text-slate-400" />} label="CNPJ" value={empresa.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')} />
          </div>

          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-2">
            Zona de Perigo
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            A exclusão da conta é permanente e não pode ser desfeita.
          </p>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-3">
              <Button onClick={handleDelete} disabled={deleting} variant="destructive" size="sm" className="gap-2 cursor-pointer">
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Confirmar exclusão
              </Button>
              <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" size="sm" className="cursor-pointer">
                Cancelar
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowDeleteConfirm(true)} variant="outline" size="sm" className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" />
              Excluir minha conta
            </Button>
          )}
        </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Editar Perfil</h2>
        <Button
          onClick={() => {
            setEditing(false);
            reset();
          }}
          variant="ghost"
          size="sm"
          className="gap-2 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          Cancelar
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Dados da Empresa</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">Nome da empresa</Label>
                <Input className="h-11" {...register('nome')} />
                {errors.nome && <p className="text-rose-500 text-xs">{errors.nome.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">CNPJ</Label>
                <Controller
                  name="cnpj"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="00.000.000/0000-00"
                      value={field.value ?? ''}
                      onAccept={(val: string) => field.onChange(stripMask(val))}
                      className="flex h-11 w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />
                  )}
                />
                {errors.cnpj && <p className="text-rose-500 text-xs">{errors.cnpj.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Acesso</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">Email corporativo</Label>
                <Input type="email" className="h-11" {...register('email')} />
                {errors.email && <p className="text-rose-500 text-xs">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">Nova Senha (opcional)</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Deixe vazio para manter"
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
                {errors.senha && <p className="text-rose-500 text-xs">{errors.senha.message}</p>}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-base border-0 shadow-lg shadow-amber-500/25 cursor-pointer"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Salvando...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Salvar alterações</>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

export default function PerfilPage() {
  const { role } = useAuth();

  return (
    <div className="w-full max-w-5xl mx-auto pb-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-slate-900">Meu Perfil</h1>
        <p className="text-sm text-slate-500 mt-1">Visualize e gerencie suas informações</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {role === 'ALUNO' ? <AlunoProfile key="aluno" /> : <EmpresaProfile key="empresa" />}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { Coins, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import type { ApiErrorResponse } from '@/types/api';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.senha);
      toast.success('Login realizado com sucesso!');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiErr = err.response?.data as ApiErrorResponse;
        toast.error('Erro no login', {
          description: apiErr?.message || 'Email ou senha inválidos.',
        });
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 flex flex-col">
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-slate-900 hover:text-indigo-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Coins className="w-4 h-4 text-white" />
            </div>
            <span>MoedaEstudantil</span>
          </Link>
          <Link
            href="/cadastro"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Não tem conta?{' '}
            <span className="text-indigo-600 font-medium hover:underline">Cadastre-se</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/25">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h1>
            <p className="text-slate-500 text-sm mt-1">
              Acesse sua conta no MoedaEstudantil
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">
                  Email <span className="text-rose-500 ml-0.5">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className="h-11"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium text-sm">
                  Senha <span className="text-rose-500 ml-0.5">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
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
                {errors.senha && (
                  <p className="text-rose-500 text-xs mt-1">{errors.senha.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-base border-0 shadow-lg shadow-indigo-500/25 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">
            Alunos e Empresas Parceiras podem fazer login aqui.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

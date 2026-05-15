'use client';

import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const { user, role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Olá, {user?.nome?.split(' ')[0]}
            </h2>
            <p className="text-xs text-slate-400">
              {role === 'ALUNO' ? 'Painel do Aluno' : 'Painel da Empresa'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold',
              role === 'ALUNO'
                ? 'bg-indigo-50 text-indigo-700'
                : 'bg-amber-50 text-amber-700',
            )}
          >
            {user?.email}
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

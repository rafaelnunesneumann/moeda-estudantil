'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  LayoutDashboard,
  UserCircle,
  LogOut,
  X,
  GraduationCap,
  Building2,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

import type { UserRole } from '@/types/api';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Meu Perfil', href: '/dashboard/perfil', icon: UserCircle },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">
            Moeda<span className="text-indigo-600">Estudantil</span>
          </span>
        </Link>
      </div>

      {/* User card */}
      <div className="px-4 py-5">
        <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shadow-sm',
                role === 'ALUNO'
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-500'
                  : role === 'PROFESSOR'
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                    : 'bg-gradient-to-br from-amber-400 to-amber-600',
              )}
            >
              {role === 'ALUNO' ? (
                <GraduationCap className="w-5 h-5 text-white" />
              ) : role === 'PROFESSOR' ? (
                <BookOpen className="w-5 h-5 text-white" />
              ) : (
                <Building2 className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.nome}</p>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-0.5',
                  role === 'ALUNO'
                    ? 'bg-indigo-100 text-indigo-700'
                    : role === 'PROFESSOR'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700',
                )}
              >
                {role === 'ALUNO' ? 'Aluno' : role === 'PROFESSOR' ? 'Professor' : 'Empresa'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems
          .filter((item) => !item.roles || (role && item.roles.includes(role)))
          .map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            const activeColor = role === 'PROFESSOR' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700';
            const activeIcon = role === 'PROFESSOR' ? 'text-emerald-600' : 'text-indigo-600';
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  active
                    ? `${activeColor} shadow-sm`
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                )}
              >
                <Icon className={cn('w-5 h-5', active ? activeIcon : 'text-slate-400')} />
                {item.label}
              </Link>
            );
          })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white border-r border-slate-100 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

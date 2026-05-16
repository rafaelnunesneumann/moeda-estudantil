'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser, LoginResponseDTO, UserRole } from '@/types/api';
import { login as apiLogin, getMe } from '@/lib/api/auth';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    setToken(null);
    setUser(null);
    setRole(null);
    router.push('/login');
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const storedRole = localStorage.getItem('user_role') as UserRole | null;
      const profile = await getMe();

      if (storedRole === 'ALUNO' && 'rg' in profile) {
        setUser({ ...profile, role: 'ALUNO' } as AuthUser);
      } else if (storedRole === 'PROFESSOR' && 'departamento' in profile) {
        setUser({ ...profile, role: 'PROFESSOR' } as AuthUser);
      } else if (storedRole === 'EMPRESA' && 'cnpj' in profile) {
        setUser({ ...profile, role: 'EMPRESA' } as AuthUser);
      }
    } catch {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('user_role') as UserRole | null;

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const login = async (email: string, senha: string) => {
    const res: LoginResponseDTO = await apiLogin({ email, senha });
    localStorage.setItem('token', res.token);
    localStorage.setItem('user_role', res.role);
    setToken(res.token);
    setRole(res.role);

    await refreshUser();
    router.push('/dashboard');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

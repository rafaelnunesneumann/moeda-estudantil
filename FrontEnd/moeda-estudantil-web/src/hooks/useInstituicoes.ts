'use client';

import { useEffect, useState } from 'react';
import { listarInstituicoes } from '@/lib/api/instituicoes';
import type { InstituicaoEnsinoResponseDTO } from '@/types/api';

export function useInstituicoes() {
  const [instituicoes, setInstituicoes] = useState<InstituicaoEnsinoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listarInstituicoes()
      .then(setInstituicoes)
      .catch(() => setError('Erro ao carregar instituições'))
      .finally(() => setLoading(false));
  }, []);

  return { instituicoes, loading, error };
}

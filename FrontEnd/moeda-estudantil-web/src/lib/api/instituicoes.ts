import api from '@/lib/axios';
import type { InstituicaoEnsinoResponseDTO } from '@/types/api';

export const listarInstituicoes = (): Promise<InstituicaoEnsinoResponseDTO[]> =>
  api.get<InstituicaoEnsinoResponseDTO[]>('/instituicoes').then((res) => res.data);

import api from '@/lib/axios';
import type { CupomResponseDTO, VantagemRequestDTO, VantagemResponseDTO } from '@/types/api';

export const cadastrarVantagem = (data: VantagemRequestDTO): Promise<VantagemResponseDTO> =>
  api.post<VantagemResponseDTO>('/vantagens', data).then((res) => res.data);

export const listarVantagens = (): Promise<VantagemResponseDTO[]> =>
  api.get<VantagemResponseDTO[]>('/vantagens').then((res) => res.data);

export const listarMinhasVantagens = (): Promise<VantagemResponseDTO[]> =>
  api.get<VantagemResponseDTO[]>('/vantagens/minhas').then((res) => res.data);

export const deletarVantagem = (id: number): Promise<void> =>
  api.delete(`/vantagens/${id}`).then(() => undefined);

export const resgatarVantagem = (id: number): Promise<CupomResponseDTO> =>
  api.post<CupomResponseDTO>(`/vantagens/${id}/resgatar`).then((res) => res.data);

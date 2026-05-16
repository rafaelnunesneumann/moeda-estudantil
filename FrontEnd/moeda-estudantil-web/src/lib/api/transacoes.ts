import api from '@/lib/axios';
import type {
  EnviarMoedasRequestDTO,
  TransacaoResponseDTO,
  ExtratoResponseDTO,
  AlunoResponseDTO,
} from '@/types/api';

export const enviarMoedas = (data: EnviarMoedasRequestDTO): Promise<TransacaoResponseDTO> =>
  api.post<TransacaoResponseDTO>('/transacoes/enviar', data).then((res) => res.data);

export const getExtrato = (): Promise<ExtratoResponseDTO> =>
  api.get<ExtratoResponseDTO>('/transacoes/extrato').then((res) => res.data);

export const listarAlunosDaInstituicao = (): Promise<AlunoResponseDTO[]> =>
  api.get<AlunoResponseDTO[]>('/transacoes/alunos-instituicao').then((res) => res.data);

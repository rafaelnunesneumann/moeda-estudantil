import api from '@/lib/axios';
import type { AlunoRequestDTO, AlunoResponseDTO } from '@/types/api';

export const cadastrarAluno = (data: AlunoRequestDTO): Promise<AlunoResponseDTO> =>
  api.post<AlunoResponseDTO>('/alunos', data).then((res) => res.data);

export const listarAlunos = (): Promise<AlunoResponseDTO[]> =>
  api.get<AlunoResponseDTO[]>('/alunos').then((res) => res.data);

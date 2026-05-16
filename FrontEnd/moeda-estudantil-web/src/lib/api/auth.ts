import api from '@/lib/axios';
import type {
  LoginRequestDTO,
  LoginResponseDTO,
  AlunoRequestDTO,
  AlunoResponseDTO,
  EmpresaParceiraRequestDTO,
  EmpresaParceiraResponseDTO,
  ProfessorResponseDTO,
  ProfessorUpdateDTO,
} from '@/types/api';

export const login = (data: LoginRequestDTO): Promise<LoginResponseDTO> =>
  api.post<LoginResponseDTO>('/auth/login', data).then((res) => res.data);

export const getMe = (): Promise<AlunoResponseDTO | ProfessorResponseDTO | EmpresaParceiraResponseDTO> =>
  api.get('/auth/me').then((res) => res.data);

export const atualizarAluno = (id: number, data: AlunoRequestDTO): Promise<AlunoResponseDTO> =>
  api.put<AlunoResponseDTO>(`/alunos/${id}`, data).then((res) => res.data);

export const atualizarProfessor = (
  id: number,
  data: ProfessorUpdateDTO,
): Promise<ProfessorResponseDTO> =>
  api.put<ProfessorResponseDTO>(`/professores/${id}`, data).then((res) => res.data);

export const atualizarEmpresa = (
  id: number,
  data: EmpresaParceiraRequestDTO,
): Promise<EmpresaParceiraResponseDTO> =>
  api.put<EmpresaParceiraResponseDTO>(`/empresas/${id}`, data).then((res) => res.data);

export const deletarAluno = (id: number): Promise<void> =>
  api.delete(`/alunos/${id}`).then(() => undefined);

export const deletarEmpresa = (id: number): Promise<void> =>
  api.delete(`/empresas/${id}`).then(() => undefined);

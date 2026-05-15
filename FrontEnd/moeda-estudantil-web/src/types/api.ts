export interface InstituicaoEnsinoResponseDTO {
  id: number;
  nome: string;
  endereco: string | null;
}

export interface AlunoRequestDTO {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  instituicaoId: number;
}

export interface AlunoResponseDTO {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  instituicao: InstituicaoEnsinoResponseDTO;
}

export interface EmpresaParceiraRequestDTO {
  nome: string;
  cnpj: string;
  email: string;
  senha: string;
}

export interface EmpresaParceiraResponseDTO {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
}

export interface ApiErrorResponse {
  status: number;
  message?: string;
  errors?: string[];
  timestamp?: string;
}

export type UserRole = 'ALUNO' | 'EMPRESA';

export interface LoginRequestDTO {
  email: string;
  senha: string;
}

export interface LoginResponseDTO {
  token: string;
  id: number;
  nome: string;
  email: string;
  role: UserRole;
}

export type AuthUser = {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
} & (
  | {
      role: 'ALUNO';
      cpf: string;
      rg: string;
      endereco: string;
      curso: string;
      instituicao: InstituicaoEnsinoResponseDTO;
    }
  | {
      role: 'EMPRESA';
      cnpj: string;
    }
);

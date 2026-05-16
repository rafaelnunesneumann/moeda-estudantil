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

export interface ProfessorResponseDTO {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  departamento: string;
  instituicao: InstituicaoEnsinoResponseDTO;
}

export interface ProfessorUpdateDTO {
  nome: string;
  email: string;
  cpf: string;
  senha?: string;
}

export interface EnviarMoedasRequestDTO {
  alunoId: number;
  valor: number;
  motivo: string;
}

export interface TransacaoResponseDTO {
  id: number;
  data: string;
  valor: number;
  tipo: 'ENVIO' | 'RECEBIMENTO' | 'RESGATE' | 'CREDITO_SEMESTRAL';
  motivo: string;
  nomeOrigem: string | null;
  nomeDestino: string | null;
}

export interface ExtratoResponseDTO {
  saldo: number;
  transacoes: TransacaoResponseDTO[];
}

export interface ApiErrorResponse {
  status: number;
  message?: string;
  errors?: string[];
  timestamp?: string;
}

export type UserRole = 'ALUNO' | 'PROFESSOR' | 'EMPRESA';

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
      role: 'PROFESSOR';
      cpf: string;
      departamento: string;
      instituicao: InstituicaoEnsinoResponseDTO;
    }
  | {
      role: 'EMPRESA';
      cnpj: string;
    }
);

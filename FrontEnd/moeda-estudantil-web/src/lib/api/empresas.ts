import api from '@/lib/axios';
import type { EmpresaParceiraRequestDTO, EmpresaParceiraResponseDTO } from '@/types/api';

export const cadastrarEmpresa = (
  data: EmpresaParceiraRequestDTO,
): Promise<EmpresaParceiraResponseDTO> =>
  api.post<EmpresaParceiraResponseDTO>('/empresas', data).then((res) => res.data);

export const listarEmpresas = (): Promise<EmpresaParceiraResponseDTO[]> =>
  api.get<EmpresaParceiraResponseDTO[]>('/empresas').then((res) => res.data);

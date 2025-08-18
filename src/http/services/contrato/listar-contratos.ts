import api from '@/http/api'

export interface Usuario {
  id: string
  nome: string
  email: string
}

export interface Contrato {
  id: string
  arquivo: string
  ativo: boolean
  competencia: string
  prestador: Usuario
  criador: Usuario
  data_criacao: Date
  data_ultima_atualizacao: Date
  valor?: number
  descricao?: string
}

export interface ListarContratosParams {
  page?: number
  limit?: number
}

export interface ListarContratosResponse {
  data: Contrato[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export const listarContratos = async (params?: ListarContratosParams): Promise<ListarContratosResponse> => {
  const searchParams = new URLSearchParams()
  
  if (params?.page) {
    searchParams.append('page', params.page.toString())
  }
  
  if (params?.limit) {
    searchParams.append('limit', params.limit.toString())
  }
  
  const url = `/rest/contrato${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  const response = await api.get<ListarContratosResponse>(url)
  return response.data
} 
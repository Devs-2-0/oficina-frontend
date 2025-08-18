import api from '@/http/api'
import { Financeiro } from '@/types/financeiro'

export interface ListarFinanceirosResponse {
  data: Financeiro[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: number
  hasPrev: number
}

export interface ListarFinanceirosParams {
  page?: number
  limit?: number
  nomePrestador?: string
  identificacaoPrestador?: string
  periodo?: string
}

export const listarFinanceiros = async (params?: ListarFinanceirosParams): Promise<ListarFinanceirosResponse> => {
  const searchParams = new URLSearchParams()
  
  if (params?.page) {
    searchParams.append('page', params.page.toString())
  }
  
  if (params?.limit) {
    searchParams.append('limit', params.limit.toString())
  }
  
  if (params?.nomePrestador) {
    searchParams.append('nomePrestador', params.nomePrestador)
  }
  
  if (params?.identificacaoPrestador) {
    searchParams.append('identificacaoPrestador', params.identificacaoPrestador)
  }
  
  if (params?.periodo) {
    searchParams.append('periodo', params.periodo)
  }
  
  const url = `/rest/financeiro/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  const response = await api.get<ListarFinanceirosResponse>(url)
  return response.data
}
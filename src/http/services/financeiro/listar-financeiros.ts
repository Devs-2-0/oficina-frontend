import api from '@/http/api'
import { Financeiro } from '@/types/financeiro'

export const listarFinanceiros = async (): Promise<Financeiro[]> => {
  const response = await api.get<Financeiro[]>('/rest/financeiro/')
  return response.data
}
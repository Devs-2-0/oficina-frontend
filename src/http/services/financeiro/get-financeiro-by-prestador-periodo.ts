import api from '@/http/api'
import { Financeiro } from '@/types/financeiro'

export const getFinanceiroByPrestadorPeriodo = async (
  id_prestador: number,
  periodo: string
): Promise<Financeiro> => {
  const { data } = await api.get<Financeiro>(`/rest/financeiro/prestador/${id_prestador}/periodo/${periodo}`)
  return data
}











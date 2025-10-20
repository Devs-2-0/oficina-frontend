import api from '@/http/api'
import { Financeiro } from '@/types/financeiro'

export const marcarBaixaFinanceiro = async (
  id_prestador: number,
  periodo: string
): Promise<Financeiro> => {
  const { data } = await api.post<Financeiro>(`/rest/financeiro/${id_prestador}/${periodo}/baixa`)
  return data
}

export const desfazerBaixaFinanceiro = async (
  id_prestador: number,
  periodo: string
): Promise<Financeiro> => {
  const { data } = await api.delete<Financeiro>(`/rest/financeiro/${id_prestador}/${periodo}/baixa`)
  return data
}











import api from '@/http/api'
import { Contrato } from './listar-contratos'

export const getContrato = async (id: string) => {
  const response = await api.get<Contrato>(`/rest/contrato/${id}`)
  return response.data
} 
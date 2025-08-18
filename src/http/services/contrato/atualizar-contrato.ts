import api from '@/http/api'
import { CriarContratoDTO } from './criar-contrato'

export type AtualizarContratoDTO = Partial<CriarContratoDTO>

export const atualizarContrato = async (id: string, formData: FormData) => {
  const response = await api.put(`/rest/contrato/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
} 
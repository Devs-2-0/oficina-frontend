import api from '@/http/api'

export const excluirContrato = async (id: string) => {
  const response = await api.delete(`/rest/contrato/${id}`)
  return response.data
} 
import api from '@/http/api'

export const downloadArquivoContrato = async (id: string) => {
  const response = await api.get(`/rest/contrato/${id}/arquivo`, {
    responseType: 'blob'
  })
  return response.data
} 
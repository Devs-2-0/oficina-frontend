import api from '@/http/api'

export interface CriarContratoDTO {
  arquivo?: string
  competencia: string
  prestadorId: string
  criadorId: string
  valor?: number
  dataInicio?: string
  dataTermino?: string
  descricao?: string
}

export const criarContrato = async (formData: FormData) => {
  const response = await api.post('/rest/contrato', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
} 
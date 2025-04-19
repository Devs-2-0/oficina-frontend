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
}

export const listarContratos = async () => {
  const response = await api.get<Contrato[]>('/rest/contrato')
  return response.data
} 
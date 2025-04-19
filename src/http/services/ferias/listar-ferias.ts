import api from '@/http/api'

export interface Ferias {
  id: string
  dataInicio: string
  dataFim: string
  status: 'PENDENTE' | 'APROVADA' | 'REJEITADA'
  funcionario: {
    id: string
    nome: string
  }
  diasTotais: number
}

export async function listarFerias(): Promise<Ferias[]> {
  const response = await api.get('/rest/ferias')
  return response.data
} 
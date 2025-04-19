import api from '@/http/api'

export interface Permissao {
  codigo: string
  nome: string
}

interface ListarPermissoesResponse {
  permissoesCriadas: Permissao[]
}

export const listarPermissoes = async (): Promise<Permissao[]> => {
  const response = await api.get<ListarPermissoesResponse>('/rest/permissao')
  return response.data.permissoesCriadas
} 
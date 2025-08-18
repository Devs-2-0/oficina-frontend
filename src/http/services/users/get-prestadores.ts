import api from '@/http/api'

export interface Prestador {
  id: number
  matricula: string
  nome: string
  identificacao: string
  nome_usuario: string
  status: string
  tipo: string
  endereco: string
  bairro: string
  cidade: string
  uf: string
  email: string
  data_criacao: string
  data_ultima_atualizacao: string
  data_exclusao: string | null
  grupo: {
    id: number
    nome: string
  }
}

export const getPrestadores = async (): Promise<Prestador[]> => {
  try {
    const response = await api.get<{ data: Prestador[], count: number }>('/rest/usuario/prestadores')
    
    // Os prestadores estão em response.data.data
    return response.data?.data || []
  } catch (error) {
    console.error('Erro ao buscar prestadores:', error)
    return []
  }
}

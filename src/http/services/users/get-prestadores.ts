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

export interface GetPrestadoresResponse {
  data: Prestador[]
  count: number
}

export interface GetPrestadoresParams {
  search?: string
}

export const getPrestadores = async (params?: GetPrestadoresParams): Promise<GetPrestadoresResponse> => {
  try {
    const searchParams = new URLSearchParams()
    
    if (params?.search && params.search.trim()) {
      searchParams.append('search', params.search.trim())
    }
    
    const url = `/rest/usuario/prestadores${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
    const response = await api.get(url)
    
    // Tentar diferentes estruturas de retorno
    const responseData = response.data
    
    // Se response.data já tem a estrutura {data: [], count: number}
    if (responseData && typeof responseData === 'object' && 'data' in responseData && 'count' in responseData) {
      return responseData as GetPrestadoresResponse
    }
    
    // Se response.data é um array direto
    if (Array.isArray(responseData)) {
      return { data: responseData, count: responseData.length }
    }
    
    // Se response.data tem uma propriedade data que é um array
    if (responseData && responseData.data && Array.isArray(responseData.data)) {
      return {
        data: responseData.data,
        count: responseData.count || responseData.data.length
      }
    }
    
    // Fallback
    return { data: [], count: 0 }
  } catch (error) {
    console.error('Erro ao buscar prestadores:', error)
    return { data: [], count: 0 }
  }
}

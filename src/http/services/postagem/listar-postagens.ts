import api from '@/http/api'
import { ListagemPostagens } from '@/types/postagem'

export interface ListarPostagensParams {
  pagina: number
  limite: number
}

export async function listarPostagens({ pagina, limite }: ListarPostagensParams): Promise<ListagemPostagens> {
  const response = await api.get('/rest/postagem', {
    params: {
      pagina,
      limite
    }
  })
  return response.data
} 
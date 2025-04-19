import { useQuery } from '@tanstack/react-query'
import api from '@/http/api'
import { ListagemPrestadores } from '@/types/prestador'

interface ListarPrestadoresParams {
  pagina: number
  limite: number
}

async function listarPrestadores({ pagina, limite }: ListarPrestadoresParams) {
  const response = await api.get<ListagemPrestadores>('/rest/prestadores', {
    params: {
      pagina,
      limite
    }
  })
  return response.data
}

export function useGetPrestadores(pagina: number, limite: number) {
  return useQuery({
    queryKey: ['prestadores', pagina, limite],
    queryFn: () => listarPrestadores({ pagina, limite })
  })
} 
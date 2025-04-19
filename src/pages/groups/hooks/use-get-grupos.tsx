import { listarGrupos } from '@/http/services/grupo/listar-grupos'
import { useQuery } from '@tanstack/react-query'

export const useGetGrupos = () => {
  const gruposQuery = useQuery({
    queryKey: ['grupos'],
    queryFn: listarGrupos,
  })

  return {
    ...gruposQuery,
    data: gruposQuery.data || [],
  }
} 
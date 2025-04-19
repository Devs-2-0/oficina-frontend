import { useQuery } from '@tanstack/react-query'
import { listarGrupos } from '@/http/services/grupo/listar-grupos'

export const useGetGrupos = () => {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: listarGrupos,
  })
} 
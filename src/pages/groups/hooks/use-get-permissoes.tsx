import { useQuery } from '@tanstack/react-query'
import { Permissao, listarPermissoes } from '@/http/services/grupo/listar-permissoes'

export const useGetPermissoes = () => {
  const permissoesQuery = useQuery<Permissao[]>({
    queryKey: ['permissoes'],
    queryFn: listarPermissoes,
  })

  return {
    ...permissoesQuery,
    data: permissoesQuery.data || [],
  }
} 
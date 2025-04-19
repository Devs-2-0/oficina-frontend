import { useQuery } from '@tanstack/react-query'
import { getGrupo } from '@/http/services/grupo/get-grupo'

export const useGetGrupo = (groupId?: string) => {
  const query = useQuery({
    queryKey: ['grupo', groupId],
    queryFn: () => getGrupo(groupId!),
    enabled: !!groupId,
  })

  return query
} 
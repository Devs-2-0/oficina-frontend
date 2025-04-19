import { useQuery } from '@tanstack/react-query'
import { Ferias, listarFerias } from '@/http/services/ferias/listar-ferias'

export function useGetFerias() {
  return useQuery<Ferias[]>({
    queryKey: ['ferias'],
    queryFn: listarFerias,
  })
} 
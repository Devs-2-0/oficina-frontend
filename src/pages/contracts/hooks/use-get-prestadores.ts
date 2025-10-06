import { useQuery } from '@tanstack/react-query'
import { getPrestadores, GetPrestadoresParams, GetPrestadoresResponse } from '@/http/services/users/get-prestadores'

export const useGetPrestadores = (params?: GetPrestadoresParams) => {
  return useQuery<GetPrestadoresResponse>({
    queryKey: ['prestadores', params?.search],
    queryFn: () => getPrestadores(params),
    retry: 1,
    staleTime: 0, // Sempre buscar dados frescos
    enabled: true, // Sempre habilitado
  })
}

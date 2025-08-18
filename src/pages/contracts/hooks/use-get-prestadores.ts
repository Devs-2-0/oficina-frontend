import { useQuery } from '@tanstack/react-query'
import { getPrestadores } from '@/http/services/users/get-prestadores'

export const useGetPrestadores = () => {
  return useQuery({
    queryKey: ['prestadores'],
    queryFn: getPrestadores,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

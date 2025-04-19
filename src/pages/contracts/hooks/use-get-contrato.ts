import { useQuery } from '@tanstack/react-query'
import { getContrato } from '@/http/services/contrato/get-contrato'

export const useGetContrato = (id?: string) => {
  return useQuery({
    queryKey: ['contrato', id],
    queryFn: () => getContrato(id!),
    enabled: !!id,
  })
} 
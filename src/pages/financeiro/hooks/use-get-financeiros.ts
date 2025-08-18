import { useQuery } from '@tanstack/react-query'
import { listarFinanceiros, ListarFinanceirosParams } from '@/http/services/financeiro/listar-financeiros'

export const useGetFinanceiros = (params?: ListarFinanceirosParams) => {
  return useQuery({
    queryKey: ['financeiros', params],
    queryFn: () => listarFinanceiros(params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })
} 
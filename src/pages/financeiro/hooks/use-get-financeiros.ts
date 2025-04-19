import { useQuery } from '@tanstack/react-query'
import { listarFinanceiros } from '@/http/services/financeiro/listar-financeiros'

export const useGetFinanceiros = () => {
  return useQuery({
    queryKey: ['financeiros'],
    queryFn: listarFinanceiros,
  })
} 
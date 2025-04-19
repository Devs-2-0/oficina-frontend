import { useQuery } from '@tanstack/react-query'
import { listarContratos } from '@/http/services/contrato/listar-contratos'

export const useGetContratos = () => {
  return useQuery({
    queryKey: ['contratos'],
    queryFn: listarContratos,
  })
} 
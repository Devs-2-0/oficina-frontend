import { useMutation, useQueryClient } from '@tanstack/react-query'
import { excluirContrato } from '@/http/services/contrato/excluir-contrato'
import { toast } from 'sonner'

export const useDeleteContrato = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: excluirContrato,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] })
      toast.success('Contrato excluído com sucesso')
    },
    onError: () => {
      toast.error('Não foi possível excluir o contrato')
    }
  })
} 
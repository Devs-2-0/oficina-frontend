import { useMutation, useQueryClient } from '@tanstack/react-query'
import { excluirContrato } from '@/http/services/contrato/excluir-contrato'
import { useToast } from '@/hooks/use-toast'

export const useDeleteContrato = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: excluirContrato,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] })
      toast({
        title: 'Sucesso',
        description: 'Contrato excluído com sucesso',
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o contrato',
        variant: 'destructive',
      })
    }
  })
} 
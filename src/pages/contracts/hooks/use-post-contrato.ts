import { useMutation, useQueryClient } from '@tanstack/react-query'
import { criarContrato } from '@/http/services/contrato/criar-contrato'
import { toast } from 'sonner'

export const usePostContrato = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: criarContrato,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] })
      toast.success('Sucesso', {
        description: 'Contrato criado com sucesso'
      })
    },
    onError: () => {
      toast.error('Erro', {
        description: 'Não foi possível criar o contrato'
      })
    }
  })
} 
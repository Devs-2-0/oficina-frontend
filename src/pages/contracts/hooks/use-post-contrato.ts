import { useMutation, useQueryClient } from '@tanstack/react-query'
import { criarContrato } from '@/http/services/contrato/criar-contrato'
import { useToast } from '@/hooks/use-toast'

export const usePostContrato = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: criarContrato,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] })
      toast({
        title: 'Sucesso',
        description: 'Contrato criado com sucesso',
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o contrato',
        variant: 'destructive',
      })
    }
  })
} 
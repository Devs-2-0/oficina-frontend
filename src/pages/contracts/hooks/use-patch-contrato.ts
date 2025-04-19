import { useMutation, useQueryClient } from '@tanstack/react-query'
import { atualizarContrato } from '@/http/services/contrato/atualizar-contrato'
import { useToast } from '@/hooks/use-toast'

interface PatchContratoVariables {
  id: string
  contrato: FormData
}

export const usePatchContrato = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, contrato }: PatchContratoVariables) => atualizarContrato(id, contrato),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] })
      toast({
        title: 'Sucesso',
        description: 'Contrato atualizado com sucesso',
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o contrato',
        variant: 'destructive',
      })
    }
  })
} 
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { atualizarContrato } from '@/http/services/contrato/atualizar-contrato'
import { toast } from 'sonner'

interface PatchContratoVariables {
  id: string
  contrato: FormData
}

export const usePatchContrato = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, contrato }: PatchContratoVariables) => atualizarContrato(id, contrato),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] })
      toast.success('Sucesso', {
        description: 'Contrato atualizado com sucesso'
      })
    },
    onError: () => {
      toast.error('Erro', {
        description: 'Não foi possível atualizar o contrato'
      })
    }
  })
} 
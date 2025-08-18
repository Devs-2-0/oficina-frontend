import { useMutation, useQueryClient } from '@tanstack/react-query'
import { atualizarArquivoContrato } from '@/http/services/contrato/atualizar-arquivo-contrato'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

export function useAtualizarArquivoContrato() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ contratoId, arquivo }: { contratoId: string; arquivo: File }) =>
      atualizarArquivoContrato(contratoId, arquivo),
    onSuccess: () => {
      toast.success('Arquivo do contrato atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['contratos'] })
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as { message?: string }
      const errorMessage = errorData?.message || 'Erro ao atualizar arquivo do contrato'
      toast.error(errorMessage)
    }
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registrarUsoFerias, RegistrarUsoFeriasRequest } from '@/http/services/ferias/registrar-uso-ferias'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

export function useRegistrarUsoFerias() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ solicitacaoId, data }: { solicitacaoId: number; data: RegistrarUsoFeriasRequest }) => 
      registrarUsoFerias(solicitacaoId, data),
    onSuccess: () => {
      toast.success('Uso de férias registrado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-aprovadas'] })
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as { message?: string }
      const errorMessage = errorData?.message || 'Erro ao registrar uso de férias'
      toast.error(errorMessage)
    }
  })
}


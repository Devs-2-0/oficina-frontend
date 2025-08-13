import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registrarGozoFerias, RegistrarGozoFeriasRequest } from '@/http/services/ferias/registrar-gozo-ferias'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

export function useRegistrarGozoFerias() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegistrarGozoFeriasRequest) => registrarGozoFerias(data),
    onSuccess: () => {
      toast.success('Gozo de férias registrado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-aprovadas'] })
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as { message?: string }
      const errorMessage = errorData?.message || 'Erro ao registrar gozo de férias'
      toast.error(errorMessage)
    }
  })
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/http/api"

export function useAprovarSolicitacao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch(`/rest/ferias/solicitacao/${id}/aprovar`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-ferias'] })
    }
  })
} 
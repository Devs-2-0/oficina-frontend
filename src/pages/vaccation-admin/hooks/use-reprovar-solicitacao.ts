import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/http/api"

export function useReprovarSolicitacao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, motivo }: { id: number; motivo: string }) => {
      const response = await api.patch(`/rest/ferias/solicitacao/${id}/reprovar`, { motivo_reprovacao: motivo })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-ferias'] })
    }
  })
} 
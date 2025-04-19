import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/http/api"

interface UpdateContratoData {
  id: string
  arquivo?: string
  prestador_id?: string
  competencia?: string
}

export const useUpdateContrato = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateContratoData) => {
      const response = await api.patch(`/contratos/${data.id}`, {
        arquivo: data.arquivo,
        prestador_id: data.prestador_id,
        competencia: data.competencia,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] })
    },
  })
} 
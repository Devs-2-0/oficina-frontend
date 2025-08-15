import { useMutation } from '@tanstack/react-query'
import { marcarBaixaFinanceiro, desfazerBaixaFinanceiro } from '@/http/services/financeiro/baixar-financeiro'
import { Financeiro } from '@/types/financeiro'
import { toast } from 'sonner'

interface ToggleArgs {
  id_prestador: number
  periodo: string
  toBaixado: boolean
}

export const useToggleBaixa = () => {
  return useMutation<Financeiro, unknown, ToggleArgs>({
    mutationFn: async ({ id_prestador, periodo, toBaixado }) => {
      if (toBaixado) {
        return marcarBaixaFinanceiro(id_prestador, periodo)
      }
      return desfazerBaixaFinanceiro(id_prestador, periodo)
    },
    onSuccess: (data) => {
      toast.success('Status atualizado', {
        description: data.baixado ? 'Registro marcado como baixado.' : 'Baixa desfeita, status pendente.',
      })
    },
    onError: () => {
      toast.error('Não foi possível atualizar o status de baixa')
    },
  })
}




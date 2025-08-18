import { useMutation, useQueryClient } from '@tanstack/react-query'
import { importarTodosFinanceiros } from '@/http/services/financeiro/importar-todos-financeiros'
import { toast } from 'sonner'

export const useImportarTodosFinanceiros = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importarTodosFinanceiros,
    onSuccess: async () => {
      toast.success('Importação de todos os registros concluída', {
        description: 'Todos os registros de financeiro foram importados com sucesso.',
      })
      await queryClient.invalidateQueries({ queryKey: ['financeiros'] })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Falha ao importar todos os registros.'
      toast.error('Erro na importação', {
        description: message,
      })
    },
  })
}

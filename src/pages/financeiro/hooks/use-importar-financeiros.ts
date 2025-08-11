import { useMutation, useQueryClient } from '@tanstack/react-query'
import { importarFinanceiros } from '@/http/services/financeiro/importar-financeiros'
import { toast } from 'sonner'

export const useImportarFinanceiros = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importarFinanceiros,
    onSuccess: async () => {
      toast.success('Importação concluída', {
        description: 'Os registros de financeiro foram importados com sucesso.',
      })
      await queryClient.invalidateQueries({ queryKey: ['financeiros'] })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Falha ao importar registros.'
      toast.error('Erro na importação', {
        description: message,
      })
    },
  })
}



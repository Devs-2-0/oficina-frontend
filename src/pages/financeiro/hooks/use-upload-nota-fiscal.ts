import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadNotaFiscal } from '@/http/services/financeiro/upload-nota-fiscal'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

export const useUploadNotaFiscal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ idPrestador, periodo, arquivo }: { idPrestador: number; periodo: string; arquivo: File }) =>
      uploadNotaFiscal(idPrestador, periodo, arquivo),
    onSuccess: () => {
      toast.success('Nota fiscal enviada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['financeiros'] })
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as { message?: string }
      const errorMessage = errorData?.message || 'Erro ao enviar nota fiscal'
      toast.error(errorMessage)
    }
  })
}

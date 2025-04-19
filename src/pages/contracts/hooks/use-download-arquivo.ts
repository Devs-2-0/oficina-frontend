import { useMutation } from '@tanstack/react-query'
import { downloadArquivoContrato } from '@/http/services/contrato/download-arquivo'
import { useToast } from '@/hooks/use-toast'

const getFileExtension = (mimeType: string): string => {
  const mimeToExt: Record<string, string> = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  }

  return mimeToExt[mimeType] || 'pdf'
}

export const useDownloadArquivo = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: downloadArquivoContrato,
    onSuccess: (data, id) => {
      const blob = new Blob([data], { type: data.type })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contrato-${id}.${getFileExtension(data.type)}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Sucesso',
        description: 'Arquivo baixado com sucesso',
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível baixar o arquivo',
        variant: 'destructive',
      })
    },
  })
} 
import api from '@/http/api'

export async function atualizarArquivoContrato(contratoId: string, arquivo: File): Promise<void> {
  const formData = new FormData()
  formData.append('arquivo', arquivo)
  
  await api.put(`/rest/contrato/${contratoId}/arquivo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

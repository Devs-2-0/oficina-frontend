import api from '@/http/api'

export const uploadNotaFiscal = async (
  idPrestador: number,
  periodo: string,
  arquivo: File
): Promise<void> => {
  const formData = new FormData()
  formData.append('arquivo', arquivo)

  await api.post(`/rest/financeiro/prestador/${idPrestador}/periodo/${periodo}/upload-nota`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

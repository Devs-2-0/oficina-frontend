import api from '@/http/api'

function extractFilenameFromContentDisposition(header?: string): string | undefined {
  if (!header) return undefined
  const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(header)
  return decodeURIComponent(match?.[1] || match?.[2] || '') || undefined
}

export const downloadNotaFiscal = async (
  idPrestador: number,
  periodo: string,
  fallbackFileName?: string
): Promise<void> => {
  const response = await api.get(`/rest/financeiro/prestador/${idPrestador}/periodo/${periodo}/nota`, {
    responseType: 'blob',
  })

  const blob = new Blob([response.data])
  const header = (response.headers as Record<string, string>)['content-disposition']
    || (response.headers as Record<string, string>)['Content-Disposition']
  const filename = extractFilenameFromContentDisposition(header) || fallbackFileName || 'nota-fiscal.pdf'

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(url)
  link.remove()
}



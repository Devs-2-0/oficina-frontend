import api from '@/http/api'

export async function getImagemPostagem(url: string): Promise<Blob> {
  if (!url || typeof url !== 'string') {
    throw new Error('URL da imagem inválida')
  }

  try {
    const response = await api.get(`/rest/postagem/imagem/${encodeURIComponent(url)}`, {
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar imagem:', error)
    throw new Error('Falha ao carregar imagem da postagem')
  }
}

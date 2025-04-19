import api from '@/http/api'

export async function marcarComoLido(id: number): Promise<void> {
  await api.get(`/rest/postagem/${id}`)
}

export async function listarNaoVisualizadas(pagina: number, limite: number): Promise<number> {
  const response = await api.get('/rest/postagem/nao-visualizadas', {
    params: {
      pagina,
      limite
    }
  })
  return response.data.length
} 
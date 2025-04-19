import { http, HttpResponse } from 'msw'
import { feriasMock, periodoAquisitivoMock, periodoAquisitivoIndisponivelMock } from './ferias'
import { postagensMock } from './postagens'
import { Postagem } from '@/types/postagem'

export const handlers = [
  http.get('/rest/ferias', () => {
    return HttpResponse.json(feriasMock)
  }),

  http.get('/rest/ferias/periodo-aquisitivo', () => {
    // Simula 80% de chance de ter período disponível
    const disponivel = Math.random() > 0.2
    return HttpResponse.json(
      disponivel ? periodoAquisitivoMock : periodoAquisitivoIndisponivelMock
    )
  }),

  http.post('/rest/ferias', async ({ request }: { request: Request }) => {
    await request.json() // Apenas para validar que é um JSON válido
    // Simula 90% de chance de sucesso
    if (Math.random() > 0.1) {
      return new HttpResponse(null, { status: 201 })
    }
    return new HttpResponse(null, {
      status: 400,
      statusText: 'Erro ao processar solicitação de férias'
    })
  }),

  http.get('/rest/postagem', ({ request }) => {
    const url = new URL(request.url)
    const pagina = Number(url.searchParams.get('pagina')) || 1
    const limite = Number(url.searchParams.get('limite')) || 10
    const inicio = (pagina - 1) * limite
    const fim = inicio + limite

    const postagens: Postagem[] = Array.from({ length: 18 }).map((_, index) => ({
      id: index + 1,
      titulo: index === 0 ? "teste 1" : "Teste postagem",
      mensagem: index === 0 ? "vao trabalhar feriado tbm" : "Este é um teste de postagem padrão",
      autor: {
        id: "1",
        nome: "Administrador"
      },
      criado_em: new Date().toISOString(),
      imagens: [],
      visualizacoes: Math.floor(Math.random() * 100),
      curtidas: Math.floor(Math.random() * 50)
    }))

    return HttpResponse.json({
      postagens: postagens.slice(inicio, fim),
      total: postagens.length
    })
  }),

  http.get('/rest/postagem/nao-visualizadas', () => {
    // Simula 30% das postagens como não visualizadas
    const naoVisualizadas = postagensMock.filter(() => Math.random() > 0.7)
    return HttpResponse.json(naoVisualizadas)
  }),

  http.get('/rest/postagem/:id', () => {
    return HttpResponse.json({ mensagem: 'Postagem visualizada com sucesso' })
  }),

  http.post('/rest/postagem', async ({ request }) => {
    const formData = await request.formData()
    const titulo = formData.get('titulo')
    const mensagem = formData.get('mensagem')
    const imagens = formData.getAll('imagens')

    if (!titulo || !mensagem) {
      return new HttpResponse(null, { status: 400 })
    }

    // Simula 90% de chance de sucesso
    if (Math.random() > 0.1) {
      return new HttpResponse(null, { status: 201 })
    }

    return new HttpResponse(null, { status: 500 })
  })
] 
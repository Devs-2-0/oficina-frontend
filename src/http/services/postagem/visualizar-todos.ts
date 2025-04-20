import api from "@/http/api"

export async function visualizarTodosPosts() {
  const response = await api.get("/rest/postagem/visualizar-todos")
  return response.data
} 
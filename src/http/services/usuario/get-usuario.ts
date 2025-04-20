import api from "@/http/api"
import { Usuario } from "../login/post-login"

export async function getUsuario(id: number) {
  const response = await api.get<Usuario>(`/rest/usuario/${id}`)
  return response.data
} 
import api from "@/http/api"
import { Grupo } from "./listar-grupos"

export const criarGrupo = async (grupo: Omit<Grupo, "id">) => {
  const response = await api.post<Grupo>("/rest/grupo", grupo)
  return response.data
} 
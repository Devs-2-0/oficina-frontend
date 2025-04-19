import api from "@/http/api"

export const excluirGrupo = async (id: string) => {
  await api.delete(`/rest/grupo/${id}`)
} 
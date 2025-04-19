import api from "@/http/api"


interface DadosGrupo {
  nome: string
  permissoes: string[]
}

export const patchGrupo = async (id: string, grupo: DadosGrupo) => {
  const response = await api.put(`/rest/grupo/${id}`, grupo)
  return response.data
} 
import api from "@/http/api"

export interface PermissaoGrupo {
  codigo: string
  nome: string
}

export interface Grupo {
  id: number
  nome: string
  permissoes: Omit<PermissaoGrupo, "nome">[]
}

export const listarGrupos = async () => {
  const response = await api.get<Grupo[]>("/rest/grupo")
  return response.data
} 
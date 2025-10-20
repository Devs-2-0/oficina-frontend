import api from "@/http/api"

export const excluirDepartamento = async (codigo: string) => {
  const response = await api.delete(`/rest/departamento/${codigo}`)
  return response.data
}

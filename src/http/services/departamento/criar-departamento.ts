import api from "@/http/api"
import { CreateDepartamentoRequest } from "@/types/departamento"

export const criarDepartamento = async (data: CreateDepartamentoRequest) => {
  const response = await api.post("/rest/departamento", data)
  return response.data
}

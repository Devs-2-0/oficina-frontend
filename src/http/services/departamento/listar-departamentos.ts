import api from "@/http/api"
import { DepartamentoResponse } from "@/types/departamento"

export const listarDepartamentos = async () => {
  const response = await api.get<DepartamentoResponse[]>("/rest/departamento")
  return response.data
}

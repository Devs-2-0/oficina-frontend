import api from "@/http/api";


export interface UpdateUserRequest {
  id: string;
  matricula: string;
  nome: string;
  identificacao: string;
  nome_usuario: string;
  senha?: string; // opcional no update
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  grupo: number;
  email: string;
}

export async function patchUser(data: UpdateUserRequest): Promise<void> {
  const { id, ...userData } = data;

  // Se a senha estiver vazia, remova-a do payload
  if (!userData.senha) {
    delete userData.senha;
  }

  await api.put(`/rest/usuario/${id}`, userData);
}
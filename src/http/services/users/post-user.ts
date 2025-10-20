import api, { baseURL } from '@/http/api';
import axios from 'axios';

export interface PostUserRequest {
  matricula: string;
  nome: string;
  identificacao: string;
  nome_usuario: string;
  senha: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  grupo: number;
  email: string;
  departamento?: string; // código do departamento
}


export async function postUser(user: PostUserRequest): Promise<any> {
  const url = `${baseURL}/rest/usuario`;
  const response = await api.post(url, user);
  return response.data;
}

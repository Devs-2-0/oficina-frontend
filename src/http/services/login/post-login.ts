import { baseURL } from '@/http/api';
import axios from 'axios';

export interface LoginRequest {
  nomeDeUsuario: string;
  senha: string;
}

export interface Permission {
  codigo: string;
  nome: string;
}

export interface Group {
  id: number;
  nome: string;
  permissoes: Permission[];
}

export interface Usuario {
  id: number;
  matricula: string;
  nome: string;
  identificacao: string;
  nome_usuario: string;
  status: string;
  tipo: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  email: string;
  data_criacao: string;
  data_ultima_atualizacao: string;
  data_exclusao: string | null;
  grupo: Group;
}

export interface LoginData {
  usuario: Usuario;
  token: string;
  origem: string;
  id: number;
}

export interface LoginResponse {
  message: string;
  data: LoginData;
}


const postLogin = async (login: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${baseURL}/rest/autenticacao/login`, { ...login })
  return response.data;
};



export default postLogin;
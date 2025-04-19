import { baseURL } from '@/http/api';
import axios from 'axios';

export interface LoginRequest {
  nomeDeUsuario: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
}

const postLogin = async (login: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${baseURL}/rest/autenticacao/login`, { ...login })
  return response.data;
};

export default postLogin;
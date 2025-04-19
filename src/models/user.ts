import axios from 'axios';

export interface UserGroup {
  id: number;
  nome: string;
}

export interface User {
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
  grupo: UserGroup;
}


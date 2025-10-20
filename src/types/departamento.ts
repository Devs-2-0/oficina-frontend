export interface Departamento {
  codigo: string;
  descricao: string;
  data_criacao: Date;
  data_ultima_atualizacao: Date;
  data_exclusao: Date | null;
}

export interface CreateDepartamentoRequest {
  codigo: string;
  descricao: string;
}

export interface DepartamentoResponse {
  codigo: string;
  descricao: string;
  data_criacao: string;
  data_ultima_atualizacao: string;
  data_exclusao: string | null;
}

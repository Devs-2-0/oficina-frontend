export enum PermissoesEnum {
  // Usuários
  "criar_usuario" = "criar_usuario",
  "excluir_usuario" = "excluir_usuario",
  "atualizar_usuario" = "atualizar_usuario",
  "visualizar_usuario" = "visualizar_usuario",
  "importar_usuario" = "importar_usuario",

  // Grupos
  "criar_grupo" = "criar_grupo",
  "excluir_grupo" = "excluir_grupo",
  "atualizar_grupo" = "atualizar_grupo",
  "visualizar_grupo" = "visualizar_grupo",

  // Postagens
  "criar_post" = "criar_post",
  "excluir_post" = "excluir_post",
  "atualizar_post" = "atualizar_post",
  "visualizar_post" = "visualizar_post",

  // Contratos
  "criar_contrato" = "criar_contrato",
  "excluir_contrato" = "excluir_contrato",
  "atualizar_contrato" = "atualizar_contrato",
  "atualizar_arquivo_contrato" = "atualizar_arquivo_contrato",
  "visualizar_seu_contrato" = "visualizar_seu_contrato",
  "visualizar_todos_contratos" = "visualizar_todos_contratos",
  "visualizar_arquivo_contrato" = "visualizar_arquivo_contrato",

  // Financeiro
  "visualizar_todos_financeiros" = "visualizar_todos_financeiros",
  "visualizar_seu_financeiro" = "visualizar_seu_financeiro",
  "importar_financeiro" = "importar_financeiro",
  "upload_nota_fiscal" = "upload_nota_fiscal",
  "visualizar_nota_fiscal" = "visualizar_nota_fiscal",
  "remover_nota_fiscal" = "remover_nota_fiscal",
  "registrar_baixa" = "registrar_baixa",
  "retirar_baixa" = "retirar_baixa",

  // Férias
  "criar_solicitacao" = "criar_solicitacao",
  "atualizar_solicitacao" = "atualizar_solicitacao",
  "buscar_periodo_matricula" = "buscar_periodo_matricula",
  "buscar_solicitacao_matricula" = "buscar_solicitacao_matricula",
  "buscar_solicitacao" = "buscar_solicitacao",
  "buscar_todas_solicitacoes" = "buscar_todas_solicitacoes",
  "buscar_todas_solicitacoes_departamento" = "buscar_todas_solicitacoes_departamento",
  "decidir_solicitacao" = "decidir_solicitacao",
  "excluir_solicitacao" = "excluir_solicitacao",

  // Departamentos
  "criar_departamento" = "criar_departamento",
  "excluir_departamento" = "excluir_departamento",
  "visualizar_departamento" = "visualizar_departamento",

  // Permissões
  "visualizar_permissoes" = "visualizar_permissoes",
  "gerenciar_permissoes" = "gerenciar_permissoes",
}

export type Permissao = keyof typeof PermissoesEnum

export interface UsuarioPermissoes {
  id: number
  nome: string
  permissoes: Permissao[]
}



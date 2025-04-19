import { Postagem } from "@/types/postagem"
import { subDays, subHours } from "date-fns"

export const postagensMock: Postagem[] = [
  {
    id: 1,
    titulo: "Atualização de Procedimentos",
    mensagem: "Novos procedimentos para prestadores. Informamos que a partir do próximo mês, todos os prestadores devem seguir o novo protocolo conforme detalhado no manual atualizado.",
    autor: {
      id: "1",
      nome: "Administrador"
    },
    criado_em: subHours(new Date(), 2).toISOString(),
    imagens: [],
    visualizacoes: 45,
    curtidas: 12
  },
  {
    id: 2,
    titulo: "Treinamento Obrigatório",
    mensagem: "Todos os prestadores devem completar o treinamento de segurança no trabalho até o final do mês. O treinamento está disponível na plataforma de aprendizado e leva aproximadamente 2 horas para ser concluído.",
    autor: {
      id: "1",
      nome: "Administrador"
    },
    criado_em: subDays(new Date(), 1).toISOString(),
    imagens: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1596496181848-3091d4878b24?q=80&w=1000&auto=format&fit=crop"
      }
    ],
    visualizacoes: 78,
    curtidas: 23
  },
  {
    id: 3,
    titulo: "Calendário de Pagamentos",
    mensagem: "Confira o calendário de pagamentos para o próximo trimestre. Todas as faturas devem ser enviadas com pelo menos 5 dias úteis de antecedência para garantir o pagamento na data correta.",
    autor: {
      id: "1",
      nome: "Administrador"
    },
    criado_em: subDays(new Date(), 3).toISOString(),
    imagens: [
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1000&auto=format&fit=crop"
      }
    ],
    visualizacoes: 120,
    curtidas: 34
  }
] 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useGetPeriodoElegivel } from "./hooks/use-get-periodo-elegivel"
import { useGetSolicitacoesPorMatricula } from "./hooks/use-get-solicitacoes-por-matricula"
import { PeriodoElegivelCard } from "./components/periodo-elegivel-card"
import { DetalhesSolicitacaoModal } from "./components/detalhes-solicitacao-modal"
import { NovaSolicitacaoModal } from "./components/nova-solicitacao-modal"
import { SolicitacaoPorMatricula } from "@/http/services/ferias/get-solicitacoes-por-matricula"
import { PeriodoElegivel } from "@/http/services/ferias/get-periodo-elegivel"

export const Vacation = () => {
  const { usuario } = useAuth()
  const [search, setSearch] = useState("")
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [novaSolicitacaoModalOpen, setNovaSolicitacaoModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<SolicitacaoPorMatricula | null>(null)
  const [selectedPeriodoElegivel, setSelectedPeriodoElegivel] = useState<PeriodoElegivel | null>(null)

  const { data: periodosElegiveis, isLoading: isLoadingPeriodos } = useGetPeriodoElegivel(usuario?.matricula || "")
  const { data: solicitacoes, isLoading: isLoadingSolicitacoes } = useGetSolicitacoesPorMatricula(usuario?.matricula || "")

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDENTE: 'bg-yellow-500',
      APROVADA: 'bg-emerald-500',
      REPROVADA: 'bg-red-500'
    }
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>
  }

  const handleOpenDetails = (solicitacao: SolicitacaoPorMatricula) => {
    setSelectedRequest(solicitacao)
    setDetailsModalOpen(true)
  }

  const handleNovaSolicitacao = (periodo: PeriodoElegivel) => {
    setSelectedPeriodoElegivel(periodo)
    setNovaSolicitacaoModalOpen(true)
  }

  const calculateTotalDays = (solicitacao: SolicitacaoPorMatricula) => {
    return (solicitacao.dias_corridos1 || 0) + 
           (solicitacao.dias_corridos2 || 0) + 
           (solicitacao.dias_corridos3 || 0)
  }

  const filteredRequests = solicitacoes?.filter(solicitacao =>
    solicitacao.prestador.nome.toLowerCase().includes(search.toLowerCase()) ||
    solicitacao.periodo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Minhas Férias</h2>
          <p className="text-muted-foreground">
            Gerencie suas solicitações de férias
          </p>
        </div>
      </div>


      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Períodos Elegíveis</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPeriodos ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Carregando períodos...</p>
              </div>
            ) : periodosElegiveis?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum período elegível encontrado</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {periodosElegiveis?.map((periodo, index) => (
                  <PeriodoElegivelCard 
                    key={index} 
                    periodo={periodo} 
                    onNovaSolicitacao={handleNovaSolicitacao}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seção de Solicitações */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Minhas Solicitações</h3>
        <div className="flex items-center py-4">
          <Input
            placeholder="Buscar por período..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead>Data Início 1</TableHead>
              <TableHead>Dias 1</TableHead>
              <TableHead>Data Início 2</TableHead>
              <TableHead>Dias 2</TableHead>
              <TableHead>Data Início 3</TableHead>
              <TableHead>Dias 3</TableHead>
              <TableHead>Total Dias</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data da Solicitação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingSolicitacoes ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredRequests?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  Nenhuma solicitação encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests?.map((solicitacao) => (
                <TableRow key={solicitacao.id}>
                  <TableCell>{solicitacao.periodo}</TableCell>
                  <TableCell>
                    {solicitacao.data_inicio1 ? format(new Date(solicitacao.data_inicio1), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                  </TableCell>
                  <TableCell>{solicitacao.dias_corridos1 || 0}</TableCell>
                  <TableCell>
                    {solicitacao.data_inicio2 ? format(new Date(solicitacao.data_inicio2), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                  </TableCell>
                  <TableCell>{solicitacao.dias_corridos2 || 0}</TableCell>
                  <TableCell>
                    {solicitacao.data_inicio3 ? format(new Date(solicitacao.data_inicio3), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                  </TableCell>
                  <TableCell>{solicitacao.dias_corridos3 || 0}</TableCell>
                  <TableCell className="font-medium">{calculateTotalDays(solicitacao)}</TableCell>
                  <TableCell>{getStatusBadge(solicitacao.status)}</TableCell>
                  <TableCell>
                    {format(new Date(solicitacao.data_criacao), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleOpenDetails(solicitacao)}
                    >
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {detailsModalOpen && selectedRequest && (
        <DetalhesSolicitacaoModal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          solicitacao={selectedRequest}
        />
      )}

      {novaSolicitacaoModalOpen && selectedPeriodoElegivel && (
        <NovaSolicitacaoModal
          isOpen={novaSolicitacaoModalOpen}
          onClose={() => setNovaSolicitacaoModalOpen(false)}
          periodoElegivel={selectedPeriodoElegivel}
        />
      )}
    </div>
  )
}

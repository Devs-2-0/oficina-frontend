import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useGetPeriodoElegivel } from "./hooks/use-get-periodo-elegivel"
import { useGetSolicitacoesPorMatricula } from "./hooks/use-get-solicitacoes-por-matricula"
import { PeriodoElegivelCard } from "./components/periodo-elegivel-card"
import { DetalhesSolicitacaoModal } from "./components/detalhes-solicitacao-modal"
import { NovaSolicitacaoModal } from "./components/nova-solicitacao-modal"
import { Calendar, Search, Clock, FileText } from "lucide-react"
import { SolicitacaoPorMatricula } from "@/http/services/ferias/get-solicitacoes-por-matricula"
import { PeriodoElegivel } from "@/http/services/ferias/get-periodo-elegivel"

export const Vacation = () => {
  const { usuario } = useAuth()
  const [search, setSearch] = useState("")
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<SolicitacaoPorMatricula | null>(null)
  const [novaSolicitacaoModalOpen, setNovaSolicitacaoModalOpen] = useState(false)
  const [selectedPeriodoElegivel, setSelectedPeriodoElegivel] = useState<PeriodoElegivel | null>(null)

  const { data: periodosElegiveis, isLoading: isLoadingPeriodos } = useGetPeriodoElegivel(usuario?.matricula || "")
  const { data: solicitacoes, isLoading: isLoadingSolicitacoes } = useGetSolicitacoesPorMatricula(usuario?.matricula || "")

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDENTE: 'bg-amber-100 text-amber-800 border-amber-200',
      APROVADA: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      REPROVADA: 'bg-red-100 text-red-800 border-red-200'
    }
    return <Badge variant="outline" className={styles[status as keyof typeof styles]}>{status}</Badge>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Calendar className="h-8 w-8 text-red-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Minhas Férias
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Gerencie suas solicitações e visualize seus períodos elegíveis
              </p>
            </div>
          </div>
        </div>

        {/* Períodos Elegíveis Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <Clock className="h-5 w-5 text-red-700" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Períodos Elegíveis
              </h2>
              <p className="text-gray-600">
                Visualize seus períodos disponíveis para solicitar férias
              </p>
            </div>
          </div>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              {isLoadingPeriodos ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Carregando seus períodos elegíveis...</p>
                </div>
              ) : periodosElegiveis?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum período elegível</h3>
                  <p className="text-gray-600">Você ainda não possui períodos elegíveis para solicitar férias.</p>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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

        {/* Solicitações Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <FileText className="h-5 w-5 text-red-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                Minhas Solicitações
              </h2>
              <p className="text-gray-600">
                Acompanhe o status de todas as suas solicitações de férias
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por período ou funcionário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-red-600 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Table */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4">Período</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">1º Período</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Dias</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">2º Período</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Dias</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">3º Período</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Dias</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Total</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Solicitado em</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingSolicitacoes ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-12">
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-700"></div>
                          <span className="text-gray-600 font-medium">Carregando solicitações...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <FileText className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhuma solicitação encontrada</h3>
                            <p className="text-gray-600">Comece criando sua primeira solicitação de férias.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests?.map((solicitacao) => (
                      <TableRow key={solicitacao.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-medium text-gray-900 py-4">
                          {solicitacao.periodo}
                        </TableCell>
                        <TableCell className="py-4">
                          {solicitacao.data_inicio1 ? (
                            <span className="text-gray-700">
                              {format(new Date(solicitacao.data_inicio1), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-medium text-gray-900">
                            {solicitacao.dias_corridos1 || 0}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          {solicitacao.data_inicio2 ? (
                            <span className="text-gray-700">
                              {format(new Date(solicitacao.data_inicio2), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-medium text-gray-900">
                            {solicitacao.dias_corridos2 || 0}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          {solicitacao.data_inicio3 ? (
                            <span className="text-gray-700">
                              {format(new Date(solicitacao.data_inicio3), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-medium text-gray-900">
                            {solicitacao.dias_corridos3 || 0}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="secondary" className="font-semibold text-gray-900 bg-red-100 border-red-200">
                            {calculateTotalDays(solicitacao)} dias
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          {getStatusBadge(solicitacao.status)}
                        </TableCell>
                        <TableCell className="py-4 text-gray-700">
                          {format(new Date(solicitacao.data_criacao), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetails(solicitacao)}
                            className="text-red-700 hover:text-red-800 hover:bg-red-50"
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
          </Card>
        </div>
      </div>

      {/* Modals */}
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

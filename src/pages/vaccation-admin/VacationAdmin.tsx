import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { useGetSolicitacoesFerias } from "./hooks/use-get-solicitacoes-ferias"
import { FeriasSolicitacao } from "@/http/services/ferias/listar-solicitacoes-ferias"
import { DetalhesFeriasModal } from "./components/detalhes-ferias"
import { useAprovarSolicitacao } from "./hooks/use-aprovar-solicitacao"
import { useReprovarSolicitacao } from "./hooks/use-reprovar-solicitacao"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Calendar, Search, Users, CheckCircle, XCircle, Eye, AlertTriangle } from "lucide-react"

export const VacationAdmin = () => {
  const [search, setSearch] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<FeriasSolicitacao | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const { data: solicitacoes, isLoading } = useGetSolicitacoesFerias()
  const { mutate: aprovarSolicitacao, isPending: isApproving } = useAprovarSolicitacao()
  const { mutate: reprovarSolicitacao, isPending: isRejecting } = useReprovarSolicitacao()

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDENTE: 'bg-amber-100 text-amber-800 border-amber-200',
      APROVADA: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      REJEITADA: 'bg-red-100 text-red-800 border-red-200'
    }
    return <Badge variant="outline" className={styles[status as keyof typeof styles]}>{status}</Badge>
  }

  const handleOpenDetails = (solicitacao: FeriasSolicitacao) => {
    setSelectedRequest(solicitacao)
    setDetailsModalOpen(true)
  }

  const handleApprove = () => {
    if (!selectedRequest) return
    
    aprovarSolicitacao(selectedRequest.id, {
      onSuccess: () => {
        toast.success('Solicitação aprovada com sucesso!')
        setApproveModalOpen(false)
        setSelectedRequest(null)
      },
      onError: () => {
        toast.error('Erro ao aprovar solicitação')
      }
    })
  }

  const handleReject = () => {
    if (!selectedRequest) return
    if (!rejectReason.trim()) {
      toast.error('Por favor, informe o motivo da reprovação')
      return
    }

    reprovarSolicitacao(
      { id: selectedRequest.id, motivo: rejectReason },
      {
        onSuccess: () => {
          toast.success('Solicitação reprovada com sucesso!')
          setRejectModalOpen(false)
          setRejectReason('')
          setSelectedRequest(null)
        },
        onError: () => {
          toast.error('Erro ao reprovar solicitação')
        }
      }
    )
  }

  const openApproveModal = (solicitacao: FeriasSolicitacao) => {
    setSelectedRequest(solicitacao)
    setApproveModalOpen(true)
  }

  const openRejectModal = (solicitacao: FeriasSolicitacao) => {
    setSelectedRequest(solicitacao)
    setRejectModalOpen(true)
  }

  const filteredRequests = solicitacoes?.filter(solicitacao => 
    solicitacao.prestador.nome.toLowerCase().includes(search.toLowerCase()) ||
    solicitacao.prestador.matricula.includes(search)
  ) || []

  const calculateTotalDays = (solicitacao: FeriasSolicitacao) => {
    return (solicitacao.dias_corridos1 || 0) + 
           (solicitacao.dias_corridos2 || 0) + 
           (solicitacao.dias_corridos3 || 0)
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <Users className="h-8 w-8 text-red-700" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                  Gestão de Férias
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  Gerencie e aprove as solicitações de férias dos prestadores
                </p>
              </div>
            </div>
          </div>

          {/* Solicitações Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar className="h-5 w-5 text-red-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Solicitações Pendentes
                </h2>
                <p className="text-gray-600">
                  Aprove ou reprove as solicitações de férias dos prestadores
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou matrícula..."
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
                      <TableHead className="font-semibold text-gray-700 py-4">Prestador</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Matrícula</TableHead>
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-12">
                          <div className="flex items-center justify-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-700"></div>
                            <span className="text-gray-600 font-medium">Carregando solicitações...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-3 bg-gray-100 rounded-full">
                              <Calendar className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhuma solicitação encontrada</h3>
                              <p className="text-gray-600">Não há solicitações de férias para gerenciar no momento.</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((solicitacao) => (
                        <TableRow key={solicitacao.id} className="hover:bg-gray-50/50 transition-colors">
                          <TableCell className="font-medium text-gray-900 py-4">
                            {solicitacao.prestador.nome}
                          </TableCell>
                          <TableCell className="py-4 text-gray-700">
                            {solicitacao.prestador.matricula}
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
                            <div className="flex items-center justify-end gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenDetails(solicitacao)}
                                    className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Ver detalhes</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              {solicitacao.status === 'PENDENTE' && (
                                <>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => openApproveModal(solicitacao)}
                                        disabled={isApproving}
                                        className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      <p>Aprovar solicitação</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => openRejectModal(solicitacao)}
                                        disabled={isRejecting}
                                        className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      <p>Reprovar solicitação</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </>
                              )}
                            </div>
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
          <DetalhesFeriasModal
            isOpen={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            solicitacao={selectedRequest}
          />
        )}

        {/* Modal de Confirmação de Aprovação */}
        <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <DialogTitle>Confirmar Aprovação</DialogTitle>
                  <DialogDescription>
                    Você está prestes a aprovar uma solicitação de férias
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Detalhes da Solicitação</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Prestador:</span> {selectedRequest.prestador.nome}</p>
                    <p><span className="font-medium">Matrícula:</span> {selectedRequest.prestador.matricula}</p>
                    <p><span className="font-medium">Total de dias:</span> {calculateTotalDays(selectedRequest)} dias</p>
                    <p><span className="font-medium">Solicitado em:</span> {format(new Date(selectedRequest.data_criacao), "dd/MM/yyyy", { locale: ptBR })}</p>
                  </div>
                </div>
                
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-sm text-emerald-800">
                    <strong>Atenção:</strong> Ao aprovar esta solicitação, o prestador será notificado e o período de férias será confirmado no sistema.
                  </p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setApproveModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleApprove}
                disabled={isApproving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isApproving ? 'Aprovando...' : 'Confirmar Aprovação'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Reprovação */}
        <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-700" />
                </div>
                <div>
                  <DialogTitle>Confirmar Reprovação</DialogTitle>
                  <DialogDescription>
                    Você está prestes a reprovar uma solicitação de férias
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Detalhes da Solicitação</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Prestador:</span> {selectedRequest.prestador.nome}</p>
                    <p><span className="font-medium">Matrícula:</span> {selectedRequest.prestador.matricula}</p>
                    <p><span className="font-medium">Total de dias:</span> {calculateTotalDays(selectedRequest)} dias</p>
                    <p><span className="font-medium">Solicitado em:</span> {format(new Date(selectedRequest.data_criacao), "dd/MM/yyyy", { locale: ptBR })}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo da Reprovação *</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Digite o motivo da reprovação..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Atenção:</strong> Ao reprovar esta solicitação, o prestador deverá criar uma nova solicitação se necessário.
                  </p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={isRejecting || !rejectReason.trim()}
              >
                {isRejecting ? 'Reprovando...' : 'Confirmar Reprovação'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

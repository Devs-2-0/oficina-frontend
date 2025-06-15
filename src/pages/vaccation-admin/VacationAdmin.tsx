import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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

export const VacationAdmin = () => {
  const [search, setSearch] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<FeriasSolicitacao | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const { data: solicitacoes, isLoading } = useGetSolicitacoesFerias()
  const { mutate: aprovarSolicitacao, isPending: isApproving } = useAprovarSolicitacao()
  const { mutate: reprovarSolicitacao, isPending: isRejecting } = useReprovarSolicitacao()

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDENTE: 'bg-yellow-500',
      APROVADA: 'bg-emerald-500',
      REJEITADA: 'bg-red-500'
    }
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>
  }

  const handleOpenDetails = (solicitacao: FeriasSolicitacao) => {
    setSelectedRequest(solicitacao)
    setDetailsModalOpen(true)
  }

  const handleApprove = (id: number) => {
    aprovarSolicitacao(id, {
      onSuccess: () => {
        toast.success('Solicitação aprovada com sucesso!')
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
        },
        onError: () => {
          toast.error('Erro ao reprovar solicitação')
        }
      }
    )
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
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Solicitações de Férias</h2>
          <p className="text-muted-foreground">
            Gerencie as solicitações de férias dos prestadores
          </p>
        </div>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar por nome ou matrícula..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prestador</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead>Dias</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data da Solicitação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhuma solicitação encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((solicitacao) => (
                <TableRow key={solicitacao.id}>
                  <TableCell>{solicitacao.prestador.nome}</TableCell>
                  <TableCell>{solicitacao.prestador.matricula}</TableCell>
                  <TableCell>
                    {format(new Date(solicitacao.data_inicio1), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{calculateTotalDays(solicitacao)} dias</TableCell>
                  <TableCell>{getStatusBadge(solicitacao.status)}</TableCell>
                  <TableCell>
                    {format(new Date(solicitacao.data_criacao), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleOpenDetails(solicitacao)}
                    >
                      Ver Detalhes
                    </Button>
                    {solicitacao.status === 'PENDENTE' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(solicitacao.id)}
                          disabled={isApproving}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(solicitacao)
                            setRejectModalOpen(true)
                          }}
                          disabled={isRejecting}
                        >
                          Reprovar
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {detailsModalOpen && selectedRequest && (
        <DetalhesFeriasModal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          solicitacao={selectedRequest}
        />
      )}

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Solicitação</DialogTitle>
            <DialogDescription>
              Informe o motivo da reprovação da solicitação de férias.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo da Reprovação</Label>
              <Textarea
                id="motivo"
                placeholder="Digite o motivo da reprovação..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={isRejecting}
            >
              Confirmar Reprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

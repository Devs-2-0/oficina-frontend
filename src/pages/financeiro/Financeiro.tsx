import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, DollarSign, Download, FileText } from "lucide-react"
import { useState } from "react"
import { useGetFinanceiros } from "./hooks/use-get-financeiros"
import { useImportarFinanceiros } from "./hooks/use-importar-financeiros"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { FinanceiroModal } from "./components/financeiro-modal"
import { Financeiro as FinanceiroType, RegistroFinanceiro } from "@/types/financeiro"
import { useAuth } from "@/contexts/auth-context"
import { useToggleBaixa } from "./hooks/use-toggle-baixa"
import { getFinanceiroByPrestadorPeriodo } from "@/http/services/financeiro/get-financeiro-by-prestador-periodo"
import { useQueryClient } from "@tanstack/react-query"
import { downloadNotaFiscal } from "@/http/services/financeiro/download-nota-fiscal"
import { generateFinanceiroPDF } from "@/lib/pdf-generator"
import { toast } from "sonner"

export const Financeiro = () => {
  const { data: financeiros = [], isLoading } = useGetFinanceiros()
  const [search, setSearch] = useState("")
  const [selectedFinanceiroIndex, setSelectedFinanceiroIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFinanceiroId, setEditingFinanceiroId] = useState<number>()
  const { usuario } = useAuth()
  const importarMutation = useImportarFinanceiros()
  const toggleBaixaMutation = useToggleBaixa()
  const queryClient = useQueryClient()

  const normalizedSearch = (search || '').toLowerCase()
  const filteredFinanceiros = (
    Array.isArray(financeiros) ? (financeiros as FinanceiroType[]) : []
  ).filter((financeiro) => {
    const periodo = financeiro?.periodo ? String(financeiro.periodo).toLowerCase() : ''
    const prestadorNome = financeiro?.prestador?.nome
      ? String(financeiro.prestador.nome).toLowerCase()
      : ''
    const nomeArquivo = financeiro?.nome_arquivo ? String(financeiro.nome_arquivo).toLowerCase() : ''

    return (
      periodo.includes(normalizedSearch) ||
      prestadorNome.includes(normalizedSearch) ||
      nomeArquivo.includes(normalizedSearch)
    )
  })

  const getBaixadoBadge = (baixado?: boolean) => {
    const label = baixado ? 'Baixado' : 'Pendente'
    const badgeClass = baixado ? 'bg-emerald-500' : 'bg-yellow-500'
    return <Badge className={badgeClass}>{label}</Badge>
  }

  const selectedFinanceiroData =
    selectedFinanceiroIndex !== null
      ? (filteredFinanceiros as FinanceiroType[])[selectedFinanceiroIndex]
      : undefined

  const handleOpenCreateModal = () => {
    setEditingFinanceiroId(undefined)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (index: number) => {
    setEditingFinanceiroId(index)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingFinanceiroId(undefined)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <DollarSign className="h-8 w-8 text-red-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Gestão Financeira
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Gerencie registros financeiros e pagamentos
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Search className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Registros Financeiros
                </h2>
                <p className="text-gray-600">
                  Visualize e gerencie todos os registros financeiros
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleOpenCreateModal}
                className="bg-red-700 hover:bg-red-800 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Registro
              </Button>
              <Button
                variant="outline"
                onClick={() => usuario && importarMutation.mutate(usuario.id)}
                disabled={importarMutation.isPending || !usuario}
              >
                {importarMutation.isPending ? 'Importando...' : 'Buscar Registros (Protheus)'}
              </Button>
              
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar registros..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-red-600 focus:ring-red-600"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4">Prestador</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Período</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Baixado</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Data de Baixa</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Nome do Arquivo</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Registros</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-700"></div>
                          <span className="text-gray-600 font-medium">Carregando registros...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredFinanceiros.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <DollarSign className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhum registro encontrado</h3>
                            <p className="text-gray-600">Não há registros financeiros cadastrados no sistema.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFinanceiros.map((financeiro, index) => (
                      <TableRow key={`${financeiro.id_prestador}-${financeiro.periodo}`} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="py-4 text-gray-700">{financeiro.prestador?.nome ?? '-'}</TableCell>
                        <TableCell className="font-medium text-gray-900 py-4">{financeiro.periodo ?? '-'}</TableCell>
                        <TableCell className="py-4">{getBaixadoBadge(financeiro.baixado)}</TableCell>
                        <TableCell className="py-4 text-gray-700">{financeiro.baixado_em ? new Date(financeiro.baixado_em as unknown as string).toLocaleDateString('pt-BR') : '-'}</TableCell>
                        <TableCell className="py-4 text-gray-700">{financeiro.nome_arquivo ?? '-'}</TableCell>
                        <TableCell className="py-4 text-gray-700">{financeiro.registros_financeiros?.length ?? 0}</TableCell>
                        <TableCell className="text-right py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Ações</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedFinanceiroIndex(index)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver itens
                              </DropdownMenuItem>
                                                             <DropdownMenuItem
                                 onClick={async () => {
                                   const toastId = toast.info('Gerando PDF...')
                                   try {
                                     await new Promise<void>((resolve) => {
                                       setTimeout(() => {
                                         generateFinanceiroPDF(financeiro)
                                         resolve()
                                       }, 100)
                                     })
                                     toast.success('PDF gerado com sucesso!', { id: toastId })
                                   } catch {
                                     toast.error('Erro ao gerar PDF', { id: toastId })
                                   }
                                 }}
                               >
                                <FileText className="mr-2 h-4 w-4" />
                                Gerar PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={!(financeiro.nome_arquivo && financeiro.caminho_arquivo)}
                                onClick={() => {
                                  if (financeiro.nome_arquivo && financeiro.caminho_arquivo) {
                                    downloadNotaFiscal(financeiro.id_prestador, financeiro.periodo, financeiro.nome_arquivo || undefined)
                                  }
                                }}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download Nota
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenEditModal(index)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar registro
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir registro
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={selectedFinanceiroIndex !== null} onOpenChange={() => setSelectedFinanceiroIndex(null)}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Detalhes do Registro Financeiro</DialogTitle>
                <DialogDescription>
                  Informações detalhadas sobre o registro financeiro e seus itens.
                </DialogDescription>
              </div>
              {selectedFinanceiroData && (
                                 <Button
                   variant="outline"
                   onClick={async () => {
                     const toastId = toast.info('Gerando PDF...')
                     try {
                       await new Promise<void>((resolve) => {
                         setTimeout(() => {
                           generateFinanceiroPDF(selectedFinanceiroData)
                           resolve()
                         }, 100)
                       })
                       toast.success('PDF gerado com sucesso!', { id: toastId })
                     } catch {
                       toast.error('Erro ao gerar PDF', { id: toastId })
                     }
                   }}
                   className="border-blue-600 text-blue-600 hover:bg-blue-50"
                 >
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar PDF
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {selectedFinanceiroData && (
              <>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Informações do Registro</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Prestador (ID):</div>
                        <div>{selectedFinanceiroData.id_prestador}</div>
                        <div>Período:</div>
                        <div>{selectedFinanceiroData.periodo}</div>
                        <div>Nome do Arquivo:</div>
                        <div>{selectedFinanceiroData.nome_arquivo ?? '-'}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Detalhes</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Prestador:</div>
                        <div>{selectedFinanceiroData.prestador?.nome ?? '-'}</div>
                        <div className="flex items-center gap-2">Status:</div>
                        <div className="flex items-center gap-3">
                          {getBaixadoBadge(selectedFinanceiroData.baixado)}
                          <Button
                            className={selectedFinanceiroData.baixado ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}
                            size="sm"
                            onClick={async () => {
                              if (!selectedFinanceiroData) return
                              const toBaixado = !selectedFinanceiroData.baixado
                              await toggleBaixaMutation.mutateAsync({
                                id_prestador: selectedFinanceiroData.id_prestador,
                                periodo: selectedFinanceiroData.periodo,
                                toBaixado,
                              })
                              // Refetch this specific Financeiro and update the modal data
                              const refreshed = await getFinanceiroByPrestadorPeriodo(
                                selectedFinanceiroData.id_prestador,
                                selectedFinanceiroData.periodo
                              )
                              // Update cached list so table and modal reflect changes
                              queryClient.setQueryData<FinanceiroType[] | undefined>(
                                ['financeiros'],
                                (old) =>
                                  Array.isArray(old)
                                    ? old.map((item) =>
                                      item.id_prestador === refreshed.id_prestador && item.periodo === refreshed.periodo
                                        ? (refreshed as FinanceiroType)
                                        : item
                                    )
                                    : old
                              )
                            }}
                            disabled={toggleBaixaMutation.isPending}
                          >
                            {toggleBaixaMutation.isPending
                              ? 'Atualizando...'
                              : selectedFinanceiroData.baixado
                                ? 'Marcar como Pendente'
                                : 'Marcar como Baixado'}
                          </Button>
                        </div>
                        <div>Data de Baixa:</div>
                        <div>{selectedFinanceiroData.baixado_em ? new Date(selectedFinanceiroData.baixado_em as unknown as string).toLocaleDateString('pt-BR') : '-'}</div>
                      </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold">Registros Financeiros</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Verba</TableHead>
                            <TableHead>Atividade</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-right">Bases</TableHead>
                            <TableHead className="text-right">Proventos</TableHead>
                            <TableHead className="text-right">Descontos</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedFinanceiroData.registros_financeiros?.map((item: RegistroFinanceiro, idx: number) => {
                            const numericValue = typeof item.valor === 'string' ? Number(item.valor) : item.valor
                            const isProvento = item.tipo === '1'
                            const isDesconto = item.tipo === '2'
                            const isBaseProvento = item.tipo === '3'
                            const isBaseDesconto = item.tipo === '4'
                            const isBase = isBaseProvento || isBaseDesconto

                            const basesValue = isBase ? numericValue : undefined
                            const proventosValue = isProvento ? numericValue : undefined
                            const descontosValue = isDesconto ? numericValue : undefined

                            return (
                              <TableRow key={`${item.cod_verba}-${idx}`}>
                                <TableCell>{item.cod_verba}</TableCell>
                                <TableCell>{item.atividade}</TableCell>
                                <TableCell>{item.descricao}</TableCell>
                                <TableCell className="text-right">
                                  {typeof basesValue === 'number' ? (
                                    <span>
                                      {formatCurrency(basesValue)}
                                      <span className="ml-2 text-xs text-gray-500">
                                        {isBaseProvento ? 'Base(Provento)' : isBaseDesconto ? 'Base(Desconto)' : ''}
                                      </span>
                                    </span>
                                  ) : (
                                    '-'
                                  )}
                                </TableCell>
                                <TableCell className="text-right">{typeof proventosValue === 'number' ? formatCurrency(proventosValue) : '-'}</TableCell>
                                <TableCell className="text-right">{typeof descontosValue === 'number' ? formatCurrency(descontosValue) : '-'}</TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <FinanceiroModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        financeiroId={editingFinanceiroId}
      />
    </div>
  )
} 
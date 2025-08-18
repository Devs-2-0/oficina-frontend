import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Eye, Edit, DollarSign, Download, FileText, Upload } from "lucide-react"
import { useState, useEffect } from "react"
import { useGetFinanceiros } from "./hooks/use-get-financeiros"
import { useDebounce } from "@/hooks/use-debounce"
import { useImportarTodosFinanceiros } from "./hooks/use-importar-todos-financeiros"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { FinanceiroModal } from "./components/financeiro-modal"
import { ImportarFinanceiroModal } from "./components/importar-financeiro-modal"
import { UploadNotaModal } from "./components/upload-nota-modal"
import { Financeiro as FinanceiroType, RegistroFinanceiro } from "@/types/financeiro"
import { useToggleBaixa } from "./hooks/use-toggle-baixa"

import { useQueryClient } from "@tanstack/react-query"
import { downloadNotaFiscal } from "@/http/services/financeiro/download-nota-fiscal"
import { generateFinanceiroPDF } from "@/lib/pdf-generator"
import { toast } from "sonner"
import { PermissionGuard } from "@/components/ui/permission-guard"

export const Financeiro = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [nomePrestador, setNomePrestador] = useState("")
  const [identificacaoPrestador, setIdentificacaoPrestador] = useState("")
  const [periodo, setPeriodo] = useState("")

  // Debounced values for search
  const debouncedNomePrestador = useDebounce(nomePrestador, 500)
  const debouncedIdentificacaoPrestador = useDebounce(identificacaoPrestador, 500)
  const debouncedPeriodo = useDebounce(periodo, 500)
  
  // Reset page when debounced search values change
  useEffect(() => {
    setPage(1)
  }, [debouncedNomePrestador, debouncedIdentificacaoPrestador, debouncedPeriodo])
  
  const [selectedFinanceiroIndex, setSelectedFinanceiroIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportarModalOpen, setIsImportarModalOpen] = useState(false)
  const [isUploadNotaModalOpen, setIsUploadNotaModalOpen] = useState(false)
  const [uploadNotaData, setUploadNotaData] = useState<{ idPrestador: number; periodo: string; prestadorNome?: string } | null>(null)
  const [editingFinanceiroId, setEditingFinanceiroId] = useState<number>()
  const importarTodosMutation = useImportarTodosFinanceiros()
  const toggleBaixaMutation = useToggleBaixa()
  const queryClient = useQueryClient()

  const { data: financeirosResponse, isLoading } = useGetFinanceiros({
    page,
    limit,
    nomePrestador: debouncedNomePrestador || undefined,
    identificacaoPrestador: debouncedIdentificacaoPrestador || undefined,
    periodo: debouncedPeriodo || undefined
  })

  // Check if search is in progress (when input values differ from debounced values)
  const isSearching = 
    nomePrestador !== debouncedNomePrestador ||
    identificacaoPrestador !== debouncedIdentificacaoPrestador ||
    periodo !== debouncedPeriodo

  const financeiros = financeirosResponse?.data || []
  const totalCount = financeirosResponse?.total || 0
  const totalPages = financeirosResponse?.totalPages || 0
  const hasNext = financeirosResponse?.hasNext || 0
  const hasPrev = financeirosResponse?.hasPrev || 0

  // Usar dados diretamente do backend (filtros aplicados no servidor)
  const filteredFinanceiros = Array.isArray(financeiros) ? (financeiros as FinanceiroType[]) : []

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

  const handleOpenImportarModal = () => {
    setIsImportarModalOpen(true)
  }

  const handleCloseImportarModal = () => {
    setIsImportarModalOpen(false)
  }

  const handleOpenUploadNotaModal = (idPrestador: number, periodo: string, prestadorNome?: string) => {
    setUploadNotaData({ idPrestador, periodo, prestadorNome })
    setIsUploadNotaModalOpen(true)
  }

  const handleCloseUploadNotaModal = () => {
    setIsUploadNotaModalOpen(false)
    setUploadNotaData(null)
  }

  const handleCloseDetailModal = () => {
    setSelectedFinanceiroIndex(null)
    // Invalidate and refetch financeiros data when closing modal
    queryClient.invalidateQueries({ queryKey: ['financeiros'] })
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  // Handle individual search field changes
  const handleNomePrestadorChange = (value: string) => {
    setNomePrestador(value)
  }

  const handleIdentificacaoPrestadorChange = (value: string) => {
    setIdentificacaoPrestador(value)
  }

  const handlePeriodoChange = (value: string) => {
    setPeriodo(value)
  }

  // Clear all search fields
  const handleClearSearch = () => {
    setNomePrestador("")
    setIdentificacaoPrestador("")
    setPeriodo("")
    setPage(1)
  }

  // Generate pagination items
  const renderPaginationItems = () => {
    const currentPage = page
    const items = []

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink isActive={currentPage === 1} onClick={() => handlePageChange(1)}>
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Show current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue // Skip first and last as they're always shown
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink isActive={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
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
                  Visualize e gerencie todos os registros financeiros ({totalCount} registros)
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <PermissionGuard permission="importar_financeiro">
                <Button
                  onClick={handleOpenCreateModal}
                  className="bg-red-700 hover:bg-red-800 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Registro
                </Button>
              </PermissionGuard>
              <PermissionGuard permission="importar_financeiro">
                <Button
                  variant="outline"
                  onClick={handleOpenImportarModal}
                >
                  Importar por Prestador
                </Button>
              </PermissionGuard>
              <PermissionGuard permission="importar_financeiro">
                <Button
                  variant="outline"
                  onClick={() => importarTodosMutation.mutate()}
                  disabled={importarTodosMutation.isPending}
                >
                  {importarTodosMutation.isPending ? 'Importando Todos...' : 'Importar Todos'}
                </Button>
              </PermissionGuard>
            </div>
          </div>

          {/* Search Fields */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome do Prestador..."
                  value={nomePrestador}
                  onChange={(e) => handleNomePrestadorChange(e.target.value)}
                  className={`pl-10 h-12 border-gray-200 focus:border-red-600 focus:ring-red-600 ${
                    nomePrestador !== debouncedNomePrestador ? 'border-orange-300 bg-orange-50' : ''
                  }`}
                />
                {nomePrestador !== debouncedNomePrestador && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Identificação do Prestador..."
                  value={identificacaoPrestador}
                  onChange={(e) => handleIdentificacaoPrestadorChange(e.target.value)}
                  className={`pl-10 h-12 border-gray-200 focus:border-red-600 focus:ring-red-600 ${
                    identificacaoPrestador !== debouncedIdentificacaoPrestador ? 'border-orange-300 bg-orange-50' : ''
                  }`}
                />
                {identificacaoPrestador !== debouncedIdentificacaoPrestador && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Período..."
                  value={periodo}
                  onChange={(e) => handlePeriodoChange(e.target.value)}
                  className={`pl-10 h-12 border-gray-200 focus:border-red-600 focus:ring-red-600 ${
                    periodo !== debouncedPeriodo ? 'border-orange-300 bg-orange-50' : ''
                  }`}
                />
                {periodo !== debouncedPeriodo && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClearSearch}
                  className="h-12 px-4 border-gray-200 hover:border-red-600"
                >
                  Limpar
                </Button>
              </div>
            </div>
            {isSearching && (
              <p className="text-sm text-orange-600 mt-2">
                ⏳ Pesquisando... (aguarde 0.5s)
              </p>
            )}
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
                          <PermissionGuard permissions={["visualizar_todos_financeiros", "visualizar_nota_fiscal", "registrar_baixa"]}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Ações</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <PermissionGuard permissions={["visualizar_todos_financeiros", "visualizar_seu_financeiro"]}>
                                  <DropdownMenuItem onClick={() => setSelectedFinanceiroIndex(index)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver itens
                                  </DropdownMenuItem>
                                </PermissionGuard>
                                <PermissionGuard permissions={["visualizar_todos_financeiros", "visualizar_seu_financeiro"]}>
                                  <DropdownMenuItem
                                    disabled={!financeiro.baixado}
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
                                </PermissionGuard>
                                <PermissionGuard permission="visualizar_nota_fiscal">
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
                                </PermissionGuard>
                                <PermissionGuard permission="upload_nota_fiscal">
                                  <DropdownMenuItem
                                    disabled={!!financeiro.nome_arquivo}
                                    onClick={() => handleOpenUploadNotaModal(
                                      financeiro.id_prestador,
                                      financeiro.periodo,
                                      financeiro.prestador?.nome
                                    )}
                                  >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Nota
                                  </DropdownMenuItem>
                                </PermissionGuard>
                                <PermissionGuard permission="registrar_baixa">
                                  <DropdownMenuItem onClick={() => handleOpenEditModal(index)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar registro
                                  </DropdownMenuItem>
                                </PermissionGuard>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </PermissionGuard>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Contador de registros e paginação */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Exibindo {financeiros.length} de {totalCount} registros
              </div>

              <Pagination className="mx-auto sm:mx-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      className={!hasPrev ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                      className={!hasNext ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={selectedFinanceiroIndex !== null} onOpenChange={handleCloseDetailModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Detalhes do Registro Financeiro</DialogTitle>
                <DialogDescription>
                  Informações detalhadas sobre o registro financeiro e seus itens.
                </DialogDescription>
              </div>
              {selectedFinanceiroData && (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <PermissionGuard permission="upload_nota_fiscal">
                      <Button
                        variant="outline"
                        disabled={!!selectedFinanceiroData.nome_arquivo}
                        onClick={() => handleOpenUploadNotaModal(
                          selectedFinanceiroData.id_prestador,
                          selectedFinanceiroData.periodo,
                          selectedFinanceiroData.prestador?.nome
                        )}
                        className="border-green-600 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Nota
                      </Button>
                    </PermissionGuard>
                    <Button
                      variant="outline"
                      disabled={!selectedFinanceiroData.baixado}
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
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Gerar PDF
                    </Button>
                  </div>
                  {!selectedFinanceiroData.baixado && (
                    <p className="text-xs text-amber-600">
                      ⚠️ O PDF só pode ser gerado após o registro ser marcado como baixado.
                    </p>
                  )}
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
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
                        {selectedFinanceiroData.baixado ? (
                          <PermissionGuard permission="retirar_baixa">
                            <Button
                              className="bg-red-100 text-red-800 hover:bg-red-200"
                              size="sm"
                              onClick={async () => {
                                if (!selectedFinanceiroData) return
                                await toggleBaixaMutation.mutateAsync({
                                  id_prestador: selectedFinanceiroData.id_prestador,
                                  periodo: selectedFinanceiroData.periodo,
                                  toBaixado: false,
                                })
                                // Invalidate and refetch financeiros data
                                await queryClient.invalidateQueries({ queryKey: ['financeiros'] })
                              }}
                              disabled={toggleBaixaMutation.isPending}
                            >
                              {toggleBaixaMutation.isPending ? 'Atualizando...' : 'Marcar como Pendente'}
                            </Button>
                          </PermissionGuard>
                        ) : (
                          <PermissionGuard permission="registrar_baixa">
                            <Button
                              className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              size="sm"
                              onClick={async () => {
                                if (!selectedFinanceiroData) return
                                await toggleBaixaMutation.mutateAsync({
                                  id_prestador: selectedFinanceiroData.id_prestador,
                                  periodo: selectedFinanceiroData.periodo,
                                  toBaixado: true,
                                })
                                // Invalidate and refetch financeiros data
                                await queryClient.invalidateQueries({ queryKey: ['financeiros'] })
                              }}
                              disabled={toggleBaixaMutation.isPending}
                            >
                              {toggleBaixaMutation.isPending ? 'Atualizando...' : 'Marcar como Baixado'}
                            </Button>
                          </PermissionGuard>
                        )}
                      </div>
                      <div>Data de Baixa:</div>
                      <div>{selectedFinanceiroData.baixado_em ? new Date(selectedFinanceiroData.baixado_em as unknown as string).toLocaleDateString('pt-BR') : '-'}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Registros Financeiros</h3>
                  <div className="rounded-md border max-h-96 overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-white z-10">
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

      <ImportarFinanceiroModal
        isOpen={isImportarModalOpen}
        onClose={handleCloseImportarModal}
      />

      {uploadNotaData && (
        <UploadNotaModal
          isOpen={isUploadNotaModalOpen}
          onClose={handleCloseUploadNotaModal}
          idPrestador={uploadNotaData.idPrestador}
          periodo={uploadNotaData.periodo}
          prestadorNome={uploadNotaData.prestadorNome}
        />
      )}
    </div>
  )
} 
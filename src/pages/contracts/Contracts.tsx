import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Download, Edit, MoreHorizontal, Plus, Search, Trash2, Upload, FileText } from "lucide-react"
import { useState } from "react"
import { ContractModal } from "./components/contract-modal"
import { useGetContratos } from "./hooks/use-get-contratos"
import { useDeleteContrato } from "./hooks/use-delete-contrato"
import { useDownloadArquivo } from "./hooks/use-download-arquivo"
import { Loader2 } from "lucide-react"
import { AxiosError } from "axios"
import { useUpdateContrato } from "./hooks/use-update-contrato"
import { PermissionGuard } from "@/components/ui/permission-guard"

export const Contracts = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContratoId, setSelectedContratoId] = useState<string>()

  const { data: contratosResponse, isLoading } = useGetContratos({
    page,
    limit
  })

  const contratos = contratosResponse?.data || []
  const totalCount = contratosResponse?.total || 0
  const totalPages = contratosResponse?.totalPages || 0
  const hasNext = contratosResponse?.hasNext || false
  const hasPrev = contratosResponse?.hasPrev || false

  const deleteContrato = useDeleteContrato()
  const updateContrato = useUpdateContrato()
  const downloadArquivo = useDownloadArquivo()

  // Filter contracts (client-side filtering for search)
  const filteredContracts = contratos.filter(
    (contract) =>
      String(contract.id).toLowerCase().includes(search.toLowerCase()) ||
      (contract.prestador?.nome || '').toLowerCase().includes(search.toLowerCase()) ||
      (contract.competencia || '').toLowerCase().includes(search.toLowerCase()) ||
      (contract.criador?.nome || '').toLowerCase().includes(search.toLowerCase()),
  )

  const sortedContracts = [...filteredContracts].sort((a, b) => {
    const fieldA = a[sortField as keyof typeof a]
    const fieldB = b[sortField as keyof typeof b]

    if (!fieldA || !fieldB) return 0
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (field: string) => {
    const direction = field === sortField && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(direction)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1) // Reset to first page when searching
  }

  const handleOpenCreateModal = () => {
    setSelectedContratoId(undefined)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (contratoId: string) => {
    setSelectedContratoId(contratoId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedContratoId(undefined)
  }

  const handleDeleteContrato = async (contratoId: string) => {
    try {
      await deleteContrato.mutateAsync(contratoId)
    } catch {
      // Error is handled by the mutation
    }
  }

  const handleFileUpload = async (contratoId: string, file: File) => {
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64String = e.target?.result?.toString().split(',')[1]
        if (!base64String) {
          toast.error("Erro ao processar arquivo", {
            description: "Não foi possível processar o arquivo selecionado."
          })
          return
        }

        try {
          await updateContrato.mutateAsync({
            id: contratoId,
            arquivo: base64String,
          })
          toast.success("Arquivo anexado", {
            description: "O arquivo foi anexado ao contrato com sucesso."
          })
        } catch (error) {
          const axiosError = error as AxiosError<{ message: string }>
          toast.error("Erro ao anexar arquivo", {
            description: axiosError.response?.data?.message || "Ocorreu um erro ao tentar anexar o arquivo ao contrato."
          })
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      const fileError = error as Error
      toast.error("Erro ao processar arquivo", {
        description: fileError.message || "Ocorreu um erro ao tentar processar o arquivo."
      })
    }
  }

  const handleFileSelect = (contratoId: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        handleFileUpload(contratoId, file)
      }
    }
    input.click()
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
              <FileText className="h-8 w-8 text-red-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Gestão de Contratos
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Gerencie os contratos dos prestadores de serviço
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
                  Contratos Cadastrados
                </h2>
                <p className="text-gray-600">
                  Visualize e gerencie todos os contratos do sistema
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <PermissionGuard permission="criar_contrato">
                <Button 
                  onClick={handleOpenCreateModal}
                  className="bg-red-700 hover:bg-red-800 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Contrato
                </Button>
              </PermissionGuard>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar contratos..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
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
                    <TableHead className="font-semibold text-gray-700 py-4 cursor-pointer" onClick={() => handleSort("id")}>
                      <div className="flex items-center">
                        ID
                        <span className="ml-1">{sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 cursor-pointer" onClick={() => handleSort("prestador")}>
                      <div className="flex items-center">
                        Prestador
                        <span className="ml-1">{sortField === "prestador" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 cursor-pointer" onClick={() => handleSort("competencia")}>
                      <div className="flex items-center">
                        Início Vigência
                        <span className="ml-1">
                          {sortField === "competencia" && (sortDirection === "asc" ? "↑" : "↓")}
                        </span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 cursor-pointer hidden md:table-cell" onClick={() => handleSort("criador")}>
                      <div className="flex items-center">
                        Criador
                        <span className="ml-1">{sortField === "criador" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 cursor-pointer hidden md:table-cell" onClick={() => handleSort("data_criacao")}>
                      <div className="flex items-center">
                        Criado em
                        <span className="ml-1">{sortField === "data_criacao" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-semibold text-gray-700 py-4 cursor-pointer hidden lg:table-cell"
                      onClick={() => handleSort("data_ultima_atualizacao")}
                    >
                      <div className="flex items-center">
                        Última atualização
                        <span className="ml-1">
                          {sortField === "data_ultima_atualizacao" && (sortDirection === "asc" ? "↑" : "↓")}
                        </span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 cursor-pointer" onClick={() => handleSort("ativo")}>
                      <div className="flex items-center">
                        Status
                        <span className="ml-1">{sortField === "ativo" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-700"></div>
                          <span className="text-gray-600 font-medium">Carregando contratos...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : sortedContracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <FileText className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhum contrato encontrado</h3>
                            <p className="text-gray-600">Não há contratos cadastrados no sistema.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedContracts.map((contract) => (
                      <TableRow key={contract.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-medium text-gray-900 py-4">{contract.id}</TableCell>
                        <TableCell className="py-4 text-gray-700">{contract.prestador?.nome || 'Não definido'}</TableCell>
                        <TableCell className="py-4 text-gray-700">{contract.competencia || 'Não definido'}</TableCell>
                        <TableCell className="py-4 text-gray-700 hidden md:table-cell">{contract.criador?.nome || 'Não definido'}</TableCell>
                        <TableCell className="py-4 text-gray-700 hidden md:table-cell">
                          {contract.data_criacao ? new Date(contract.data_criacao).toLocaleDateString("pt-BR") : 'Não definido'}
                        </TableCell>
                        <TableCell className="py-4 text-gray-700 hidden lg:table-cell">
                          {contract.data_ultima_atualizacao ? new Date(contract.data_ultima_atualizacao).toLocaleDateString("pt-BR") : 'Não definido'}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            contract.ativo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {contract.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <PermissionGuard permissions={["visualizar_arquivo_contrato", "atualizar_arquivo_contrato", "atualizar_contrato", "excluir_contrato"]}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Ações</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {contract.arquivo ? (
                                  <PermissionGuard permission="visualizar_arquivo_contrato">
                                    <DropdownMenuItem
                                      onClick={() => downloadArquivo.mutate(contract.id)}
                                      disabled={downloadArquivo.isPending}
                                    >
                                      {downloadArquivo.isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      ) : (
                                        <Download className="mr-2 h-4 w-4" />
                                      )}
                                      {downloadArquivo.isPending ? 'Baixando...' : 'Baixar contrato'}
                                    </DropdownMenuItem>
                                  </PermissionGuard>
                                ) : (
                                  <PermissionGuard permission="atualizar_arquivo_contrato">
                                    <DropdownMenuItem onClick={() => handleFileSelect(contract.id)}>
                                      <Upload className="mr-2 h-4 w-4" />
                                      Anexar contrato
                                    </DropdownMenuItem>
                                  </PermissionGuard>
                                )}
                                <PermissionGuard permission="atualizar_contrato">
                                  <DropdownMenuItem onClick={() => handleOpenEditModal(contract.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar contrato
                                  </DropdownMenuItem>
                                </PermissionGuard>
                                <PermissionGuard permission="excluir_contrato">
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteContrato(contract.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir contrato
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

            {/* Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Exibindo {sortedContracts.length} de {totalCount} resultados
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

      <ContractModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contratoId={selectedContratoId}
      />
    </div>
  )
}

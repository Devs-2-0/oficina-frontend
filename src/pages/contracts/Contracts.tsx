import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Download, Edit, MoreHorizontal, Plus, Search, Trash2, Upload } from "lucide-react"
import { useState } from "react"
import { ContractModal } from "./components/contract-modal"
import { useGetContratos } from "./hooks/use-get-contratos"
import { useDeleteContrato } from "./hooks/use-delete-contrato"

import { useDownloadArquivo } from "./hooks/use-download-arquivo"
import { Loader2 } from "lucide-react"
import { AxiosError } from "axios"
import { useUpdateContrato } from "./hooks/use-update-contrato"

export const Contracts = () => {
  const { toast } = useToast()
  const { data: contratos = [], isLoading } = useGetContratos()
  const deleteContrato = useDeleteContrato()
  const updateContrato = useUpdateContrato()
  const downloadArquivo = useDownloadArquivo()

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 10
  const [sortField, setSortField] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContratoId, setSelectedContratoId] = useState<string>()

  // Filter and sort contracts
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

  // Pagination
  const totalPages = Math.ceil(sortedContracts.length / perPage)
  const paginatedContracts = sortedContracts.slice((page - 1) * perPage, page * perPage)

  const handleSearch = () => {
    setPage(1)
  }

  const handleSort = (field: string) => {
    const direction = field === sortField && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(direction)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
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
          toast({
            title: "Erro ao processar arquivo",
            description: "Não foi possível processar o arquivo selecionado.",
            variant: "destructive",
          })
          return
        }

        try {
          await updateContrato.mutateAsync({
            id: contratoId,
            arquivo: base64String,
          })
          toast({
            title: "Arquivo anexado",
            description: "O arquivo foi anexado ao contrato com sucesso.",
          })
        } catch (error) {
          const axiosError = error as AxiosError<{ message: string }>
          toast({
            title: "Erro ao anexar arquivo",
            description: axiosError.response?.data?.message || "Ocorreu um erro ao tentar anexar o arquivo ao contrato.",
            variant: "destructive",
          })
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      const fileError = error as Error
      toast({
        title: "Erro ao processar arquivo",
        description: fileError.message || "Ocorreu um erro ao tentar processar o arquivo.",
        variant: "destructive",
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
    <div className="container py-6 space-y-6">
      <PageHeader title="Contratos" description="Gerencie os contratos dos prestadores de serviço" />

      <ContractModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contratoId={selectedContratoId}
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Buscar contratos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
              <Button type="submit" size="sm" onClick={handleSearch}>
                <Search className="h-4 w-4" />
                <span className="sr-only">Buscar</span>
              </Button>
            </div>

            <Button size="sm" onClick={handleOpenCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Contrato
            </Button>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                    <div className="flex items-center">
                      ID
                      <span className="ml-1">{sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("prestador")}>
                    <div className="flex items-center">
                      Prestador
                      <span className="ml-1">{sortField === "prestador" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("competencia")}>
                    <div className="flex items-center">
                      Competência
                      <span className="ml-1">
                        {sortField === "competencia" && (sortDirection === "asc" ? "↑" : "↓")}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("criador")}>
                    <div className="flex items-center">
                      Criador
                      <span className="ml-1">{sortField === "criador" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("data_criacao")}>
                    <div className="flex items-center">
                      Criado em
                      <span className="ml-1">{sortField === "data_criacao" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hidden lg:table-cell"
                    onClick={() => handleSort("data_ultima_atualizacao")}
                  >
                    <div className="flex items-center">
                      Última atualização
                      <span className="ml-1">
                        {sortField === "data_ultima_atualizacao" && (sortDirection === "asc" ? "↑" : "↓")}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Carregando contratos...
                    </TableCell>
                  </TableRow>
                ) : paginatedContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum contrato encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.id}</TableCell>
                      <TableCell>{contract.prestador?.nome || 'Não definido'}</TableCell>
                      <TableCell>{contract.competencia || 'Não definido'}</TableCell>
                      <TableCell className="hidden md:table-cell">{contract.criador?.nome || 'Não definido'}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {contract.data_criacao ? new Date(contract.data_criacao).toLocaleDateString("pt-BR") : 'Não definido'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {contract.data_ultima_atualizacao ? new Date(contract.data_ultima_atualizacao).toLocaleDateString("pt-BR") : 'Não definido'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {contract.arquivo ? (
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
                            ) : (
                              <DropdownMenuItem onClick={() => handleFileSelect(contract.id)}>
                                <Upload className="mr-2 h-4 w-4" />
                                Anexar contrato
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleOpenEditModal(contract.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar contrato
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteContrato(contract.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir contrato
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

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Exibindo {Math.min(perPage, filteredContracts.length)} de {filteredContracts.length} resultados
            </div>

            <Pagination className="mx-auto sm:mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                    className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

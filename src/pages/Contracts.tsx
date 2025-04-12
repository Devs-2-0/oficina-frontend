import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Download, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

const contracts = [
  {
    id: "CT-001",
    prestador: "João Silva",
    competencia: "Desenvolvimento Web",
    criador: "Maria Oliveira",
    criadoEm: "2023-03-15T10:30:00Z",
    ultimaAtualizacao: "2023-04-01T14:45:00Z",
  },
  {
    id: "CT-002",
    prestador: "Ana Santos",
    competencia: "Design Gráfico",
    criador: "Carlos Pereira",
    criadoEm: "2023-03-18T09:15:00Z",
    ultimaAtualizacao: "2023-03-25T11:20:00Z",
  },
  {
    id: "CT-003",
    prestador: "Pedro Costa",
    competencia: "Consultoria Financeira",
    criador: "Fernanda Lima",
    criadoEm: "2023-03-20T13:45:00Z",
    ultimaAtualizacao: "2023-04-02T16:30:00Z",
  },
  {
    id: "CT-004",
    prestador: "Mariana Alves",
    competencia: "Marketing Digital",
    criador: "Roberto Souza",
    criadoEm: "2023-03-22T15:00:00Z",
    ultimaAtualizacao: "2023-03-30T10:15:00Z",
  },
  {
    id: "CT-005",
    prestador: "Lucas Ferreira",
    competencia: "Suporte Técnico",
    criador: "Juliana Martins",
    criadoEm: "2023-03-25T11:30:00Z",
    ultimaAtualizacao: "2023-04-03T09:45:00Z",
  },
  {
    id: "CT-006",
    prestador: "Camila Rodrigues",
    competencia: "Análise de Dados",
    criador: "André Gomes",
    criadoEm: "2023-03-28T14:15:00Z",
    ultimaAtualizacao: "2023-04-05T13:20:00Z",
  },
  {
    id: "CT-007",
    prestador: "Rafael Mendes",
    competencia: "Recursos Humanos",
    criador: "Patrícia Nunes",
    criadoEm: "2023-03-30T10:45:00Z",
    ultimaAtualizacao: "2023-04-06T15:30:00Z",
  },
  {
    id: "CT-008",
    prestador: "Isabela Castro",
    competencia: "Contabilidade",
    criador: "Marcelo Dias",
    criadoEm: "2023-04-01T09:30:00Z",
    ultimaAtualizacao: "2023-04-07T11:15:00Z",
  },
  {
    id: "CT-009",
    prestador: "Gabriel Oliveira",
    competencia: "Desenvolvimento Mobile",
    criador: "Carla Sousa",
    criadoEm: "2023-04-02T13:45:00Z",
    ultimaAtualizacao: "2023-04-08T16:30:00Z",
  },
  {
    id: "CT-010",
    prestador: "Juliana Lima",
    competencia: "UX/UI Design",
    criador: "Ricardo Almeida",
    criadoEm: "2023-04-03T10:15:00Z",
    ultimaAtualizacao: "2023-04-09T14:45:00Z",
  },
  {
    id: "CT-011",
    prestador: "Marcos Santos",
    competencia: "Segurança da Informação",
    criador: "Fernanda Costa",
    criadoEm: "2023-04-04T09:30:00Z",
    ultimaAtualizacao: "2023-04-10T11:20:00Z",
  },
  {
    id: "CT-012",
    prestador: "Luciana Ferreira",
    competencia: "Gestão de Projetos",
    criador: "Paulo Mendes",
    criadoEm: "2023-04-05T14:00:00Z",
    ultimaAtualizacao: "2023-04-11T15:45:00Z",
  },
]

export const Contracts = () => {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Use regular state instead of nuqs
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 10 // Fixed at 10 items per page
  const [sortField, setSortField] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")

  // Filter and sort contracts
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.id.toLowerCase().includes(search.toLowerCase()) ||
      contract.prestador.toLowerCase().includes(search.toLowerCase()) ||
      contract.competencia.toLowerCase().includes(search.toLowerCase()) ||
      contract.criador.toLowerCase().includes(search.toLowerCase()),
  )

  const sortedContracts = [...filteredContracts].sort((a, b) => {
    const fieldA = a[sortField as keyof typeof a]
    const fieldB = b[sortField as keyof typeof b]

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const downloadContract = (id: string) => {
    toast({
      title: "Contrato baixado",
      description: `O contrato ${id} foi baixado com sucesso.`,
      duration: 3000,
    })
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

            {true && (
              <Button
                size="sm"
                onClick={() =>
                  toast({
                    title: "Novo contrato",
                    description: "Funcionalidade em desenvolvimento.",
                    duration: 3000,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Contrato
              </Button>
            )}
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
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("criadoEm")}>
                    <div className="flex items-center">
                      Criado em
                      <span className="ml-1">{sortField === "criadoEm" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hidden lg:table-cell"
                    onClick={() => handleSort("ultimaAtualizacao")}
                  >
                    <div className="flex items-center">
                      Última atualização
                      <span className="ml-1">
                        {sortField === "ultimaAtualizacao" && (sortDirection === "asc" ? "↑" : "↓")}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum contrato encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.id}</TableCell>
                      <TableCell>{contract.prestador}</TableCell>
                      <TableCell>{contract.competencia}</TableCell>
                      <TableCell className="hidden md:table-cell">{contract.criador}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(contract.criadoEm)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatDate(contract.ultimaAtualizacao)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => downloadContract(contract.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Baixar contrato
                            </DropdownMenuItem>
                            {true && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    toast({
                                      title: "Editar contrato",
                                      description: `Editando contrato ${contract.id}`,
                                      duration: 3000,
                                    })
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar contrato
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    toast({
                                      title: "Excluir contrato",
                                      description: `Contrato ${contract.id} excluído com sucesso.`,
                                      variant: "destructive",
                                      duration: 3000,
                                    })
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir contrato
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    toast({
                                      title: "Excluir prestador",
                                      description: `Prestador ${contract.prestador} excluído com sucesso.`,
                                      variant: "destructive",
                                      duration: 3000,
                                    })
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir prestador
                                </DropdownMenuItem>
                              </>
                            )}
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

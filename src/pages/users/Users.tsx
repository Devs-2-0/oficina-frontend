import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Edit, MoreHorizontal, Search, Trash2, UserPlus, Users as UsersIcon } from "lucide-react"
import { useState } from "react"
import { useGetUsers } from "./hooks/use-get-users"
import { UserModal } from "./components/user-modal"
import { useDeleteUserMutation } from "./hooks/use-delete-user"
import { PermissionGuard } from "@/components/ui/permission-guard"

export const Users = () => {
  const { toast } = useToast()

  // Use regular state instead of nuqs
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 10 // Fixed at 10 items per page
  const [sortField, setSortField] = useState("matricula")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined)

  const users = useGetUsers()

  console.log(users.data)

  const deleteUser = useDeleteUserMutation()

  // Filter users
  const filteredUsers = users.data.filter(
    (user) =>
      user.nome?.toLowerCase().includes(search.toLowerCase()) ||
      user.matricula?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.nome_usuario?.toLowerCase().includes(search.toLowerCase()),
  )

  // Sort users
  const sortedUsers = filteredUsers.sort((a, b) => {
    const fieldA = a[sortField as keyof typeof a]
    const fieldB = b[sortField as keyof typeof b]

    if (fieldA && fieldB) {
      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1
    }
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / perPage)
  const paginatedUsers = sortedUsers.slice((page - 1) * perPage, page * perPage)



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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-500">Ativo</Badge>
      case "ferias":
        return <Badge className="bg-blue-500">Férias</Badge>
      case "demitido":
        return <Badge className="bg-red-500">Demitido</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case "admin":
        return <Badge className="bg-purple-500">ADMINISTRADOR</Badge>
      case "prestador":
        return <Badge className="bg-blue-500">PRESTADOR</Badge>
      case "funcionario":
        return <Badge className="bg-green-500">FUNCIONÁRIO</Badge>
      default:
        return <Badge>{tipo?.toUpperCase()}</Badge>
    }
  }

  const handleOpenCreateModal = () => {
    setSelectedUserId(undefined)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (userId: number, tipo: string) => {
    if (tipo?.toLowerCase() === "prestador") {
      toast({
        title: "Ação não permitida",
        description: "Usuários do tipo prestador não podem ser editados.",
        variant: "destructive"
      })
      return
    }
    setSelectedUserId(userId?.toString())
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
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
              <UsersIcon className="h-8 w-8 text-red-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Usuários
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Gerencie os usuários do sistema
              </p>
            </div>
          </div>
        </div>

        {/* Usuários Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserPlus className="h-5 w-5 text-red-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                Lista de Usuários
              </h2>
              <p className="text-gray-600">
                Visualize e gerencie todos os usuários cadastrados no sistema
              </p>
            </div>
            <PermissionGuard permission="criar_usuario">
              <Button 
                onClick={handleOpenCreateModal}
                className="bg-red-700 hover:bg-red-800 text-white border-red-700 hover:border-red-800"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </PermissionGuard>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar usuários..."
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
                    <TableHead className="cursor-pointer font-semibold text-gray-700 py-4" onClick={() => handleSort("matricula")}>
                      <div className="flex items-center">
                        Matrícula
                        <span className="ml-1">{sortField === "matricula" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer font-semibold text-gray-700 py-4" onClick={() => handleSort("nome")}>
                      <div className="flex items-center">
                        Nome
                        <span className="ml-1">{sortField === "nome" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hidden md:table-cell font-semibold text-gray-700 py-4" onClick={() => handleSort("nome_usuario")}>
                      <div className="flex items-center">
                        Username
                        <span className="ml-1">{sortField === "nome_usuario" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hidden md:table-cell font-semibold text-gray-700 py-4" onClick={() => handleSort("email")}>
                      <div className="flex items-center">
                        Email
                        <span className="ml-1">{sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer font-semibold text-gray-700 py-4" onClick={() => handleSort("tipo")}>
                      <div className="flex items-center">
                        Tipo
                        <span className="ml-1">{sortField === "tipo" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer font-semibold text-gray-700 py-4" onClick={() => handleSort("status")}>
                      <div className="flex items-center">
                        Status
                        <span className="ml-1">{sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hidden lg:table-cell font-semibold text-gray-700 py-4" onClick={() => handleSort("grupo")}>
                      <div className="flex items-center">
                        Grupo
                        <span className="ml-1">{sortField === "grupo" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hidden lg:table-cell font-semibold text-gray-700 py-4"
                      onClick={() => handleSort("data_ultima_atualizacao")}
                    >
                      <div className="flex items-center">
                        Atualizado em
                        <span className="ml-1">
                          {sortField === "data_ultima_atualizacao" && (sortDirection === "asc" ? "↑" : "↓")}
                        </span>
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <UserPlus className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhum usuário encontrado</h3>
                            <p className="text-gray-600">Não há usuários cadastrados no sistema.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => (
                      <TableRow 
                        key={user?.id} 
                        className={`${user?.tipo?.toLowerCase() === "prestador" ? "opacity-75" : ""} hover:bg-gray-50/50 transition-colors`}
                      >
                        <TableCell className="font-medium text-gray-900 py-4">{user?.matricula}</TableCell>
                        <TableCell className="py-4 text-gray-700">{user?.nome}</TableCell>
                        <TableCell className="hidden md:table-cell py-4 text-gray-700">{user?.nome_usuario}</TableCell>
                        <TableCell className="hidden md:table-cell py-4 text-gray-700">{user?.email}</TableCell>
                        <TableCell className="py-4">{getTipoBadge(user?.tipo)}</TableCell>
                        <TableCell className="py-4">{getStatusBadge(user?.status)}</TableCell>
                        <TableCell className="hidden lg:table-cell py-4 text-gray-700">{typeof user?.grupo === 'object' ? user?.grupo?.nome : user?.grupo}</TableCell>
                        <TableCell className="hidden lg:table-cell py-4 text-gray-700">{formatDate(user?.data_ultima_atualizacao)}</TableCell>
                        <TableCell className="text-right py-4">
                          <PermissionGuard permissions={["atualizar_usuario", "excluir_usuario"]}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Ações</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <PermissionGuard permission="atualizar_usuario">
                                  <DropdownMenuItem
                                    onClick={() => handleOpenEditModal(user?.id, user?.tipo)}
                                    className={user?.tipo?.toLowerCase() === "prestador" ? "cursor-not-allowed opacity-50" : ""}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar usuário
                                  </DropdownMenuItem>
                                </PermissionGuard>
                                <PermissionGuard permission="excluir_usuario">
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={async () => await deleteUser.mutateAsync(user.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir usuário
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
          </Card>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Exibindo {Math.min(perPage, filteredUsers.length)} de {filteredUsers.length} resultados
            </div>

            <Pagination className="mx-auto sm:mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    className={`${page <= 1 ? "pointer-events-none opacity-50" : ""} hover:bg-red-100 dark:hover:bg-red-900/50`}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                    className={`${page >= totalPages ? "pointer-events-none opacity-50" : ""} hover:bg-red-100 dark:hover:bg-red-900/50`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        {/* Usando nosso novo componente UserModal */}
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userId={selectedUserId}
        />
      </div>
    </div>
  )
}
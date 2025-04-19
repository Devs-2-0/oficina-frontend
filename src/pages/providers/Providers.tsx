import { PageHeader } from "@/components/dashboard/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search } from "lucide-react"
import { useState } from "react"
import { useGetPrestadores } from "./hooks/use-get-prestadores"
import { ProviderModal } from "./components/provider-modal"
import { Prestador } from "@/types/prestador"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDeletePrestador } from "./hooks/use-delete-prestador"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export function Providers() {
  const pagina = 1
  const limite = 10

  const [prestadorSelecionado, setPrestadorSelecionado] = useState<Prestador>()
  const [modalAberto, setModalAberto] = useState(false)
  const [prestadorParaExcluir, setPrestadorParaExcluir] = useState<string>()

  const { data, isLoading } = useGetPrestadores(pagina, limite)
  const { mutate: excluirPrestador } = useDeletePrestador()

  const handleExcluir = (id: string) => {
    if (data?.prestadores.find(p => p.id === id)?.contratos ?? 0 > 0) {
      toast.error('Não é possível excluir um prestador com contratos ativos')
      return
    }
    setPrestadorParaExcluir(id)
  }

  const confirmarExclusao = () => {
    if (prestadorParaExcluir) {
      excluirPrestador(prestadorParaExcluir)
      setPrestadorParaExcluir(undefined)
    }
  }

  return (
    <div className="container py-6 space-y-6">
      <PageHeader title="Prestadores" description="Gerencie prestadores de serviço" />

      <div className="rounded-md border">
        <div className="p-4 flex items-center gap-2">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Buscar prestadores..."
                className="pl-8"
              />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contratos</TableHead>
              <TableHead className="w-[48px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : data?.prestadores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhum prestador encontrado
                </TableCell>
              </TableRow>
            ) : (
              data?.prestadores.map((prestador) => (
                <TableRow key={prestador.id}>
                  <TableCell>{prestador.id}</TableCell>
                  <TableCell>{prestador.nome}</TableCell>
                  <TableCell>{prestador.email}</TableCell>
                  <TableCell>{prestador.especialidade}</TableCell>
                  <TableCell>
                    <Badge variant={prestador.status === 'Ativo' ? 'default' : 'secondary'}>
                      {prestador.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{prestador.contratos}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setPrestadorSelecionado(prestador)
                          setModalAberto(true)
                        }}>
                          Editar prestador
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExcluir(prestador.id)}>
                          Excluir prestador
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

      <ProviderModal
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false)
          setPrestadorSelecionado(undefined)
        }}
        prestador={prestadorSelecionado}
      />

      <AlertDialog open={!!prestadorParaExcluir} onOpenChange={() => setPrestadorParaExcluir(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir prestador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este prestador? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

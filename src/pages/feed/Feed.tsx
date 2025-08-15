import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { usePostagens } from "./hooks/use-postagens"
import { useNaoVisualizadas } from "./hooks/use-nao-visualizadas"
import { PostCard } from "./components/post-card"
import { PostSkeleton } from "./components/post-skeleton"
import { CriarPostDialog } from "./components/criar-post-dialog"
import { Bell, MessageSquare, Plus } from "lucide-react"
import { useVisualizarTodos } from "./hooks/use-visualizar-todos"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { PermissionGuard } from "@/components/ui/permission-guard"

export function Feed() {
  const [dialogAberto, setDialogAberto] = useState(false)
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false)
  const { postagens, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, marcarPostComoLido } = usePostagens()
  const { quantidadeNaoVisualizadas } = useNaoVisualizadas()
  const { mutateAsync: visualizarTodos, isPending: visualizarTodosPending } = useVisualizarTodos()

  const handleVisualizarTodos = async () => {
    await visualizarTodos()
    setConfirmacaoAberta(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <MessageSquare className="h-8 w-8 text-red-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Feed de Comunicações
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Acompanhe as últimas atualizações e comunicados da empresa
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Bell className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Publicações Recentes
                </h2>
                <p className="text-gray-600">
                  Visualize e gerencie as publicações do feed
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <PermissionGuard permission="visualizar_post">
                <Button
                  variant="outline"
                  className="relative bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-red-300"
                  onClick={() => setConfirmacaoAberta(true)}
                  disabled={!quantidadeNaoVisualizadas || visualizarTodosPending}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  {visualizarTodosPending ? "Marcando..." : "Marcar todos como lidos"}
                  {quantidadeNaoVisualizadas > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white font-medium">
                      {quantidadeNaoVisualizadas}
                    </span>
                  )}
                </Button>
              </PermissionGuard>

              <PermissionGuard permission="criar_post">
                <Button 
                  onClick={() => setDialogAberto(true)}
                  className="bg-red-700 hover:bg-red-800 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Publicação
                </Button>
              </PermissionGuard>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          {isLoading ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="p-6">
                <div className="space-y-4">
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </div>
              </div>
            </Card>
          ) : (
            <>
              {postagens.length > 0 ? (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="space-y-4">
                      {postagens.map(post => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onMarcarComoLido={marcarPostComoLido}
                        />
                      ))}
                    </div>

                    {hasNextPage && (
                      <div className="flex justify-center mt-6 pt-6 border-t border-gray-200">
                        <Button
                          variant="outline"
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-red-300"
                        >
                          {isFetchingNextPage ? 'Carregando...' : 'Carregar mais publicações'}
                        </Button>
                      </div>
                    )}

                    {!hasNextPage && postagens.length > 0 && (
                      <div className="text-center mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Não há mais publicações para carregar
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <div className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <MessageSquare className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma publicação encontrada</h3>
                        <p className="text-gray-600">Seja o primeiro a criar uma publicação e compartilhar informações importantes!</p>
                      </div>
                      <PermissionGuard permission="criar_post">
                        <Button 
                          onClick={() => setDialogAberto(true)}
                          className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Criar Primeira Publicação
                        </Button>
                      </PermissionGuard>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      <CriarPostDialog
        isOpen={dialogAberto}
        onClose={() => setDialogAberto(false)}
      />

      <AlertDialog open={confirmacaoAberta} onOpenChange={setConfirmacaoAberta}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Marcar todos como lidos</AlertDialogTitle>
            <AlertDialogDescription>
              Após confirmar, todos os posts serão marcados como visualizados. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleVisualizarTodos}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
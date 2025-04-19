import { Button } from "@/components/ui/button"
import { useState } from "react"
import { usePostagens } from "./hooks/use-postagens"
import { useNaoVisualizadas } from "./hooks/use-nao-visualizadas"
import { PostCard } from "./components/post-card"
import { PostSkeleton } from "./components/post-skeleton"
import { CriarPostDialog } from "./components/criar-post-dialog"
import { Bell } from "lucide-react"

export function Feed() {
  const [dialogAberto, setDialogAberto] = useState(false)
  const { postagens, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, marcarPostComoLido } = usePostagens()
  const { quantidadeNaoVisualizadas } = useNaoVisualizadas()

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Feed</h1>
          <p className="text-muted-foreground">
            Acompanhe as últimas atualizações e comunicados
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="relative"
            onClick={() => marcarPostComoLido(postagens[0]?.id)}
            disabled={!quantidadeNaoVisualizadas}
          >
            <Bell className="mr-2 h-4 w-4" />
            Marcar todos como lidos
            {quantidadeNaoVisualizadas > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {quantidadeNaoVisualizadas}
              </span>
            )}
          </Button>

          <Button onClick={() => setDialogAberto(true)}>
            Nova Publicação
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : (
          <>
            {postagens.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onMarcarComoLido={marcarPostComoLido}
              />
            ))}

            {hasNextPage && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
                </Button>
              </div>
            )}

            {!hasNextPage && postagens.length > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Não há mais publicações para carregar
              </p>
            )}

            {postagens.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h2 className="text-lg font-medium">Nenhuma publicação encontrada</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Seja o primeiro a criar uma publicação!
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <CriarPostDialog
        isOpen={dialogAberto}
        onClose={() => setDialogAberto(false)}
      />
    </div>
  )
}
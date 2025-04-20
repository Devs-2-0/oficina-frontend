import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MoreVertical, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Postagem } from "@/types/postagem"
import { useState } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDeletePost } from "../hooks/use-delete-post"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useNaoVisualizadas } from "../hooks/use-nao-visualizadas"

interface PostCardProps {
  post: Postagem
  onMarcarComoLido: (id: number) => void
}

export function PostCard({ post, onMarcarComoLido }: PostCardProps) {
  const [imagemExpandida, setImagemExpandida] = useState<string | null>(null)
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false)
  const { mutateAsync: excluirPost } = useDeletePost()
  const { toast } = useToast()
  const { naoVizualizadasIds } = useNaoVisualizadas()

  const naoVisualizado = naoVizualizadasIds.includes(post.id)

  const handleExcluir = async () => {
    await excluirPost(post.id)
    setConfirmacaoAberta(false)
    toast({
      title: "Publicação excluída",
      description: "A publicação foi excluída com sucesso!"
    })
  }

  return (
    <>
      <Card className={cn(
        "relative overflow-hidden",
        naoVisualizado && "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-red-900"
      )}>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>{post.titulo}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Publicado em {format(new Date(post.criado_em), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setConfirmacaoAberta(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{post.mensagem}</p>

          {post.imagens?.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {post.imagens.map((imagem) => (
                <AspectRatio key={imagem.id} ratio={16 / 9}>
                  <button
                    className={cn(
                      "h-full w-full overflow-hidden rounded-md",
                      post.imagens?.length === 1 && "col-span-2"
                    )}
                    onClick={() => setImagemExpandida(imagem.url)}
                  >
                    <img
                      src={imagem.url}
                      alt=""
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </button>
                </AspectRatio>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <div className="flex items-center gap-4 text-muted-foreground">


          </div>
          <Button variant="ghost" size="sm" onClick={() => onMarcarComoLido(post.id)}>
            Marcar como lido
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={!!imagemExpandida} onOpenChange={() => setImagemExpandida(null)}>
        <DialogContent className="max-w-4xl">
          <img
            src={imagemExpandida!}
            alt=""
            className="h-full w-full rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmacaoAberta} onOpenChange={setConfirmacaoAberta}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir post</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleExcluir}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 
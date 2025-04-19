import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Eye, Heart, MoreVertical } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Postagem } from "@/types/postagem"
import { useState } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: Postagem
  onMarcarComoLido: (id: number) => void
}

export function PostCard({ post, onMarcarComoLido }: PostCardProps) {
  const [imagemExpandida, setImagemExpandida] = useState<string | null>(null)

  return (
    <>
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>{post.titulo}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Publicado em {format(new Date(post.criado_em), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{post.mensagem}</p>

          {post.imagens?.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {post.imagens.map((imagem, index) => (
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
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{post.visualizacoes ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span className="text-sm">{post.curtidas ?? 0}</span>
            </div>
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
    </>
  )
} 
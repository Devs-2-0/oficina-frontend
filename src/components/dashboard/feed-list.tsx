import { useState } from "react"
import { Eye, Heart, MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { CreatePostModal } from "@/components/dashboard/create-post-modal"
import { cn } from "@/lib/utils"

const initialPosts = [
  {
    id: 1,
    title: "Atualização de Procedimentos",
    subtitle: "Novos procedimentos para prestadores",
    description:
      "Informamos que a partir do próximo mês, todos os prestadores deverão seguir os novos procedimentos de registro de atividades conforme detalhado no manual atualizado.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    views: 45,
    likes: 12,
    read: false,
    date: "2023-04-10T10:30:00Z",
  },
  {
    id: 2,
    title: "Treinamento Obrigatório",
    subtitle: "Segurança no trabalho",
    description:
      "Todos os prestadores devem completar o treinamento de segurança no trabalho até o final do mês. O treinamento está disponível na plataforma de aprendizado e leva aproximadamente 2 horas para ser concluído.",
    images: ["/placeholder.svg"],
    views: 78,
    likes: 23,
    read: false,
    date: "2023-04-08T14:15:00Z",
  },
  {
    id: 3,
    title: "Calendário de Pagamentos",
    subtitle: "Datas para o próximo trimestre",
    description:
      "Confira o calendário de pagamentos para o próximo trimestre. Todas as faturas devem ser enviadas com pelo menos 5 dias úteis de antecedência para garantir o pagamento na data correta.",
    images: [],
    views: 120,
    likes: 34,
    read: false,
    date: "2023-04-05T09:45:00Z",
  },
]

interface NewPost {
  title: string
  subtitle: string
  description: string
  images: string[]
}

export function FeedList() {
  const [posts, setPosts] = useState(initialPosts)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { toast } = useToast()

  const handleLike = (id: number) => {
    setPosts(posts.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post)))
    toast({ title: "Post curtido", description: "Você curtiu esta publicação." })
  }

  const handleMarkAsRead = (id: number) => {
    setPosts(posts.map((post) => (post.id === id ? { ...post, read: true, views: post.views + 1 } : post)))
    toast({ title: "Post marcado como lido", description: "Esta publicação foi marcada como lida." })
  }

  const handleMarkAllAsRead = () => {
    setPosts(posts.map((post) => (!post.read ? { ...post, read: true, views: post.views + 1 } : post)))
    toast({ title: "Todos os posts marcados como lidos" })
  }

  const handleCreatePost = (newPost: NewPost) => {
    const post = {
      ...newPost,
      id: posts.length + 1,
      views: 0,
      likes: 0,
      read: false,
      date: new Date().toISOString(),
    }
    setPosts([post, ...posts])
    setIsCreateModalOpen(false)
    toast({ title: "Post criado", description: "Sua publicação foi criada com sucesso." })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6 bg-background text-foreground">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Publicações recentes</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={posts.every((p) => p.read)}
          >
            Marcar todos como lidos
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Publicação
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card
            key={post.id}
            className={cn(
              "transition-all bg-background text-foreground border",
              !post.read && "border-l-4 border-l-primary"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{post.subtitle}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleMarkAsRead(post.id)}>
                      Marcar como {post.read ? "não lido" : "lido"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Publicado em {formatDate(post.date)}
              </p>
            </CardHeader>

            <CardContent className="pb-3">
              <p className="text-sm">{post.description}</p>

              {post.images.length > 0 && (
                <div className="mt-4">
                  {post.images.length === 1 ? (
                    <div className="relative h-[200px] w-full overflow-hidden rounded-md">
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="object-cover h-full w-full rounded-md"
                      />
                    </div>
                  ) : (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {post.images.map((img, index) => (
                          <CarouselItem key={index}>
                            <div className="relative h-[200px] w-full overflow-hidden rounded-md">
                              <img
                                src={img}
                                alt={`${post.title} - imagem ${index + 1}`}
                                className="object-cover h-full w-full rounded-md"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </Carousel>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{post.views} visualizações</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 px-2 text-xs"
                  onClick={() => handleLike(post.id)}
                >
                  <Heart className="h-3.5 w-3.5" />
                  <span>{post.likes} curtidas</span>
                </Button>
              </div>
              {!post.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleMarkAsRead(post.id)}
                >
                  Marcar como lido
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  )
}

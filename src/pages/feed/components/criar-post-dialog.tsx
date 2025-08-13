import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Loader2, X } from "lucide-react"
import { useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { criarPostagem } from "@/http/services/postagem/criar-postagem"
import { toast } from "sonner"

interface CriarPostDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function CriarPostDialog({ isOpen, onClose }: CriarPostDialogProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [titulo, setTitulo] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [imagens, setImagens] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const { mutate: enviarPost, isPending } = useMutation({
    mutationFn: criarPostagem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postagens'] })
      toast.success('Post criado com sucesso!')
      handleClose()
    },
    onError: () => {
      toast.error('Erro ao criar post')
    }
  })

  const handleClose = () => {
    setTitulo("")
    setMensagem("")
    setImagens([])
    setPreviews([])
    onClose()
  }

  const handleImagemSelecionada = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length + imagens.length > 10) {
      toast.error('Máximo de 10 imagens permitido')
      return
    }

    setImagens(prev => [...prev, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removerImagem = (index: number) => {
    setImagens(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo.trim() || !mensagem.trim()) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    enviarPost({
      titulo,
      mensagem,
      imagens: imagens.length > 0 ? imagens : undefined
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Nova Publicação</DialogTitle>
          <DialogDescription>
            Crie uma nova publicação para o feed. Preencha os campos abaixo e clique em publicar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}>
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Título da publicação"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                placeholder="Descrição detalhada da publicação"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Imagens</Label>
                <span className="text-sm text-muted-foreground">
                  {imagens.length}/10 imagens
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={imagens.length >= 10}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Adicionar imagem
              </Button>
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 min-h-[120px] w-full">
                  {previews.map((preview, index) => (
                    <div key={index} className="group relative w-full">
                      <img
                        src={preview}
                        alt=""
                        className="aspect-video w-full h-full rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removerImagem(index)}
                        className="absolute right-2 top-2 rounded-full bg-foreground/10 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleImagemSelecionada}
              />

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={imagens.length >= 10}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Adicionar imagem
              </Button>
            </div>

            {/* Add bottom padding to ensure content doesn't get cut off */}
            <div className="h-6"></div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t bg-white shadow-sm">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
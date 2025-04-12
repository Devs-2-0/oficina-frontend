"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (post: {
    title: string
    subtitle: string
    description: string
    images: string[]
  }) => void
}

export function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    images: ["/placeholder.svg?height=300&width=500"],
  })

  const [imageUrls, setImageUrls] = useState<string[]>(["/placeholder.svg?height=300&width=500"])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddImage = () => {
    setImageUrls([...imageUrls, "/placeholder.svg?height=300&width=500"])
  }

  const handleRemoveImage = (index: number) => {
    const newImageUrls = [...imageUrls]
    newImageUrls.splice(index, 1)
    setImageUrls(newImageUrls)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      images: imageUrls,
    })
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      images: ["/placeholder.svg?height=300&width=500"],
    })
    setImageUrls(["/placeholder.svg?height=300&width=500"])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Publicação</DialogTitle>
          <DialogDescription>
            Crie uma nova publicação para o feed. Preencha os campos abaixo e clique em publicar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título da publicação"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Subtítulo da publicação"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrição detalhada da publicação"
                rows={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Imagens</Label>
              <div className="space-y-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...imageUrls]
                        newUrls[index] = e.target.value
                        setImageUrls(newUrls)
                      }}
                      placeholder="URL da imagem"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveImage(index)}
                      disabled={imageUrls.length === 1}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remover imagem</span>
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddImage} className="w-full">
                  Adicionar imagem
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Publicar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

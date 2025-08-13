import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from "@/lib/utils"
import { useGetImagem } from "../hooks/use-get-imagem"
import { ImagemPostagem } from "@/types/postagem"
import { useState, useEffect } from "react"
import { ImageOff, Loader2 } from "lucide-react"

interface PostImageProps {
  imagem: ImagemPostagem
  onClick?: () => void
  className?: string
  showSingleImageFullWidth?: boolean
  isModal?: boolean
}

export function PostImage({ 
  imagem, 
  onClick, 
  className,
  showSingleImageFullWidth = false,
  isModal = false
}: PostImageProps) {
  const { data: imageBlob, isLoading, error, refetch, isRefetching } = useGetImagem(imagem.url)
  const [imageError, setImageError] = useState(false)

  // Create and cleanup blob URL when image changes
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  
  useEffect(() => {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob)
      setImageUrl(url)
      
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [imageBlob])

  if (isLoading) {
    return (
      <AspectRatio ratio={16 / 9} className={cn("overflow-hidden rounded-md", className)}>
        <div className="flex items-center justify-center h-full w-full bg-gray-100">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </AspectRatio>
    )
  }

  if (error || imageError) {
    return (
      <AspectRatio ratio={16 / 9} className={cn("overflow-hidden rounded-md", className)}>
        <div className="flex items-center justify-center h-full w-full bg-gray-100">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImageOff className="h-6 w-6" />
            <span className="text-xs text-center">Erro ao carregar imagem</span>
            {error && (
              <button
                onClick={() => refetch()}
                disabled={isRefetching}
                className="text-xs text-blue-500 hover:text-blue-700 underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRefetching ? 'Carregando...' : 'Tentar novamente'}
              </button>
            )}
          </div>
        </div>
      </AspectRatio>
    )
  }

  if (!imageBlob || !imageUrl) {
    return (
      <AspectRatio ratio={16 / 9} className={cn("overflow-hidden rounded-md", className)}>
        <div className="flex items-center justify-center h-full w-full bg-gray-100">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </AspectRatio>
    )
  }

  if (isModal) {
    return (
      <img
        src={imageUrl}
        alt=""
        className="w-full h-full max-h-[80vh] object-contain rounded-lg"
        onError={() => setImageError(true)}
        onLoad={() => setImageError(false)}
      />
    )
  }

  return (
    <AspectRatio 
      ratio={16 / 9} 
      className={cn(
        "overflow-hidden rounded-md",
        showSingleImageFullWidth && "col-span-2",
        className
      )}
    >
      <button
        className="h-full w-full overflow-hidden rounded-md"
        onClick={onClick}
        type="button"
      >
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover transition-transform hover:scale-105"
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      </button>
    </AspectRatio>
  )
}

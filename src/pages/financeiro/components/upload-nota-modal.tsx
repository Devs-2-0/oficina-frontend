import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, Upload } from "lucide-react"
import { useUploadNotaFiscal } from "../hooks/use-upload-nota-fiscal"
import { toast } from "sonner"

interface UploadNotaModalProps {
  isOpen: boolean
  onClose: () => void
  idPrestador: number
  periodo: string
  prestadorNome?: string
}

export function UploadNotaModal({ isOpen, onClose, idPrestador, periodo, prestadorNome }: UploadNotaModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const uploadMutation = useUploadNotaFiscal()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo", {
        description: "É necessário selecionar um arquivo para fazer o upload."
      })
      return
    }

    try {
      await uploadMutation.mutateAsync({
        idPrestador,
        periodo,
        arquivo: selectedFile
      })
      onClose()
      setSelectedFile(null)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
                 <DialogHeader>
           <DialogTitle>Upload de Nota Fiscal</DialogTitle>
           <DialogDescription>
             Faça o upload da nota fiscal para o prestador {prestadorNome} no período {periodo}.
             <br />
             <span className="text-sm text-amber-600 font-medium">
               ⚠️ Esta funcionalidade só está disponível quando não há nota fiscal já cadastrada.
             </span>
           </DialogDescription>
         </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="arquivo">Arquivo da Nota Fiscal</Label>
            <Input
              id="arquivo"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600">
                Arquivo selecionado: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploadMutation.isPending || !selectedFile}
          >
            {uploadMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {uploadMutation.isPending ? "Enviando..." : "Enviar Nota"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { PrestadorSelect } from "@/pages/contracts/components/prestador-select"
import { useImportarFinanceiros } from "../hooks/use-importar-financeiros"
import { toast } from "sonner"

interface ImportarFinanceiroModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ImportarFinanceiroModal({ isOpen, onClose }: ImportarFinanceiroModalProps) {
  const [selectedPrestadorId, setSelectedPrestadorId] = useState<string>("")
  const importarMutation = useImportarFinanceiros()

  const handleImportar = async () => {
    if (!selectedPrestadorId) {
      toast.error("Selecione um prestador", {
        description: "É necessário selecionar um prestador para importar os registros."
      })
      return
    }

    try {
      await importarMutation.mutateAsync(parseInt(selectedPrestadorId))
      onClose()
      setSelectedPrestadorId("")
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleClose = () => {
    setSelectedPrestadorId("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importar Registros Financeiros</DialogTitle>
          <DialogDescription>
            Selecione o prestador para importar os registros financeiros do Protheus.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="prestador">Prestador</Label>
            <PrestadorSelect
              value={selectedPrestadorId}
              onValueChange={setSelectedPrestadorId}
              placeholder="Selecione um prestador"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleImportar} 
            disabled={importarMutation.isPending || !selectedPrestadorId}
          >
            {importarMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {importarMutation.isPending ? "Importando..." : "Importar Registros"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

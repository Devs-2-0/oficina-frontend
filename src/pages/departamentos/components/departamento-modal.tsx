import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useCreateDepartamento } from '../hooks/use-create-departamento'

interface DepartamentoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DepartamentoModal({ isOpen, onClose }: DepartamentoModalProps) {
  const [codigo, setCodigo] = useState('')
  const [descricao, setDescricao] = useState('')

  const { mutate: criarDepartamento, isPending } = useCreateDepartamento()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!codigo.trim() || !descricao.trim()) {
      return
    }

    criarDepartamento(
      { codigo: codigo.trim(), descricao: descricao.trim() },
      {
        onSuccess: () => {
          setCodigo('')
          setDescricao('')
          onClose()
        }
      }
    )
  }

  const handleClose = () => {
    setCodigo('')
    setDescricao('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Departamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: TI, RH, FIN"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Tecnologia da Informação"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Criando...' : 'Criar Departamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

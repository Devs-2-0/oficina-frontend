import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import { Prestador } from '@/types/prestador'
import { usePatchPrestador } from '../hooks/use-patch-prestador'

interface ProviderModalProps {
  isOpen: boolean
  onClose: () => void
  prestador?: Prestador
}

export function ProviderModal({ isOpen, onClose, prestador }: ProviderModalProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [especialidade, setEspecialidade] = useState('')
  const [status, setStatus] = useState<'Ativo' | 'Inativo'>('Ativo')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')

  const { mutate: atualizarPrestador } = usePatchPrestador()

  useEffect(() => {
    if (prestador) {
      setNome(prestador.nome)
      setEmail(prestador.email)
      setEspecialidade(prestador.especialidade)
      setStatus(prestador.status)
      setTelefone(prestador.telefone)
      setEndereco(prestador.endereco || '')
    }
  }, [prestador])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!prestador) return

    atualizarPrestador({
      id: prestador.id,
      prestador: {
        nome,
        email,
        especialidade,
        status,
        telefone,
        endereco: endereco || undefined
      }
    }, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Prestador</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF/CNPJ</Label>
              <Input
                id="cpf"
                value={prestador?.cpf_cnpj}
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="especialidade">Especialidade</Label>
              <Select value={especialidade} onValueChange={setEspecialidade} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Design Gráfico">Design Gráfico</SelectItem>
                  <SelectItem value="Desenvolvimento Web">Desenvolvimento Web</SelectItem>
                  <SelectItem value="Desenvolvimento Mobile">Desenvolvimento Mobile</SelectItem>
                  <SelectItem value="UX/UI Design">UX/UI Design</SelectItem>
                  <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                  <SelectItem value="Contabilidade">Contabilidade</SelectItem>
                  <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                  <SelectItem value="Suporte Técnico">Suporte Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: 'Ativo' | 'Inativo') => setStatus(value)} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Endereço completo"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Atualizar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
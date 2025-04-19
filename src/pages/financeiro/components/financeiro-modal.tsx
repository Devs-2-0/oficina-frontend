import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetUsers } from "@/pages/users/hooks/use-get-users"

interface FinanceiroModalProps {
  isOpen: boolean
  onClose: () => void
  financeiroId?: number
}

export const FinanceiroModal = ({ isOpen, onClose, financeiroId }: FinanceiroModalProps) => {
  const { data: users = [] } = useGetUsers()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{financeiroId ? 'Editar Registro Financeiro' : 'Novo Registro Financeiro'}</DialogTitle>
          <DialogDescription>
            Preencha as informações para {financeiroId ? 'editar' : 'cadastrar'} um novo registro financeiro.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="processo">Processo *</Label>
              <Input id="processo" placeholder="PROC-YYYY-XXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="competencia">Competência *</Label>
              <Input id="competencia" placeholder="Mês/Ano" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nro_pagamento">Nº Pagamento *</Label>
              <Input id="nro_pagamento" placeholder="PAY-XXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pagamento">Pagamento</SelectItem>
                  <SelectItem value="Adiantamento">Adiantamento</SelectItem>
                  <SelectItem value="Reembolso">Reembolso</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prestador">Prestador *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o prestador" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_baixa">Data de Pagamento *</Label>
              <Input type="date" id="data_baixa" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proventos">Proventos (R$)</Label>
              <Input type="number" id="proventos" placeholder="0,00" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descontos">Descontos (R$)</Label>
              <Input type="number" id="descontos" placeholder="0,00" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Líquido (R$)</Label>
              <Input type="number" id="valor" placeholder="0,00" readOnly />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button>
            {financeiroId ? 'Salvar alterações' : 'Criar registro'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
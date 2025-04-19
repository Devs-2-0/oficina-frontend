import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetPermissoes } from '@/pages/groups/hooks/use-get-permissoes'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface SelecaoPermissoesProps {
  permissoesSelecionadas: string[]
  onPermissoesChange: (permissoes: string[]) => void
}

export function SelecaoPermissoes({
  permissoesSelecionadas,
  onPermissoesChange,
}: SelecaoPermissoesProps) {
  const { data: permissoes = [] } = useGetPermissoes()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPermissoes = permissoes.filter(permissao =>
    permissao.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCheckboxChange = (permissaoCodigo: string, checked: boolean) => {
    if (checked) {
      onPermissoesChange([...permissoesSelecionadas, permissaoCodigo])
    } else {
      onPermissoesChange(permissoesSelecionadas.filter(codigo => codigo !== permissaoCodigo))
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Buscar permissões</Label>
        <input
          type="text"
          placeholder="Digite para buscar..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="space-y-2">
          {filteredPermissoes.map(permissao => (
            <div key={permissao.codigo} className="flex items-center space-x-2">
              <Checkbox
                id={permissao.codigo}
                checked={permissoesSelecionadas.includes(permissao.codigo)}
                onCheckedChange={(checked) => handleCheckboxChange(permissao.codigo, checked as boolean)}
              />
              <Label htmlFor={permissao.codigo} className="text-sm">
                {permissao.nome}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 
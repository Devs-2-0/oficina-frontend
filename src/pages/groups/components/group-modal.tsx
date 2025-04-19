import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { usePostGrupo } from '../hooks/use-post-grupo'
import { usePatchGrupo } from '../hooks/use-patch-grupo'
import { SelecaoPermissoes } from '@/components/grupo/SelecaoPermissoes'
import { useGetGrupo } from '../hooks/use-get-grupo'
import type { PermissaoGrupo } from '@/http/services/grupo/listar-grupos'

interface GroupModalProps {
  isOpen: boolean
  onClose: () => void
  groupId?: string
}

interface DadosGrupo {
  nome: string
  permissoes: string[]
}

export function GroupModal({ isOpen, onClose, groupId }: GroupModalProps) {
  const { toast } = useToast()
  const [nome, setNome] = useState('')
  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState<string[]>([])

  const { data: grupo } = useGetGrupo(groupId)
  const { mutate: criarGrupo } = usePostGrupo()
  const { mutate: atualizarGrupo } = usePatchGrupo()

  useEffect(() => {
    if (grupo) {
      setNome(grupo.nome)
      setPermissoesSelecionadas(grupo.permissoes.map((p: PermissaoGrupo) => p.codigo))
    } else {
      setNome('')
      setPermissoesSelecionadas([])
    }
  }, [grupo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (permissoesSelecionadas.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos uma permissão',
        variant: 'destructive',
      })
      return
    }

    const dadosGrupo: DadosGrupo = {
      nome,
      permissoes: permissoesSelecionadas
    }

    if (grupo) {
      atualizarGrupo(
        { id: grupo.id.toString(), grupo: dadosGrupo },
        {
          onSuccess: () => {
            onClose()
          }
        }
      )
    } else {
      criarGrupo({
        ...dadosGrupo,
        permissoes: permissoesSelecionadas.map((permission: string) => ({
          codigo: permission
        }))
      }, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{grupo ? 'Editar' : 'Novo'} Grupo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Permissões</Label>
            <SelecaoPermissoes
              permissoesSelecionadas={permissoesSelecionadas}
              onPermissoesChange={setPermissoesSelecionadas}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {grupo ? 'Atualizar' : 'Criar'} Grupo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
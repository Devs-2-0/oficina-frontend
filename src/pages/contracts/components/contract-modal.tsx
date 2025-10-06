import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Upload, X } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"
import { useGetContrato } from "../hooks/use-get-contrato"
import { usePostContrato } from "../hooks/use-post-contrato"
import { usePatchContrato } from "../hooks/use-patch-contrato"
import { useAtualizarArquivoContrato } from "../hooks/use-atualizar-arquivo-contrato"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/hooks/use-permissions"
import { toast } from "sonner"
import { PrestadorSelect } from "./prestador-select"

// Funções para conversão de formato de data
const formatToDisplay = (backendFormat: string): string => {
  if (!backendFormat) return ""
  // Converte YYYY-MM para MM-YYYY
  const [year, month] = backendFormat.split('-')
  return `${month}-${year}`
}

const formatToBackend = (displayFormat: string): string => {
  if (!displayFormat) return ""
  // Converte MM-YYYY para YYYY-MM
  const [month, year] = displayFormat.split('-')
  return `${year}-${month}`
}

// Função para aplicar máscara MM-YYYY
const applyMask = (value: string): string => {
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '')
  
  // Aplica máscara MM-YYYY
  if (numbers.length === 0) {
    return ''
  } else if (numbers.length <= 2) {
    return numbers
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
  } else {
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}`
  }
}

const contratoSchema = z.object({
  competencia: z.string()
    .nonempty("Início da vigência é obrigatória")
    .regex(/^(0[1-9]|1[0-2])-\d{4}$/, "Formato inválido. Use MM-YYYY (ex: 03-2024)"),
  prestadorId: z.string().nonempty("Prestador é obrigatório"),
  arquivo: z.any().optional(),
  valor: z.string().optional(),
  descricao: z.string().optional(),
  ativo: z.boolean().optional(),
})

type ContratoFormData = z.infer<typeof contratoSchema>

interface ContractModalProps {
  isOpen: boolean
  onClose: () => void
  contratoId?: string
}

export function ContractModal({ isOpen, onClose, contratoId }: ContractModalProps) {
  const { usuario } = useAuth()
  const { hasPermission } = usePermissions()
  const isEditMode = !!contratoId
  const { data: contrato, isLoading: isLoadingContrato } = useGetContrato(contratoId)
  const postContrato = usePostContrato()
  const patchContrato = usePatchContrato()
  const atualizarArquivo = useAtualizarArquivoContrato()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContratoFormData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      competencia: "",
      prestadorId: "",
      arquivo: undefined,
      valor: "",
      descricao: "",
    },
  })

  const arquivo = watch("arquivo")

  useEffect(() => {
    if (contrato && isEditMode) {
      reset({
        competencia: contrato.competencia ? formatToDisplay(contrato.competencia) : "",
        prestadorId: contrato.prestador?.id ? String(contrato.prestador.id) : "",
        arquivo: undefined,
        valor: contrato.valor ? String(contrato.valor) : "",
        descricao: contrato.descricao || "",
        ativo: contrato.ativo,
      })
    } else if (!isEditMode) {
      reset({
        competencia: "",
        prestadorId: "",
        arquivo: undefined,
        valor: "",
        descricao: "",
      })
      setSelectedFile(null)
    }
  }, [contrato, reset, isEditMode])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue("arquivo", file)
      setSelectedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setValue("arquivo", undefined)
    setSelectedFile(null)
  }

  const handleSaveContrato = async (data: ContratoFormData) => {
    if (!usuario) {
      toast.error("Erro", {
        description: "Usuário não autenticado."
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append("competencia", formatToBackend(data.competencia))
      formData.append("prestadorId", data.prestadorId)
      // formData.append("criadorId", String(usuario.id))

      if (data.valor) {
        formData.append("valor", data.valor)
      }

      if (data.descricao) {
        formData.append("descricao", data.descricao)
      }

      // Só incluir campo ativo na edição
      if (isEditMode && data.ativo !== undefined) {
        formData.append("ativo", String(data.ativo))
      }

      if (isEditMode && contratoId) {
        // Se há um arquivo selecionado e o usuário tem permissão, atualizar o arquivo separadamente
        if (data.arquivo instanceof File && hasPermission("atualizar_arquivo_contrato")) {
          await atualizarArquivo.mutateAsync({
            contratoId,
            arquivo: data.arquivo
          })
        }
        
        await patchContrato.mutateAsync({
          id: contratoId,
          contrato: formData,
        })
      } else {
        // Para criação, incluir o arquivo no formData se existir
        if (data.arquivo instanceof File) {
          formData.append("arquivo", data.arquivo)
        }
        
        await postContrato.mutateAsync(formData)
      }

      onClose()
      toast.success(isEditMode ? "Contrato atualizado" : "Contrato criado", {
        description: isEditMode
          ? "O contrato foi atualizado com sucesso."
          : "O contrato foi criado com sucesso."
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Erro de validação", {
          description: "Por favor, verifique os campos do formulário."
        })
        return
      }

      const apiError = error as { response?: { data?: { message?: string } } }
      toast.error("Erro", {
        description: apiError?.response?.data?.message || "Ocorreu um erro ao salvar o contrato."
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Contrato" : "Novo Contrato"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edite as informações do contrato abaixo."
              : "Preencha as informações para criar um novo contrato."}
          </DialogDescription>
        </DialogHeader>

        {isEditMode && isLoadingContrato ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando dados do contrato...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleSaveContrato)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="competencia">Inicio Vigência</Label>
                  <Controller
                    name="competencia"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        placeholder="Ex: 03-2024"
                        maxLength={7}
                        onChange={(e) => {
                          const maskedValue = applyMask(e.target.value)
                          field.onChange(maskedValue)
                        }}
                      />
                    )}
                  />
                  {errors.competencia && (
                    <p className="text-sm text-red-500">{errors.competencia.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prestadorId">Prestador</Label>
                  <Controller
                    name="prestadorId"
                    control={control}
                    render={({ field }) => (
                      <PrestadorSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Selecione um prestador"
                      />
                    )}
                  />
                  {errors.prestadorId && (
                    <p className="text-sm text-red-500">{errors.prestadorId.message}</p>
                  )}
                </div>
              </div>



              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor do Contrato (R$)</Label>
                  <Controller
                    name="valor"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="number" step="0.01" placeholder="0,00" />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Arquivo do Contrato</Label>
                  {isEditMode && !hasPermission("atualizar_arquivo_contrato") ? (
                    <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                      Você não tem permissão para alterar o arquivo deste contrato.
                    </div>
                  ) : (
                    <>
                      {arquivo ? (
                        <div className="flex items-center gap-2">
                          <span title={selectedFile?.name} className="text-sm text-muted-foreground truncate">
                            {selectedFile?.name || "Arquivo anexado"}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleRemoveFile}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="arquivo"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("arquivo")?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {isEditMode ? "Alterar arquivo" : "Selecionar arquivo"}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Controller
                  name="descricao"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Descreva os detalhes do contrato..." />
                  )}
                />
              </div>

              {isEditMode && (
                <div className="space-y-2">
                  <Label htmlFor="ativo">Status do Contrato</Label>
                  <Controller
                    name="ativo"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="ativo"
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="ativo" className="text-sm font-normal">
                          {field.value ? "Ativo" : "Inativo"}
                        </Label>
                      </div>
                    )}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Salvar alterações" : "Criar contrato"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 
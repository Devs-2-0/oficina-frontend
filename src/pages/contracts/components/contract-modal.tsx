import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useGetContrato } from "../hooks/use-get-contrato"
import { usePostContrato } from "../hooks/use-post-contrato"
import { usePatchContrato } from "../hooks/use-patch-contrato"
import { useGetUsers } from "@/pages/users/hooks/use-get-users"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

const contratoSchema = z.object({
  competencia: z.string()
    .nonempty("Competência é obrigatória")
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Formato inválido. Use AAAA-MM (ex: 2024-03)"),
  prestadorId: z.string().nonempty("Prestador é obrigatório"),
  arquivo: z.any().optional(),
  valor: z.string().optional(),
  dataInicio: z.string().optional(),
  dataTermino: z.string().optional(),
  descricao: z.string().optional(),
})

type ContratoFormData = z.infer<typeof contratoSchema>

interface ContractModalProps {
  isOpen: boolean
  onClose: () => void
  contratoId?: string
}

export function ContractModal({ isOpen, onClose, contratoId }: ContractModalProps) {
  const { toast } = useToast()
  const { usuario } = useAuth()
  const isEditMode = !!contratoId
  const { data: contrato, isLoading: isLoadingContrato } = useGetContrato(contratoId)
  const { data: usuarios = [] } = useGetUsers()
  const postContrato = usePostContrato()
  const patchContrato = usePatchContrato()
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
      dataInicio: "",
      dataTermino: "",
      descricao: "",
    },
  })

  const arquivo = watch("arquivo")
  const prestadorId = watch("prestadorId")
  const selectedPrestador = usuarios.find(u => String(u.id) === prestadorId)

  useEffect(() => {
    if (contrato && isEditMode) {
      reset({
        competencia: contrato.competencia,
        prestadorId: contrato.prestador?.id || "",
        arquivo: undefined,
        valor: "",
        dataInicio: "",
        dataTermino: "",
        descricao: "",
      })
    } else if (!isEditMode) {
      reset({
        competencia: "",
        prestadorId: "",
        arquivo: undefined,
        valor: "",
        dataInicio: "",
        dataTermino: "",
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
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append("competencia", data.competencia)
      formData.append("prestadorId", data.prestadorId)
      formData.append("criadorId", String(usuario.id))

      if (data.arquivo instanceof File) {
        formData.append("arquivo", data.arquivo)
      }

      // if (data.valor) {
      //   formData.append("valor", data.valor)
      // }

      // if (data.dataInicio) {
      //   formData.append("dataInicio", data.dataInicio)
      // }

      // if (data.dataTermino) {
      //   formData.append("dataTermino", data.dataTermino)
      // }

      // if (data.descricao) {
      //   formData.append("descricao", data.descricao)
      // }

      if (isEditMode && contratoId) {
        await patchContrato.mutateAsync({
          id: contratoId,
          contrato: formData,
        })
      } else {
        await postContrato.mutateAsync(formData)
      }

      onClose()
      toast({
        title: isEditMode ? "Contrato atualizado" : "Contrato criado",
        description: isEditMode
          ? "O contrato foi atualizado com sucesso."
          : "O contrato foi criado com sucesso.",
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: "Por favor, verifique os campos do formulário.",
          variant: "destructive",
        })
        return
      }

      const apiError = error as { response?: { data?: { message?: string } } }
      toast({
        title: "Erro",
        description: apiError?.response?.data?.message || "Ocorreu um erro ao salvar o contrato.",
        variant: "destructive",
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
                  <Label htmlFor="competencia">Competência</Label>
                  <Controller
                    name="competencia"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Ex: 2024-03" />
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um prestador">
                            {selectedPrestador?.nome || "Selecione um prestador"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {usuarios.map((usuario) => (
                            <SelectItem key={usuario.id} value={String(usuario.id)}>
                              {usuario.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.prestadorId && (
                    <p className="text-sm text-red-500">{errors.prestadorId.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Controller
                    name="dataInicio"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="date" />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataTermino">Data de Término</Label>
                  <Controller
                    name="dataTermino"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="date" />
                    )}
                  />
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
                  {arquivo ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
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
                        Selecionar arquivo
                      </Button>
                    </div>
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
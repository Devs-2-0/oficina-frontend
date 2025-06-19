import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/http/services/users/get-user-by-id";
import { useGetGrupos } from '../hooks/use-get-grupos';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePostUserMutation } from "../hooks/use-post-user";
import { useUpdateUserMutation } from "../hooks/use-patch-user";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const userSchema = z.object({
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  nome: z.string().min(1, "Nome é obrigatório"),
  identificacao: z.string().min(1, "Identificação é obrigatória"),
  nome_usuario: z.string().min(1, "Nome de usuário é obrigatório"),
  senha: z.string().min(1, "Senha é obrigatória"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  uf: z.string().min(1, "UF é obrigatória"),
  grupo: z.string().min(1, "Grupo é obrigatório"),
  email: z.string().email("Email inválido"),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const UserModal = ({ isOpen, onClose, userId }: UserModalProps) => {
  const { toast } = useToast();
  const isEditMode = !!userId;
  const postUser = usePostUserMutation();
  const updateUser = useUpdateUserMutation();
  const { data: grupos = [] } = useGetGrupos();

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(Number(userId!)),
    enabled: !!userId,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      matricula: "",
      nome: "",
      identificacao: "",
      nome_usuario: "",
      senha: "",
      endereco: "",
      bairro: "",
      cidade: "",
      uf: "",
      grupo: "7",
      email: "",
    },
  });

  console.log(errors)

  useEffect(() => {
    if (userData && isEditMode) {
      reset({
        ...userData,
        senha: "", // Por segurança, não preenchemos o campo de senha
        grupo: '7'
      });
    } else if (!isEditMode) {
      reset({
        matricula: "",
        nome: "",
        identificacao: "",
        nome_usuario: "",
        senha: "",
        endereco: "",
        bairro: "",
        cidade: "",
        uf: "",
        grupo: "7",
        email: "",
      });
    }
  }, [userData, reset, isEditMode]);

  const handleSaveUser = async (data: UserFormData) => {
    console.log(data)
    if (isEditMode && userId) {
      await updateUser.mutateAsync({
        id: userId,
        ...data,
        grupo: Number(data.grupo)
      });
      toast({
        title: "Usuário atualizado",
        description: "Usuário atualizado com sucesso.",
        duration: 3000,
      });
    } else {
      await postUser.mutateAsync({
        ...data,
        grupo: Number(data.grupo)
      });
      toast({
        title: "Usuário criado",
        description: "Novo usuário criado com sucesso.",
        duration: 3000,
      });
    }
    onClose();

  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edite as informações do usuário abaixo."
              : "Preencha as informações para criar um novo usuário."}
          </DialogDescription>
        </DialogHeader>

        {isEditMode && isLoadingUser ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando dados do usuário...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleSaveUser)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Controller
                    name="matricula"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Matrícula" />
                    )}
                  />
                  {errors.matricula && <p className="text-sm text-red-500">{errors.matricula.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Controller
                    name="nome"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Nome completo" />
                    )}
                  />
                  {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identificacao">Identificação</Label>
                  <Controller
                    name="identificacao"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="CPF" />
                    )}
                  />
                  {errors.identificacao && <p className="text-sm text-red-500">{errors.identificacao.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_usuario">Nome de usuário</Label>
                  <Controller
                    name="nome_usuario"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Nome de usuário" />
                    )}
                  />
                  {errors.nome_usuario && <p className="text-sm text-red-500">{errors.nome_usuario.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="email" placeholder="Email" />
                    )}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Controller
                    name="senha"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="password" placeholder={isEditMode ? "Deixe em branco para manter a senha atual" : "Senha"} />
                    )}
                  />
                  {errors.senha && <p className="text-sm text-red-500">{errors.senha.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Controller
                    name="endereco"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Endereço" />
                    )}
                  />
                  {errors.endereco && <p className="text-sm text-red-500">{errors.endereco.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Controller
                    name="bairro"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Bairro" />
                    )}
                  />
                  {errors.bairro && <p className="text-sm text-red-500">{errors.bairro.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Controller
                    name="cidade"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Cidade" />
                    )}
                  />
                  {errors.cidade && <p className="text-sm text-red-500">{errors.cidade.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uf">UF</Label>
                  <Controller
                    name="uf"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="UF" maxLength={2} />
                    )}
                  />
                  {errors.uf && <p className="text-sm text-red-500">{errors.uf.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grupo">Grupo</Label>
                  <Controller
                    name="grupo"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um grupo" />
                        </SelectTrigger>
                        <SelectContent>
                          {grupos.map((grupo) => (
                            <SelectItem key={grupo.id} value={grupo.id.toString()}>
                              {grupo.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.grupo && <p className="text-sm text-red-500">{errors.grupo.message}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Salvando..." : "Criando..."}
                  </>
                ) : (
                  isEditMode ? "Salvar alterações" : "Criar usuário"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
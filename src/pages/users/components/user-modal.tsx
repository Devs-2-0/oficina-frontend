import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
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

const createUserSchema = z.object({
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

const editUserSchema = z.object({
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  nome: z.string().min(1, "Nome é obrigatório"),
  identificacao: z.string().min(1, "Identificação é obrigatória"),
  nome_usuario: z.string().min(1, "Nome de usuário é obrigatório"),
  senha: z.string().optional(),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  uf: z.string().min(1, "UF é obrigatória"),
  grupo: z.string().min(1, "Grupo é obrigatório"),
  email: z.string().email("Email inválido"),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type EditUserFormData = z.infer<typeof editUserSchema>;
type UserFormData = CreateUserFormData | EditUserFormData;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const UserModal = ({ isOpen, onClose, userId }: UserModalProps) => {
  const isEditMode = !!userId;
  const postUser = usePostUserMutation();
  const updateUser = useUpdateUserMutation();
  const { data: grupos = [] } = useGetGrupos();

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(Number(userId!)),
    enabled: !!userId,
  });

  // Check if user is a prestador (provider)
  const isPrestador = userData?.tipo === 'PRESTADOR';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(isEditMode ? editUserSchema : createUserSchema),
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
    if (isEditMode && userId && userData) {
      if (isPrestador) {
        // Para usuários Prestador, enviar todos os dados atuais + novo grupo
        await updateUser.mutateAsync({ 
          id: userId,
          matricula: userData.matricula,
          nome: userData.nome,
          identificacao: userData.identificacao,
          nome_usuario: userData.nome_usuario,
          endereco: userData.endereco,
          bairro: userData.bairro,
          cidade: userData.cidade,
          uf: userData.uf,
          email: userData.email,
          grupo: Number(data.grupo) // Apenas o grupo é atualizado
        });
        // Toast será exibido pelo hook
      } else {
        // Para outros usuários, atualizar todos os campos exceto senha se vazia
        const { senha, ...dataWithoutPassword } = data;
        const payload = senha ? { ...dataWithoutPassword, senha } : dataWithoutPassword;
        
        await updateUser.mutateAsync({ 
          id: userId, 
          ...payload, 
          grupo: Number(data.grupo) 
        });
        // Toast será exibido pelo hook
      }
    } else {
      // Criação de novo usuário
      const { senha, ...dataWithoutPassword } = data;
      const payload = senha ? { ...dataWithoutPassword, senha } : dataWithoutPassword;
      
      await postUser.mutateAsync({
        ...payload,
        grupo: Number(data.grupo)
      });
      // Toast será exibido pelo hook
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
              ? isPrestador 
                ? "Usuário do tipo Prestador - apenas o grupo pode ser alterado."
                : "Edite as informações do usuário abaixo."
              : "Preencha as informações para criar um novo usuário."}
          </DialogDescription>
          {isEditMode && isPrestador && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2">
              <p className="text-sm text-amber-800">
                <strong>Usuário do tipo Prestador:</strong> Por questões de segurança, apenas o campo "Grupo" pode ser alterado. 
                Todos os outros campos estão bloqueados para edição.
              </p>
            </div>
          )}
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
                      <Input {...field} placeholder="Matrícula" disabled={isEditMode && isPrestador} />
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
                      <Input {...field} placeholder="Nome completo" disabled={isEditMode && isPrestador} />
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
                      <Input {...field} placeholder="CPF" disabled={isEditMode && isPrestador} />
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
                      <Input {...field} placeholder="Nome de usuário" disabled={isEditMode && isPrestador} />
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
                      <Input {...field} type="email" placeholder="Email" disabled={isEditMode && isPrestador} />
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
                      <Input 
                        {...field} 
                        type="password" 
                        placeholder={isEditMode ? "Deixe em branco para manter a senha atual" : "Senha"} 
                        disabled={isEditMode && isPrestador}
                        required={!isEditMode}
                      />
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
                      <Input {...field} placeholder="Endereço" disabled={isEditMode && isPrestador} />
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
                      <Input {...field} placeholder="Bairro" disabled={isEditMode && isPrestador} />
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
                      <Input {...field} placeholder="Cidade" disabled={isEditMode && isPrestador} />
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
                      <Input {...field} placeholder="UF" maxLength={2} disabled={isEditMode && isPrestador} />
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
                        disabled={false} // Grupo sempre pode ser editado
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
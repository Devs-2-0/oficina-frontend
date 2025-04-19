import { useToast } from '@/hooks/use-toast';
import { patchUser, UpdateUserRequest } from '@/http/services/users/patch-user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useUpdateUserMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, UpdateUserRequest>(
    {
      mutationFn: (user: UpdateUserRequest) => patchUser(user),
      onSuccess: () => {
        toast({ variant: 'default', title: 'Usuário atualizado com sucesso!', description: 'As alterações foram salvas.' });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user'] });
      },
      onError: (error) => {
        const errorMessage = error.message || 'Erro desconhecido';
        toast({ variant: 'destructive', title: 'Erro ao atualizar usuário', description: errorMessage });
        console.error('Erro ao atualizar usuário:', errorMessage);
      },
    }
  );
};
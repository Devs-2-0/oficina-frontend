import { toast } from 'sonner';
import { patchUser, UpdateUserRequest } from '@/http/services/users/patch-user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, UpdateUserRequest>(
    {
      mutationFn: (user: UpdateUserRequest) => patchUser(user),
      onSuccess: () => {
        toast.success('Usuário atualizado com sucesso!', {
          description: 'As alterações foram salvas.'
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user'] });
      },
      onError: (error) => {
        const errorMessage = error.message || 'Erro desconhecido';
        toast.error('Erro ao atualizar usuário', {
          description: errorMessage
        });
        console.error('Erro ao atualizar usuário:', errorMessage);
      },
    }
  );
};
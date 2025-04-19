import { useToast } from '@/hooks/use-toast';
import { deleteUserById } from '@/http/services/users/delete-user';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export const useDeleteUserMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>(
    {
      mutationFn: (userId: number) => deleteUserById(userId),
      onSuccess: () => {
        toast({ variant: 'default', title: 'Usuário deletado com sucesso!', description: 'O usuário foi removido.' });
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error) => {
        const errorMessage = error.message || 'Erro desconhecido';
        toast({ variant: 'destructive', title: 'Erro ao deletar usuário', description: errorMessage });
        console.error('Erro ao deletar usuário:', errorMessage);
      },
    }
  );
};
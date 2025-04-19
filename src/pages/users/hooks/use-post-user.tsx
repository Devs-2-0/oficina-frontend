import { useToast } from '@/hooks/use-toast';
import { postUser, PostUserRequest } from '@/http/services/users/post-user';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export const usePostUserMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, PostUserRequest>(
    {
      mutationFn: (user: PostUserRequest) => postUser(user),
      onSuccess: (data) => {
        toast({ variant: 'default', title: 'Usuário criado com sucesso!', description: 'Bem-vindo!' });
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error) => {
        const errorMessage = error.message || 'Erro desconhecido';
        toast({ variant: 'destructive', title: 'Erro ao criar usuário', description: errorMessage });
        console.error('Erro ao criar usuário:', errorMessage);
      },
    }
  );
};
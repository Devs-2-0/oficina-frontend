import { toast } from 'sonner';
import { postUser, PostUserRequest } from '@/http/services/users/post-user';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export const usePostUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, PostUserRequest>(
    {
      mutationFn: (user: PostUserRequest) => postUser(user),
      onSuccess: (data) => {
        toast.success('Usuário criado com sucesso!', {
          description: 'Bem-vindo!'
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error) => {
        const errorMessage = error.message || 'Erro desconhecido';
        toast.error('Erro ao criar usuário', {
          description: errorMessage
        });
        console.error('Erro ao criar usuário:', errorMessage);
      },
    }
  );
};
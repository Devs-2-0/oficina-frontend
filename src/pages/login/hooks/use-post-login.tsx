import { useToast } from '@/hooks/use-toast';
import postLogin, { LoginRequest, LoginResponse } from '@/http/services/login/post-login';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';


export const usePostLoginMutation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation<LoginResponse, AxiosError, LoginRequest>(
    {
      mutationFn: (login: LoginRequest) => postLogin(login),
      onSuccess: (data) => {
        toast({ variant: 'default', title: 'Login realizado com sucesso!', description: 'Bem-vindo de volta!' });
        navigate('/feed');
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
        toast({ variant: 'destructive', title: 'Erro ao realizar login', description: errorMessage });
        console.error('Erro ao realizar login:', errorMessage);
      },
    }
  );
};
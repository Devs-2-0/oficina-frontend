import { toast } from 'sonner';
import postLogin, { LoginRequest, LoginResponse } from '@/http/services/login/post-login';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';


export const usePostLoginMutation = () => {
  const navigate = useNavigate();
  const { setUsuarioFromLogin } = useAuth();

  return useMutation<LoginResponse, AxiosError, LoginRequest>(
    {
      mutationFn: (login: LoginRequest) => postLogin(login),
      onSuccess: (data) => {
        toast.success('Login realizado com sucesso!', {
          description: 'Bem-vindo de volta!'
        });
        setUsuarioFromLogin(data.data);
        navigate('/feed');
      },
      onError: (error) => {
        let errorTitle = 'Erro ao realizar login';
        let errorDescription = 'Ocorreu um erro inesperado. Tente novamente.';

        // Verifica se é um erro de rede
        if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
          errorTitle = 'Erro de conexão';
          errorDescription = 'Verifique sua conexão com a internet e tente novamente.';
        }
        // Verifica se é um erro de timeout
        else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          errorTitle = 'Tempo limite excedido';
          errorDescription = 'A requisição demorou muito para responder. Tente novamente.';
        }
        // Verifica erros específicos da API
        else if (error.response) {
          const status = error.response.status;
          const data = error.response.data;

          switch (status) {
            case 400:
              errorTitle = 'Dados inválidos';
              errorDescription = data?.message || 'Verifique os dados informados e tente novamente.';
              break;
            case 401:
              errorTitle = 'Credenciais inválidas';
              errorDescription = 'Usuário ou senha incorretos. Verifique suas credenciais.';
              break;
            case 403:
              errorTitle = 'Acesso negado';
              errorDescription = 'Você não tem permissão para acessar o sistema.';
              break;
            case 404:
              errorTitle = 'Usuário não encontrado';
              errorDescription = 'O usuário informado não foi encontrado em nossa base de dados';
              break;
            case 500:
              errorTitle = 'Erro interno do servidor';
              errorDescription = 'Ocorreu um erro no servidor. Tente novamente mais tarde.';
              break;
            default:
              errorDescription = data?.message || `Erro ${status}: ${error.message}`;
          }
        }
        // Erro genérico
        else if (error.message) {
          errorDescription = error.message;
        }

        toast.error(errorTitle, {
          description: errorDescription
        });
        
        console.error('Erro ao realizar login:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          code: error.code
        });
      },
    }
  );
};
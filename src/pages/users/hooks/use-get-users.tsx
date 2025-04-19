import { getUsers } from '@/http/services/users/get-users';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


export const useGetUsers = () => {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,

  })

  return {
    ...usersQuery, data: usersQuery.data?.data || [],
  }
};
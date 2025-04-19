import { getUsers } from '@/http/services/users/get-users';
import { useQuery } from '@tanstack/react-query';


export const useGetUsers = () => {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,

  })

  console.log(usersQuery.data)
  return {
    ...usersQuery, data: usersQuery.data?.data || [],
  }
};
import api, { baseURL } from "@/http/api";
import { User } from "@/models/user";

export interface UserResponse {
  data: User[];
  count: number;
}

export const getUsers = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>(`${baseURL}/rest/usuario`);
  return response.data;
};

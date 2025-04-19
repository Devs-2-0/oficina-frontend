import api, { baseURL } from "@/http/api";
import { User } from "@/models/user";

export async function getUserById(id: number): Promise<Omit<User, "senha" | "hash">> {
  const response = await api.get<Omit<User, "senha" | "hash">>(`${baseURL}/rest/usuario/${id}`,);
  return response.data;
}
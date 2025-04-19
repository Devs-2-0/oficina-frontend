import { baseURL } from '@/http/api';
import axios from 'axios';

export async function deleteUserById(id: number): Promise<void> {
  await axios.delete(`${baseURL}/rest/usuario/${id}`);
}

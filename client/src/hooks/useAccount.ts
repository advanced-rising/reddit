import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import { User } from '../types/dto';

export default function useAccount() {
  const router = useRouter();
  const fetchAccount = async (): Promise<User> => {
    const { data } = await axios.get('/auth/me', { withCredentials: true });
    return data;
  };

  const { data: account } = useQuery(['user'], fetchAccount, {
    onError: () => {
      router.push(`/login`);
    },
  });

  return { account };
}

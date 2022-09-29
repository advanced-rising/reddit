import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import { User } from '../types/dto';
import { useAppDispatch, useAppSelector } from '../redux/storeHooks';
import { useEffect } from 'react';
import { login } from '../redux/slices/user';

export default function useAccount() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const fetchAccount = async (): Promise<User> => {
    const { data } = await axios.get('/auth/me', { withCredentials: true });
    return data;
  };

  useEffect(() => {
    const _local = localStorage.getItem('superSecret');
    if (!user && _local) {
      dispatch(login());
    }
  }, [user]);

  const { data: account } = useQuery(['user'], fetchAccount, {
    onError: () => {
      router.push(`/login`);
    },
  });

  return { account };
}

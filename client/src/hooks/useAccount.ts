import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import axios from '@utils/axios';
import { User } from '../types/dto';
import { useAppDispatch, useAppSelector } from '../redux/storeHooks';
import { useEffect, useState } from 'react';
import { login } from '../redux/slices/user';

export const ACCOUNT_QUERY_KEY = {
  ACCOUNT: ['account'],
};

export default function useAccount() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isTrue, setIsTrue] = useState(false);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    const _local = localStorage.getItem('superSecret');
    if (!user && _local) {
      dispatch(login());
      setIsTrue(true);
    }
  }, [user]);

  const { data: account } = useQuery(
    ACCOUNT_QUERY_KEY.ACCOUNT,
    async (): Promise<User> => {
      const { data } = await axios.get('/auth/me', { withCredentials: true });
      return data;
    },
    {
      enabled: Boolean(isTrue),
    },
  );

  return { account, setIsTrue };
}

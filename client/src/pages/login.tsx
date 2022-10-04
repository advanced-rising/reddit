import { QueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import InputGroup from '@components/InputGroup';
import useAccount from '@hooks/useAccount';
import { login } from '@redux/slices/user';
import { useAppDispatch } from '@redux/storeHooks';

import axios from '@utils/axios';

interface LoginTypes {
  username: string;
  password: string;
}

const Login = () => {
  const qc = new QueryClient();
  const router = useRouter();
  const { account } = useAccount();
  if (account) router.push('/');

  const dispatch = useAppDispatch();

  const [sign, setSign] = useState<LoginTypes>({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginTypes>({
    username: '',
    password: '',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    return setSign({ ...sign, [name]: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const {
        data: { token },
      } = await axios.post(
        '/auth/login',
        { password: sign.password, username: sign.username },
        { withCredentials: true },
      );

      localStorage.setItem('superSecret', token);
      dispatch(login());

      qc.invalidateQueries(['user']);

      router.push('/');
    } catch (error: any) {
      console.log(error);
      setErrors(error?.response.data || {});
    }
  };

  return (
    <div className='bg-white'>
      <div className='flex h-screen flex-col items-center justify-center p-6'>
        <div className='mx-auto w-10/12 md:w-96'>
          <h1 className='mb-2 text-lg font-medium'>로그인</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              placeholder='Username'
              value={sign.username}
              setValue={handleChange}
              error={errors.username}
              name='username'
              type='text'
            />
            <InputGroup
              placeholder='Password'
              value={sign.password}
              setValue={handleChange}
              error={errors.password}
              name='password'
              type='password'
            />
            <button
              disabled={
                sign.username.length === 0 || sign.password.length === 0
              }
              className='mb-1 w-full rounded border border-red-400 bg-red-400 
            py-4 text-xs font-bold uppercase text-white
            disabled:border-gray-400 disabled:bg-gray-400
            '>
              로그인
            </button>
          </form>
          <small>
            아직 아이디가 없나요?
            <Link href='/register'>
              <a className='ml-1 uppercase text-blue-500'>회원가입</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;

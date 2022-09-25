import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import InputGroup from 'src/components/InputGroup';
import { useAuthDispatch, useAuthState } from '../context/auth';

interface LoginTypes {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();

  const [sign, setSign] = useState<LoginTypes>({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginTypes>({
    username: '',
    password: '',
  });
  const { authenticated } = useAuthState();
  const dispatch = useAuthDispatch();

  if (authenticated) router.push('/');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    return setSign({ ...sign, [name]: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const result = await axios.post('/auth/login', sign, { withCredentials: true });
      dispatch('LOGIN', result.data?.user);

      router.push('/');
    } catch (error: any) {
      console.log('error', error);
      setErrors(error?.response.data || {});
    }
  };

  return (
    <div className='bg-white'>
      <div className='flex flex-col items-center justify-center h-screen p-6'>
        <div className='w-10/12 mx-auto md:w-96'>
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
              disabled={sign.username.length === 0 || sign.password.length === 0}
              className='w-full py-4 mb-1 text-xs font-bold text-white 
            uppercase bg-red-400 border border-red-400 rounded
            disabled:bg-gray-400 disabled:border-gray-400
            '>
              로그인
            </button>
          </form>
          <small>
            아직 아이디가 없나요?
            <Link href='/register'>
              <a className='ml-1 text-blue-500 uppercase'>회원가입</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;

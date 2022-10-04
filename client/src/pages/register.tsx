import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import InputGroup from '@components/InputGroup';
import useAccount from '@hooks/useAccount';
import axios from '@utils/axios';

interface RegisterTypes {
  email: string;
  username: string;
  password: string;
}
const Register = () => {
  const router = useRouter();
  const { account } = useAccount();
  if (account) router.push('/');

  const [sign, setSign] = useState<RegisterTypes>({
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<RegisterTypes>({
    email: '',
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
      const result = await axios.post('/auth/register', sign);

      router.push('/login');
    } catch (error: any) {
      console.log('error', error);
      setErrors(error?.response.data || {});
    }
  };

  return (
    <div className='bg-white'>
      <div className='flex h-screen flex-col items-center justify-center p-6'>
        <div className='mx-auto w-10/12 md:w-96'>
          <h1 className='mb-2 text-lg font-medium'>회원가입</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              placeholder='Email'
              setValue={handleChange}
              value={sign.email}
              error={errors.email}
              name='email'
              type='text'
            />
            <InputGroup
              placeholder='Username'
              setValue={handleChange}
              error={errors.username}
              value={sign.username}
              name='username'
              type='text'
            />
            <InputGroup
              placeholder='Password'
              setValue={handleChange}
              error={errors.password}
              value={sign.password}
              name='password'
              type='password'
            />
            <button
              disabled={
                sign.email.length === 0 ||
                sign.username.length === 0 ||
                sign.password.length === 0
              }
              className='mb-1 w-full rounded border border-red-400 
            bg-red-400 py-4 text-xs font-bold uppercase text-white
            disabled:border-gray-400 disabled:bg-gray-400'>
              회원 가입
            </button>
          </form>
          <small>
            이미 가입하셨나요?
            <Link href='/login'>
              <a className='ml-1 uppercase text-blue-500'>로그인</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;

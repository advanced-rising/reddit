import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import InputGroup from 'src/components/InputGroup';

interface RegisterTypes {
  email: string;
  username: string;
  password: string;
}
const Register = () => {
  const router = useRouter();

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
      const result = await axios.post('/api/auth/register', sign);
      console.log('result', result);
      router.push('/login');
    } catch (error: any) {
      console.log('error', error);
      setErrors(error?.response.data || {});
    }
  };

  return (
    <div className='bg-white'>
      <div className='flex flex-col items-center justify-center h-screen p-6'>
        <div className='w-10/12 mx-auto md:w-96'>
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
                sign.email.length === 0 || sign.username.length === 0 || sign.password.length === 0
              }
              className='w-full py-4 mb-1 text-xs font-bold 
            text-white uppercase bg-red-400 border border-red-400 rounded
            disabled:bg-gray-400 disabled:border-gray-400'>
              회원 가입
            </button>
          </form>
          <small>
            이미 가입하셨나요?
            <Link href='/login'>
              <a className='ml-1 text-blue-500 uppercase'>로그인</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;

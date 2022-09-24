import Link from 'next/link';
import React, { ChangeEvent, useState } from 'react';
import InputGroup from '../compoents/InputGroup';

interface RegisterTypes {
  email: string;
  username: string;
  password: string;
}
const Register = () => {
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

  const signHanlder = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    return setSign({ ...sign, [name]: value });
  };

  return (
    <div className='bg-white'>
      <div className='flex flex-col items-center justify-center h-screen p-6'>
        <div className='w-10/12 mx-auto md:w-96'>
          <h1 className='mb-2 text-lg font-medium'>회원가입</h1>
          <form>
            <InputGroup
              placeholder='Email'
              setValue={signHanlder}
              value={sign.email}
              error={errors.email}
              name='email'
              type='text'
            />
            <InputGroup
              placeholder='Username'
              setValue={signHanlder}
              error={errors.username}
              value={sign.username}
              name='username'
              type='text'
            />
            <InputGroup
              placeholder='Password'
              setValue={signHanlder}
              error={errors.password}
              value={sign.password}
              name='password'
              type='password'
            />
            <button
              disabled={
                sign.email.length === 0 || sign.username.length === 0 || sign.password.length === 0
              }
              className='w-full py-2 mb-1 text-xs font-bold 
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

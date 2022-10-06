import { QueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useState } from 'react';

import useAccount from '@hooks/useAccount';
import { login } from '@redux/slices/user';
import { useAppDispatch } from '@redux/storeHooks';
import * as Yup from 'yup';
import axios from '@utils/axios';
import { Form, Formik } from 'formik';
import InputGroup from '@components/common/InputGroup';

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

  const handleSubmit = async (username: string, password: string) => {};

  return (
    <div className='bg-white'>
      <div className='flex h-screen flex-col items-center justify-center p-6'>
        <div className='mx-auto w-10/12 md:w-96'>
          <h1 className='mb-2 text-lg font-medium'>로그인</h1>
          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            validationSchema={Yup.object({
              username: Yup.string().required('아이디를 입력해주세요.'),
              password: Yup.string().required('비밀번호를 입력해주세요.'),
            })}
            onSubmit={async (val, fn) => {
              try {
                const {
                  data: { token },
                } = await axios.post(
                  '/auth/login',
                  { password: val.password, username: val.username },
                  { withCredentials: true },
                );

                localStorage.setItem('superSecret', token);
                dispatch(login());

                qc.invalidateQueries(['user']);

                router.push('/');
              } catch (error: any) {
                console.log(error);
                for (const key in error) {
                  fn.setFieldError(key, error[key]);
                }
              }
            }}>
            {(formik) => {
              return (
                <Form>
                  <InputGroup
                    placeholder='Username'
                    value={formik.values.username}
                    setValue={formik.handleChange}
                    error={Boolean(
                      formik.touched.username && formik.errors.username,
                    )}
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                    name='username'
                    type='text'
                  />
                  <InputGroup
                    placeholder='Password'
                    value={formik.values.password}
                    setValue={formik.handleChange}
                    error={Boolean(
                      formik.touched.password && formik.errors.password,
                    )}
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    name='password'
                    type='password'
                  />
                  <button
                    disabled={
                      formik.values.username.length === 0 ||
                      formik.values.password.length === 0
                    }
                    className='mb-1 w-full rounded border border-red-400 bg-red-400 
            py-4 text-xs font-bold uppercase text-white
            disabled:border-gray-400 disabled:bg-gray-400
            '>
                    로그인
                  </button>
                </Form>
              );
            }}
          </Formik>

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

import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import InputGroup from '@components/InputGroup';
import useAccount from '@hooks/useAccount';
import axios from '@utils/axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

interface RegisterTypes {
  email: string;
  username: string;
  password: string;
}
const Register = () => {
  const router = useRouter();
  const { account } = useAccount();
  if (account) router.push('/');

  const handleSubmit = async ({
    email,
    username,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }) => {
    try {
      const result = await axios.post('/auth/register', {
        email,
        username,
        password,
      });

      router.push('/login');
    } catch (error: any) {
      console.log('error', error);
    }
  };

  return (
    <div className='bg-white'>
      <div className='flex h-screen flex-col items-center justify-center p-6'>
        <div className='mx-auto w-10/12 md:w-96'>
          <h1 className='mb-2 text-lg font-medium'>회원가입</h1>
          <Formik
            initialValues={{
              email: '',
              username: '',
              password: '',
              passwordConfirm: '',
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email('올바른 이메일을 입력해주세요.')
                .required('이메일을 입력해주세요.'),
              username: Yup.string()
                .matches(
                  /^[a-zA-Z0-9]*$/,
                  '아이디는 영어와 숫자로만 입력해주세요.',
                )
                .min(3, '아이디는 최소 3글자 이상으로 지어주세요.')
                .required('아이디를 입력해주세요.'),
              password: Yup.string()
                .min(6, '비밀번호는 최소 6자 이상으로 입력해주세요.')
                .required('비밀번호를 입력해주세요.'),
              passwordConfirm: Yup.string().oneOf(
                [Yup.ref('password'), null],
                '비밀번호가 서로 일치하지 않습니다.',
              ),
            })}
            onSubmit={async (val, fn) => {
              try {
                const result = await axios.post('/auth/register', {
                  email: val.email,
                  username: val.username,
                  password: val.passwordConfirm,
                });

                router.push('/login');
              } catch (error: any) {
                console.log('error', error);
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
                    placeholder='Email'
                    value={formik.values.email}
                    setValue={formik.handleChange}
                    error={Boolean(formik.touched.email && formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    name='email'
                    type='text'
                  />
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
                  <InputGroup
                    placeholder='Password Cofirm'
                    value={formik.values.passwordConfirm}
                    setValue={formik.handleChange}
                    error={Boolean(
                      formik.touched.passwordConfirm &&
                        formik.errors.passwordConfirm,
                    )}
                    helperText={
                      formik.touched.passwordConfirm &&
                      formik.errors.passwordConfirm
                    }
                    name='passwordConfirm'
                    type='password'
                  />
                  <button
                    type='submit'
                    disabled={
                      formik.values.email.length === 0 ||
                      formik.values.username.length === 0 ||
                      formik.values.password.length === 0 ||
                      formik.values.passwordConfirm.length === 0
                    }
                    className='mb-1 w-full rounded border border-red-400 
            bg-red-400 py-4 text-xs font-bold uppercase text-white
            disabled:border-gray-400 disabled:bg-gray-400'>
                    회원 가입
                  </button>
                </Form>
              );
            }}
          </Formik>

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

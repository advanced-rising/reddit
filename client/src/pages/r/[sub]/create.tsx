import axios from '@utils/axios';
import { Post } from '@_types/dto';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import ErrorText from '@components/ErrorText';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error('쿠키가 없습니다.');

    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`, {
      headers: { cookie },
    });
    return { props: {} };
  } catch (error) {
    res.writeHead(307, { Location: '/login' }).end();

    return { props: {} };
  }
};

const PostCreate = () => {
  const router = useRouter();
  const { sub: subName } = router.query;
  const submitPost = async (title: string, body: string) => {
    if (title.trim() === '' || !subName) return;

    try {
      const { data: post } = await axios.post<Post>('/posts', {
        title: title.trim(),
        body: body,
        sub: subName,
      });

      router.push({
        pathname: `/r/${subName}/${post.identifier}/${post.slug}`,
        query: { identifier: post.identifier, slug: post.slug },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col justify-center pt-16'>
      <div className='mx-auto w-10/12 md:w-96'>
        <div className='rounded bg-white p-4'>
          <h1 className='mb-3 text-lg'>포스트 생성하기</h1>
          <Formik
            initialValues={{
              title: '',
              body: '',
            }}
            validationSchema={Yup.object({
              title: Yup.string()
                .min(2, '최소 2글자 이상을 입력해주세요.')
                .max(20, '제목은 20글자를 넘길 수 없습니다.')
                .required('제목을 입력해주세요.'),
              body: Yup.string()
                .min(2, '최소 2글자 이상을 입력해주세요.')
                .required('내용을 입력해주세요.'),
            })}
            onSubmit={(val) => {
              submitPost(val.title, val.body);
            }}>
            {(formik) => {
              return (
                <Form>
                  <div className='relative mb-2'>
                    <input
                      type='text'
                      className='w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                      placeholder='제목'
                      maxLength={20}
                      value={formik.values.title}
                      name='title'
                      onChange={formik.handleChange}
                    />
                    <div
                      style={{ top: 10, right: 10 }}
                      className='absolute mb-2 select-none text-sm text-gray-400'>
                      {formik.values.title.trim().length}/20
                    </div>
                    {formik.touched.title && formik.errors.title && (
                      <ErrorText>{formik.errors.title}</ErrorText>
                    )}
                  </div>

                  <textarea
                    rows={4}
                    placeholder='설명'
                    className='w-full rounded border border-gray-300 p-3 pb-0 focus:border-blue-500 focus:outline-none'
                    value={formik.values.body}
                    name='body'
                    onChange={formik.handleChange}
                  />
                  {formik.touched.body && formik.errors.body && (
                    <ErrorText>{formik.errors.body}</ErrorText>
                  )}
                  <div className='flex justify-end'>
                    <button
                      type='submit'
                      disabled={
                        formik.values.title.length === 0 ||
                        formik.values.body.length === 0
                      }
                      className='rounded border bg-red-400 px-4 py-1 text-sm font-semibold text-white disabled:bg-gray-400'>
                      생성하기
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default PostCreate;

import axios from '@utils/axios';
import { Post } from '@_types/dto';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useState } from 'react';

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
  const [createPost, setCreatePost] = useState<{ title: string; body: string }>({
    title: '',
    body: '',
  });

  const router = useRouter();
  const { sub: subName } = router.query;
  const submitPost = async (e: FormEvent) => {
    e.preventDefault();
    if (createPost.title.trim() === '' || !subName) return;

    try {
      const { data: post } = await axios.post<Post>('/posts', {
        title: createPost.title.trim(),
        body: createPost.body,
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

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = event.target;

    setCreatePost({ ...createPost, [name]: value });
  };

  return (
    <div className='flex flex-col justify-center pt-16'>
      <div className='w-10/12 mx-auto md:w-96'>
        <div className='p-4 bg-white rounded'>
          <h1 className='mb-3 text-lg'>포스트 생성하기</h1>
          <form onSubmit={submitPost}>
            <div className='relative mb-2'>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                placeholder='제목'
                maxLength={20}
                value={createPost.title}
                name='title'
                onChange={handleChange}
              />
              <div
                style={{ top: 10, right: 10 }}
                className='absolute mb-2 text-sm text-gray-400 select-none'>
                {createPost.title.trim().length}/20
              </div>
            </div>
            <textarea
              rows={4}
              placeholder='설명'
              className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
              value={createPost.body}
              name='body'
              onChange={handleChange}
            />
            <div className='flex justify-end'>
              <button
                disabled={createPost.title.length === 0 || createPost.body.length === 0}
                className='px-4 py-1 text-sm font-semibold text-white disabled:bg-gray-400 border rounded bg-red-400'>
                생성하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostCreate;

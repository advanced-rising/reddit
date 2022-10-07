import type { GetServerSidePropsContext, NextPage } from 'next';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

import axios from '@utils/axios';
import useSubQuery from '@hooks/useSubQuery';
import { Post, User } from '@_types/dto';
import useAccount from '@hooks/useAccount';
import { useAppSelector } from '@redux/storeHooks';
import usePostQuery from '@hooks/usePostQuery';
import PostCard from '@components/PostCard';
import qs from 'qs';
import { useInView } from 'react-intersection-observer';

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  try {
    const cookie = req.headers.cookie;
    // 쿠키 없다면 에러 보내기
    if (!cookie) throw new Error('Missing auth token cookie');
    // 쿠키 있다면 쿠키를 이용해서 벡엔드 인증처리하기
    const { data } = await axios.get('/auth/me', { headers: { cookie } });

    return { props: { data } };
  } catch (error) {
    return { props: {} };
  }
};

interface HomeProps {
  data: User;
}

const Home: NextPage<HomeProps> = ({ data }) => {
  const router = useRouter();
  const { account } = useAccount();
  const { user } = useAppSelector((state) => state.user);
  const { topSubs } = useSubQuery({});
  const { ref, inView } = useInView();
  const [query, setQuery] = useState({
    page: 0,
  });
  const { posts, fetchNextPage, error, status } = usePostQuery({
    query: query.page,
  });
  console.log('posts', posts?.pages[0]);
  useEffect(() => {
    if (inView) {
      fetchNextPage();
      setQuery({ page: query.page + 1 });
    }
  }, [inView]);

  return (
    <div className='mx-auto flex max-w-5xl px-4 pt-6'>
      {/* 포스트 리스트 */}
      {status === 'loading' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <span>Error: {error}</span>
      ) : (
        <div className='w-full md:mr-3 md:w-8/12'>
          <button onClick={() => fetchNextPage()}>asdasasd</button>
          {posts?.pages[0].map((post: Post, index: number) => {
            return <PostCard key={post.identifier} post={post} />;
          })}
          <div ref={ref} />
        </div>
      )}

      {/* 사이드바 */}
      <div className='ml-3 hidden w-4/12 md:block'>
        <div className='rounded border bg-white'>
          <div className='border-b p-4'>
            <p className='text-center text-lg font-semibold'>상위 커뮤니티</p>
          </div>

          {/* 커뮤니티 리스트 */}
          <div>
            {topSubs?.map((sub) => (
              <div
                key={sub.name}
                className='flex w-full items-center border-b px-4 py-2 text-xs'>
                <Link href={`/r/${sub.name}`}>
                  <a>
                    <Image
                      src={sub.imageUrl}
                      className='cursor-pointer rounded-full'
                      alt='Sub'
                      width={24}
                      height={24}
                    />
                  </a>
                </Link>
                <Link href={`/r/${sub.name}`}>
                  <a className='ml-2 flex w-full flex-row justify-between font-bold hover:cursor-pointer'>
                    <p>/r/{sub.name}</p>
                    <p className='font-md ml-auto'>{sub.postCount}</p>
                  </a>
                </Link>
              </div>
            ))}
          </div>
          {user && (
            <div className='w-full py-6 text-center'>
              <Link href='/subs/create'>
                <a className='w-full rounded bg-red-400 p-2 text-center text-white'>
                  커뮤니티 만들기
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

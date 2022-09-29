import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAccount from '../hooks/useAccount';
import { useAppSelector } from '../redux/storeHooks';
import { Post, User } from '../types/dto';
import axios from '../utils/axios';

export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
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

  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/posts?page=${pageIndex}`;
  };

  const { data: subs } = useQuery(
    ['subs'],
    () => {
      axios.get(`/subs/sub/topSubs`);
    },
    {},
  );
  console.log('subs', subs);

  // const {
  //   status,
  //   data: post,
  //   error,
  //   isFetching,
  //   isFetchingNextPage,
  //   isFetchingPreviousPage,
  //   fetchNextPage,
  //   fetchPreviousPage,
  //   hasNextPage,
  //   hasPreviousPage,
  // } = useInfiniteQuery(
  //   ['post'],
  //   async ({ pageParam = 0 }) => {
  //     const res = await axios.get(`/posts?page=` + pageParam);
  //     return res.data;
  //   },
  //   {
  //     getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
  //     getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
  //   },
  // );

  return (
    <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
      {/* 포스트 리스트 */}
      {/* <div className='w-full md:mr-3 md:w-8/12'>
        {isInitialLoading && <p className='text-lg text-center'>로딩중입니다...</p>}
        {posts?.map((post) => (
          <PostCard key={post.identifier} post={post} mutate={mutate} />
        ))}
      </div> */}

      {/* 사이드바 */}
      <div className='hidden w-4/12 ml-3 md:block'>
        <div className='bg-white border rounded'>
          <div className='p-4 border-b'>
            <p className='text-lg font-semibold text-center'>상위 커뮤니티</p>
          </div>

          {/* 커뮤니티 리스트 */}
          <div>
            {/* {topSubs?.map((sub) => (
              <div key={sub.name} className='flex items-center px-4 py-2 text-xs border-b'>
                <Link href={`/r/${sub.name}`}>
                  <a>
                    <Image
                      src={sub.imageUrl}
                      className='rounded-full cursor-pointer'
                      alt='Sub'
                      width={24}
                      height={24}
                    />
                  </a>
                </Link>
                <Link href={`/r/${sub.name}`}>
                  <a className='ml-2 font-bold hover:cursor-pointer'>/r/{sub.name}</a>
                </Link>
                <p className='ml-auto font-md'>{sub.postCount}</p>
              </div>
            ))} */}
          </div>
          {user && (
            <div className='w-full py-6 text-center'>
              <Link href='/subs/create'>
                <a className='w-full p-2 text-center text-white bg-gray-400 rounded'>
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

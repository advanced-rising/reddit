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
  const { posts, fetchNextPage, hasNextPage } = usePostQuery({
    query: query.page,
  });
  console.log('posts', posts);
  console.log('query', query.page);
  const scrollPosts: Post[] = posts
    ? ([] as Post[]).concat(...posts.pages)
    : [];
  console.log('scrollPosts', scrollPosts);
  useEffect(() => {
    if (inView && hasNextPage) {
      setQuery({ page: query.page + 1 });
      fetchNextPage();
    }
  }, [inView]);

  const [observedPost, setObservedPost] = useState('');

  useEffect(() => {
    // 포스트가 없다면 return
    if (!posts || posts.pages.length === 0) return;
    // posts 배열안에 마지막 post에 id를 가져옵니다.
    const id = posts.pages[posts.pages.length - 1].identifier;
    // posts 배열에 post가 추가돼서 마지막 post가 바뀌었다면
    // 바뀐 post 중 마지막post를 obsevedPost로
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    // 브라우저 뷰포트(ViewPort)와 설정한 요소(Element)의 교차점을 관찰
    const observer = new IntersectionObserver(
      // entries는 IntersectionObserverEntry 인스턴스의 배열
      (entries) => {
        // isIntersecting: 관찰 대상의 교차 상태(Boolean)
        if (entries[0].isIntersecting === true) {
          console.log('마지막 포스트에 왔습니다.');
          fetchNextPage();

          setQuery({ page: query.page + 1 });
          observer.unobserve(element);
        }
      },
      { threshold: 1 },
    );
    // 대상 요소의 관찰을 시작
    observer.observe(element);
  };

  return (
    <div className='mx-auto flex max-w-5xl px-4 pt-6'>
      {/* 포스트 리스트 */}

      <div className='w-full md:mr-3 md:w-8/12'>
        {scrollPosts.map((post) => {
          return <PostCard key={post.identifier} post={post} />;
        })}
        <div className='mt-40 bg-slate-700' ref={ref}>
          asdasd
        </div>
      </div>

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

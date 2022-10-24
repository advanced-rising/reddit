import useUserQuery from '@hooks/useUser';
import { Comment, Post } from '@_types/dto';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import PostCard from '../../components/PostCard';

const UserPage = () => {
  const router = useRouter();
  const username = router.query.username;

  const { user } = useUserQuery({ username: String(username) });

  return (
    <div className='mx-auto flex max-w-5xl px-4 pt-5'>
      {/* 유저 포스트 댓글 리스트 */}
      <div className='w-full md:mr-3 md:w-8/12'>
        {user?.userData?.map((data: any) => {
          if (data.type === 'Post') {
            const post: Post = data;
            return <PostCard key={post.identifier} post={post} />;
          } else {
            const comment: Comment = data;
            return (
              <div
                key={comment.identifier}
                className='my-4 flex rounded bg-white'>
                <div className='w-10 flex-shrink-0 rounded-l border-r bg-white py-10 text-center'>
                  <i className='fas fa-comment-alt fa-xs text-gray-500'></i>
                </div>
                <div className='w-full p-2'>
                  <p className='mb-2 text-xs text-gray-500'>
                    <Link href={`/u/${comment.username}`}>
                      <a className='cursor-pointer hover:underline'>
                        {comment.username}
                      </a>
                    </Link>{' '}
                    <span>commented on</span>{' '}
                    <Link href={`/u/${comment.post?.url}`}>
                      <a className='cursor-pointer font-semibold hover:underline'>
                        {comment.post?.title}
                      </a>
                    </Link>{' '}
                    <span>•</span>{' '}
                    <Link href={`/u/${comment.post?.subName}`}>
                      <a className='cursor-pointer text-black hover:underline'>
                        /r/{comment.post?.subName}
                      </a>
                    </Link>
                  </p>
                  <hr />
                  <p className='break-words p-1 pr-10'>{comment.body}</p>
                </div>
              </div>
            );
          }
        })}
      </div>
      {/* 유저 정보 */}
      <div className='ml-3 hidden w-4/12 md:block'>
        <div className='flex items-center rounded-t bg-gray-400 p-3'>
          <Image
            src='https://www.gravatar.com/avatar/0000?d=mp&f=y'
            alt='user profile'
            className='mx-auto rounded-full border border-white'
            width={40}
            height={40}
          />
          <p className='text-md pl-2'>{user?.user?.username}</p>
        </div>
        <div className='rounded-b bg-white p-2'>
          <p>{dayjs(user?.user?.createdAt).format('YYYY.MM.DD')} 가입</p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;

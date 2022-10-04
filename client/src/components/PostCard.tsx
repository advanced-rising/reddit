import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAppSelector } from '@redux/storeHooks';

import { Post } from '@_types/dto';
import { useQueryClient } from '@tanstack/react-query';
import { POST_QUERY_KEY } from '@hooks/usePostQuery';
import axios from '@utils/axios';
import { SUB_QUERY_KEY } from '@hooks/useSubQuery';

interface PostCardProps {
  post: Post;
}

const PostCard = (props: PostCardProps) => {
  const {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  } = props.post;
  const router = useRouter();
  const qc = useQueryClient();
  const isInSubPage = router.pathname === '/r/[sub]';

  const { user } = useAppSelector((state) => state.user);

  const vote = async (value: number) => {
    console.log('??? >> ');
    if (!user) router.push('/login');

    if (value === userVote) value = 0;

    try {
      await axios.post('/votes', { identifier, slug, value });
      qc.invalidateQueries([POST_QUERY_KEY.COMMENTS]);
      qc.invalidateQueries([POST_QUERY_KEY.POST]);
      qc.invalidateQueries([SUB_QUERY_KEY.SUB_NAME]);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log('props.post', props.post);

  return (
    <div className='flex mb-4 bg-white rounded' id={identifier}>
      {/* 좋아요 싫어요 기능 부분 */}
      <div className=' w-10 py-2 rounded-l justify-start items-center flex-col flex'>
        {/* 좋아요 */}
        <div
          className='flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
          onClick={() => vote(1)}>
          {userVote === 1 ? (
            <FaChevronUp className='text-red-500' />
          ) : (
            <FaChevronUp />
          )}
        </div>
        <p className='text-xs font-bold'>{voteScore}</p>
        {/* 싫어요 */}
        <div
          className='flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500'
          onClick={() => vote(-1)}>
          {userVote === -1 ? (
            <FaChevronDown className='text-blue-500' />
          ) : (
            <FaChevronDown />
          )}
        </div>
      </div>
      {/* 포스트 데이터 부분 */}
      <div className='w-full p-2'>
        <div className='flex items-center'>
          {!isInSubPage && (
            <div className='flex items-center'>
              <Link href={`/r/${subName}`}>
                <a>
                  <Image
                    src={sub!.imageUrl}
                    alt='sub'
                    className='rounded-full cursor-pointer'
                    width={12}
                    height={12}
                  />
                </a>
              </Link>
              <Link href={`/r/${subName}`}>
                <a className='ml-2 text-xs font-bold cursor-pointer hover:underline'>
                  /r/{subName}
                </a>
              </Link>
              <span className='mx-1 text-xs text-gray-400'>•</span>
            </div>
          )}

          <p className='text-xs text-gray-400'>
            Posted by
            <Link href={`/u/${username}`}>
              <a className='mx-1 hover:underline'>/u/{username}</a>
            </Link>
            <Link href={url}>
              <a className='mx-1 hover:underline'>
                {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
              </a>
            </Link>
          </p>
        </div>

        <Link href={url}>
          <a className='my-1 text-lg font-medium'>{title}</a>
        </Link>
        {body && <p className='my-1 text-sm'>{body}</p>}
        <div className='flex'>
          <Link href={url}>
            <a>
              <i className='mr-1 fas fa-comment-alt fa-xs'></i>
              <span>{commentCount}</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

import { Comment } from '@_types/dto';
import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface PostLikeProps {
  userVote?: number;
  voteScore?: number;
  vote: (value: number, comment?: Comment) => void;
}

export default function PostLike(props: PostLikeProps) {
  const { userVote, voteScore, vote } = props;
  return (
    <div className=' flex w-10 flex-col items-center justify-start rounded-l py-2'>
      {/* 좋아요 */}
      <div
        className='mx-auto flex w-6 cursor-pointer justify-center rounded text-gray-400 hover:bg-gray-300 hover:text-red-500'
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
        className='mx-auto flex w-6 cursor-pointer justify-center rounded text-gray-400 hover:bg-gray-300 hover:text-blue-500'
        onClick={() => vote(-1)}>
        {userVote === -1 ? (
          <FaChevronDown className='text-blue-500' />
        ) : (
          <FaChevronDown />
        )}
      </div>
    </div>
  );
}

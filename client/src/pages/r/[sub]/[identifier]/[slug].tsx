import Link from 'next/link';
import { useRouter } from 'next/router';

import dayjs from 'dayjs';

import { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAppSelector } from '@redux/storeHooks';
import { useQueryClient } from '@tanstack/react-query';
import usePostQuery, { POST_QUERY_KEY } from '@hooks/usePostQuery';
import { GetServerSideProps } from 'next';
import { Comment } from '@_types/dto';
import useAccount from '@hooks/useAccount';
import SubLayout from '@components/layout/SubLayout';
import axios from '@utils/axios';
import PostLike from '@components/common/PostLike';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      data: query,
    },
  };
};

const PostPage = ({ data }: any) => {
  const router = useRouter();
  const qc = useQueryClient();
  const { identifier, sub, slug } = router.query;
  const { user } = useAppSelector((state) => state.user);
  const { account } = useAccount();
  const [newComment, setNewComment] = useState('');

  const { post, comments } = usePostQuery({
    identifier: data.identifier,
    slug: data.slug,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') {
      return;
    }
    try {
      await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
        body: newComment,
      });
      qc.invalidateQueries([POST_QUERY_KEY.COMMENTS]);
      setNewComment('');
    } catch (error) {
      console.log(error);
    }
  };

  const vote = async (value: number, comment?: Comment) => {
    if (!user) router.push('/login');

    // 이미 클릭 한 vote 버튼을 눌렀을 시에는 reset
    if (
      (!comment && value === post?.userVote) ||
      (comment && comment.userVote === value)
    ) {
      value = 0;
    }

    try {
      await axios.post('/votes', {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });

      qc.invalidateQueries([POST_QUERY_KEY.COMMENTS]);
      qc.invalidateQueries([POST_QUERY_KEY.POST]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SubLayout data={data}>
      <div className='mx-auto flex w-full '>
        <div className='w-full'>
          <div className='mb-4 w-full rounded bg-white'>
            {post && (
              <>
                <div className='flex '>
                  {/* 좋아요 싫어요 기능 부분 */}
                  <PostLike
                    userVote={post?.userVote}
                    voteScore={post?.voteScore}
                    vote={vote}
                  />

                  <div className='py-2 pr-2'>
                    <div className='flex items-center'>
                      <p className='test-gray-400 text-xs'>
                        Posted by <i className='fas fa-abacus'></i>
                        <Link href={`/u/${post.username}`}>
                          <a className='mx-1 hover:underline'>
                            /u/{post.username}
                          </a>
                        </Link>
                        <Link href={post.url}>
                          <a className='mx-1 hover:underline'>
                            {dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}
                          </a>
                        </Link>
                      </p>
                    </div>
                    <h1 className='my-1 text-xl font-medium'>{post.title}</h1>
                    <p className='my-3 text-sm'>{post.body}</p>
                    <div className='flex'>
                      <button>
                        <i className='fas fa-comment-alt fa-xs mr-1'></i>
                        <span className='font-bold'>
                          {post.commentCount} Comments
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 댓글 작성 구간 */}
                <div className='pr-6 pb-4 pl-9'>
                  {user ? (
                    <div>
                      <p className='mb-1 text-xs'>
                        <Link href={`/u/${account?.username}`}>
                          <a className='font-semibold text-blue-500'>
                            {account?.username}
                          </a>
                        </Link>{' '}
                        으로 댓글 작성
                      </p>
                      <form onSubmit={handleSubmit}>
                        <textarea
                          className='w-full rounded border border-gray-300 p-3 focus:border-gray-600 focus:outline-none'
                          onChange={(e) => setNewComment(e.target.value)}
                          value={newComment}></textarea>
                        <div className='flex justify-end pt-2'>
                          <button
                            className='rounded bg-red-400 px-3 py-1 text-white disabled:bg-gray-400'
                            disabled={newComment.trim() === ''}>
                            댓글 작성
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className='flex items-center justify-between rounded border border-gray-200 px-2 py-4'>
                      <p className='font-semibold text-gray-400'>
                        댓글 작성을 위해서 로그인 해주세요.
                      </p>
                      <div>
                        <Link href={`/login`}>
                          <a className='rounded bg-gray-400 px-3 py-1 text-white'>
                            로그인
                          </a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                {/* 댓글 리스트 부분 */}
                <ul className='flex w-full flex-col items-center justify-center gap-2 px-2 pb-2'>
                  {comments?.map((comment) => (
                    <li
                      className='flex w-full items-start justify-start rounded-lg border'
                      key={comment.identifier}>
                      {/* 좋아요 싫어요 기능 부분 */}
                      <div className='w-10 flex-shrink-0 rounded-l py-2 text-center'>
                        {/* 좋아요 */}
                        <div
                          className='mx-auto flex w-6 cursor-pointer justify-center rounded text-gray-400 hover:bg-gray-300 hover:text-red-500'
                          onClick={() => vote(1, comment)}>
                          {comment.userVote === 1 ? (
                            <FaChevronUp className='text-red-500' />
                          ) : (
                            <FaChevronUp />
                          )}
                        </div>
                        <p className='text-xs font-bold'>{comment.voteScore}</p>
                        {/* 싫어요 */}
                        <div
                          className='mx-auto flex w-6 cursor-pointer justify-center rounded text-gray-400 hover:bg-gray-300 hover:text-blue-500'
                          onClick={() => vote(-1, comment)}>
                          {comment.userVote === -1 ? (
                            <FaChevronDown className='text-blue-500' />
                          ) : (
                            <FaChevronDown />
                          )}
                        </div>
                      </div>

                      <div className='flex flex-col py-2 pr-2'>
                        <p className='mb-1 text-xs leading-none'>
                          <Link href={`/u/${comment.username}`}>
                            <a className='mr-1 font-bold hover:underline'>
                              {comment.username}
                            </a>
                          </Link>
                          <span className='text-gray-600'>
                            {`${comment.voteScore}
                        posts${dayjs(comment.createdAt).format(
                          'YYYY-MM-DD HH:mm',
                        )}`}
                          </span>
                        </p>
                        <p className=' whitespace-normal break-all	'>
                          {comment.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </SubLayout>
  );
};

export default PostPage;

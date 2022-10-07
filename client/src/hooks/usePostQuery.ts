import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Comment, Post } from '../types/dto';
import axios from '@utils/axios';

export const POST_QUERY_KEY = {
  POST: 'post',
  POSTS: 'posts',
  COMMENTS: 'comments',
};

interface usePostQueryTypes {
  query?: string | number;
  options?: any;
  identifier?: string;
  slug?: string;
}

const usePostQuery = (props: usePostQueryTypes) => {
  const { query = 0, options, identifier, slug } = props;

  const {
    status,
    data: posts,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    [POST_QUERY_KEY.POSTS],
    async ({ pageParam = 0 }): Promise<Post[] | any> => {
      console.log('query', query);
      const { data } = await axios.get(`/posts?page=${pageParam}`);
      return data;
    },
    {
      getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    },
  );

  const { data: post } = useQuery(
    [POST_QUERY_KEY.POST],
    async (): Promise<Post> => {
      const { data } = await axios.get(`/posts/${identifier}/${slug}`);
      return data;
    },
    {
      enabled: Boolean(identifier && slug),
    },
  );

  const { data: comments } = useQuery(
    [POST_QUERY_KEY.COMMENTS],
    async (): Promise<Comment[]> => {
      const { data } = await axios.get(`/posts/${identifier}/${slug}/comments`);
      return data;
    },
    {
      enabled: Boolean(identifier && slug),
    },
  );

  return {
    posts,
    post,
    comments,
    fetchNextPage,
    status,
    error,
  };
};

export default usePostQuery;

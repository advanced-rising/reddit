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
    [POST_QUERY_KEY.POSTS, query],
    async ({ pageParam = query }): Promise<Post[] | any> => {
      console.log('query', query);
      const { data } = await axios.get(`/posts?page=${pageParam}`);
      const nextPage = data ? pageParam + 1 : undefined;
      return { data, nextPage };
    },
    {
      getPreviousPageParam: (firstPage) => firstPage ?? undefined,
      getNextPageParam: (lastPage, pages) => {
        lastPage.nextPage ?? undefined;
      },
    },
  );

  // const { data: posts } = useQuery(
  //   [POST_QUERY_KEY.POSTS, query],
  //   async (): Promise<Post[]> => {
  //     const { data } = await axios.get(`/posts?page=${query}`);
  //     return data;
  //   },
  // );

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
    hasNextPage,
  };
};

export default usePostQuery;

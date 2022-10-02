import { useQuery } from '@tanstack/react-query';
import { Comment, Post } from '../types/dto';
import axios from '@utils/axios';

export const POST_QUERY_KEY = {
  POST: 'post',
  POSTS: 'posts',
  COMMENTS: 'comments',
};

interface usePostQueryTypes {
  query?: string;
  options?: any;
  identifier?: string;
  slug?: string;
}

const usePostQuery = (props: usePostQueryTypes) => {
  const { query, options, identifier, slug } = props;
  const { data: posts } = useQuery(
    [POST_QUERY_KEY.POSTS],
    async (): Promise<Post[]> => {
      const { data } = await axios.get(`/posts?${query}`);
      return data;
    },
    options,
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
  };
};

export default usePostQuery;

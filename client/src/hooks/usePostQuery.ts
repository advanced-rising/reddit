import { useQuery } from '@tanstack/react-query';
import { Post } from '../types/dto';
import axios from '@utils/axios';

export const POST_QUERY_KEY = {
  POST: ['post'],
  POSTS: ['posts'],
};

interface usePostQueryTypes {
  query?: string;
  options?: any;
}

const usePostQuery = (props: usePostQueryTypes) => {
  const { query, options } = props;
  const { data: posts } = useQuery(
    POST_QUERY_KEY.POSTS,
    async (): Promise<Post[]> => {
      const { data } = await axios.get(`/posts?${query}`);
      return data;
    },
    options,
  );

  return {
    posts,
  };
};

export default usePostQuery;

import { useQuery } from '@tanstack/react-query';

import axios from '@utils/axios';
import { Post, User } from '@_types/dto';

interface UserTypes {
  user: User;
  userDate: Post[];
}

export const USER_QUERY_KEY = {
  USER: 'user',
};

interface useUserQueryTypes {
  username?: string;
}

const useUserQuery = (props: useUserQueryTypes) => {
  const { username } = props;
  const { data: user } = useQuery(
    [USER_QUERY_KEY.USER],
    async (): Promise<UserTypes> => {
      const { data } = await axios.get(`/users/${username}`);
      return data;
    },
    {
      enabled: Boolean(username),
    },
  );

  return {
    user,
  };
};

export default useUserQuery;

import { useQuery } from '@tanstack/react-query';

import axios from '@utils/axios';
import { User } from '@_types/dto';

export const USER_QUERY_KEY = {
  USER: 'user',
};

interface useUserQueryTypes {
  username: string;
}

const useUserQuery = (props: useUserQueryTypes) => {
  const { username } = props;
  const { data: user } = useQuery(
    [USER_QUERY_KEY.USER],
    async (): Promise<User> => {
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

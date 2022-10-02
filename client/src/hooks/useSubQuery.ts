import { useQuery } from '@tanstack/react-query';
import { Sub } from '../types/dto';
import axios from '../utils/axios';

export const SUB_QUERY_KEY = {
  SUB: 'sub',
  SUB_NAME: 'sub-name',
  SUBS: 'subs',
  TOP_SUBS: 'top-subs',
};

interface useSubQueryTypes {
  subName?: string;
  dependence?: any;
}

const useSubQuery = (props: useSubQueryTypes) => {
  const { subName, dependence } = props;
  const { data: topSubs } = useQuery(
    [SUB_QUERY_KEY.TOP_SUBS, dependence],
    async (): Promise<Sub[]> => {
      const { data } = await axios.get(`/subs/sub/topSubs`);
      return data;
    },
  );

  const { data: subsName } = useQuery(
    [SUB_QUERY_KEY.SUB_NAME],
    async (): Promise<Sub> => {
      const { data } = await axios.get(`/subs/${subName}`);
      return data;
    },
    {
      enabled: Boolean(subName),
    },
  );

  return {
    topSubs,
    subsName,
  };
};

export default useSubQuery;

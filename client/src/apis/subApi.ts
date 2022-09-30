import { Sub } from '../types/dto';
import axios from '../utils/axios';

const findByName = async (subName: any): Promise<Sub> => {
  const { data } = await axios.get(`/subs/${subName}`);

  return data;
};
const findByTop = async (): Promise<Sub[]> => {
  const { data } = await axios.get(`/subs/sub/topSubs`);
  return data;
};

export default { findByName, findByTop };

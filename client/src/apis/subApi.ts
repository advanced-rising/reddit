import { Sub } from '../types/dto';
import axios from '../utils/axios';

const getSubs = async (subName: any): Promise<Sub> => {
  const { data } = await axios.get(`/subs/${subName}`);

  return data;
};

export default { getSubs };

import QueryString from 'qs';
import { Post, Sub } from '../types/dto';
import axios from '../utils/axios';

const findByName = async (subName: any): Promise<Sub> => {
  const { data } = await axios.get(`/subs/${subName}`);

  return data;
};
const findAll = async (query: string): Promise<Post[]> => {
  const { data } = await axios.get(`/posts?${query}`);
  return data;
};

export default { findByName, findAll };

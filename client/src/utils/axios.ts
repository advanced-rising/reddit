import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL + '/api',
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Content-Type': 'application/json',
  },
});

if (process.env.NEXT_PUBLIC_BASE_URL) {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL + '/api';
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.data?.error && error.response.data.error.message) {
      console.log(`${error.response.data.error.message}`);
    } else {
      console.log(
        `Error Code : ${error.code} Error Message : ${error.message}`,
      );
    }
    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong',
    );
  },
);

export default axios;

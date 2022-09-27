import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAccount from '../hooks/useAccount';

const Home: NextPage = () => {
  const router = useRouter();
  const { account } = useAccount();

  return (
    <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
      asdasdasd
      {/* 포스트 리스트 */}
      <div className='w-full md:mr-3 md:w-8/12'>asdasdasd</div>
    </div>
  );
};

export default Home;

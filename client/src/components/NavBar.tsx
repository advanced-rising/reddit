import Image from 'next/image';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import useAccount from '../hooks/useAccount';
import axios from '../utils/axios';

const NavBar: React.FC = () => {
  const { account } = useAccount();

  const handleLogout = () => {
    axios
      .post('/auth/logout')
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 bg-white h-13'>
      <span className='text-2xl font-semibold text-gray-400'>
        <Link href='/'>
          <a>
            <Image src='/reddit-name-logo.png' alt='logo' width={80} height={45}></Image>
          </a>
        </Link>
      </span>
      <div className='max-w-full px-4'>
        <div className='relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white'>
          <FaSearch className='ml-2 text-gray-400' />
          <input
            type='text'
            placeholder='Search Reddit'
            className='px-3 py-1 bg-transparent rounded h-7 focus:outline-none'
          />
        </div>
      </div>
      {account && (
        <div className='flex'>
          <button
            className='w-20 px-2 mr-2 text-sm text-center text-white bg-red-400 rounded h-7'
            onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      )}

      {!account && (
        <div className='flex'>
          <Link href='/login' passHref>
            <a className='w-20 px-2 pt-1 mr-2 text-sm text-center text-red-500 border border-red-500 rounded h-7'>
              로그인
            </a>
          </Link>
          <Link href='/register' passHref>
            <a className='w-20 px-2 pt-1 text-sm text-center text-white bg-red-400 rounded h-7'>
              회원가입
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;

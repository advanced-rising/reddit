import Image from 'next/image';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import useAccount from '@hooks/useAccount';
import { logout } from '@redux/slices/user';
import { useAppDispatch, useAppSelector } from '@redux/storeHooks';
import axios from '@utils/axios';
import { useRouter } from 'next/router';

const NavBar: React.FC = () => {
  const router = useRouter();
  const { account, setIsTrue } = useAccount();
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    axios
      .post('/auth/logout')
      .then(() => {
        localStorage.removeItem('superSecret');
        dispatch(logout());
        setIsTrue(false);
        router.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='fixed inset-x-0 top-0 z-10 flex h-14 items-center justify-between bg-white px-5'>
      <span className='text-2xl font-semibold text-gray-400'>
        <Link href='/'>
          <a className='relative flex h-12 w-20'>
            <Image
              src='/reddit-name-logo.png'
              alt='logo'
              layout='fill'
              objectFit='contain'
            />
          </a>
        </Link>
      </span>
      <div className='max-w-full px-4'>
        <div className='relative flex items-center rounded border bg-gray-100 hover:border-gray-700 hover:bg-white'>
          <FaSearch className='ml-2 text-gray-400' />
          <input
            type='text'
            placeholder='Search Reddit'
            className='h-7 rounded bg-transparent px-3 py-1 focus:outline-none'
          />
        </div>
      </div>
      {user && (
        <div className='flex'>
          <button
            className='mr-2 h-7 w-20 rounded bg-red-400 px-2 text-center text-sm text-white'
            onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      )}

      {!user && (
        <div className='flex'>
          <Link href='/login' passHref>
            <a className='mr-2 h-7 w-20 rounded border border-red-500 px-2 pt-1 text-center text-sm text-red-500'>
              로그인
            </a>
          </Link>
          <Link href='/register' passHref>
            <a className='h-7 w-20 rounded bg-red-400 px-2 pt-1 text-center text-sm text-white'>
              회원가입
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;

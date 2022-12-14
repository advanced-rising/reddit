import Link from 'next/link';
import React from 'react';

import dayjs from 'dayjs';
import { useAppSelector } from '@redux/storeHooks';
import { Sub } from '@_types/dto';
type Props = {
  sub: Sub;
};

const SideBar = ({ sub }: Props) => {
  const { user } = useAppSelector((state) => state.user);

  return (
    <div className='ml-3 hidden w-4/12 md:block'>
      <div className='rounded border bg-white'>
        <div className='rounded-t bg-red-400 p-3'>
          <p className='font-semibold text-white'>Info. 커뮤니티</p>
        </div>
        <div className='p-3'>
          <p className='mb-3 text-base'>{sub?.description}</p>
          <div className='mb-3 flex text-sm font-medium'>
            <div className='w-1/2'>
              <p>100</p>
              <p>멤버</p>
            </div>
          </div>
          <p className='my-3'>{dayjs(sub?.createdAt).format('MM.DD.YYYY')}</p>

          {user && (
            <div className='mx-0 my-2'>
              <Link href={`/r/${sub.name}/create`}>
                <a className='w-full rounded bg-red-400 p-2 text-sm text-white'>
                  포스트 생성
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;

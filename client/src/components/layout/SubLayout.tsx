import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import cls from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';

import PostCard from '@components/PostCard';
import SideBar from '@components/SideBar';
import useAccount from '@hooks/useAccount';
import useSubQuery, { SUB_QUERY_KEY } from '@hooks/useSubQuery';
import { useAppSelector } from '@redux/storeHooks';

import axios from '@utils/axios';
import { Post } from '@_types/dto';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      data: query,
    },
  };
};

interface SubLayoutProps {
  data: string;
  children: ReactNode;
}

const SubLayout = (props: SubLayoutProps) => {
  const { children, data } = props;
  const { account } = useAccount();
  const [ownSub, setOwnSub] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [subNameParams, setSubNameParams] = useState<string>(String(data?.sub));

  const qc = useQueryClient();

  const { subsName } = useSubQuery({
    subName: subNameParams && subNameParams,
    dependence: router,
  });

  useEffect(() => {
    if (router && router.query) {
      setSubNameParams(String(router.query.sub));
    }
  }, [router]);

  useEffect(() => {
    if (!subsName || !account) return;
    setOwnSub(account && account.username === subsName.username);
  }, [subsName, account]);

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    if (event.target.value.length === 0) return;

    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileInputRef.current!.name);

    try {
      // @ts-ignore
      await axios.post(`/subs/${subsName.name}/upload`, formData, {
        headers: { 'Context-Type': 'multipart/form-data' },
      });
      qc.invalidateQueries([SUB_QUERY_KEY.SUB_NAME]);
    } catch (error) {
      console.log(error);
    }
  };

  const openFileInput = (type: string) => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };

  return (
    <>
      {subsName && (
        <>
          <div>
            {ownSub && (
              <input
                type='file'
                hidden={true}
                ref={fileInputRef}
                onChange={uploadImage}
                accept='image/*'
              />
            )}
            {/* 배너 이미지 */}
            <div className={cls(ownSub ? 'cursor-pointer' : '', `bg-gray-400 h-56 `)}>
              {subsName.bannerUrl ? (
                <div
                  className={cls(ownSub ? 'cursor-pointer' : '', 'h-56 ')}
                  style={{
                    backgroundImage: `url(${subsName.bannerUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  onClick={() => openFileInput('banner')}
                />
              ) : (
                <div className='h-20 bg-gray-400' onClick={() => openFileInput('banner')}></div>
              )}
            </div>
            {/* 커뮤니티 메타 데이터 */}
            <div className='h-20 bg-white'>
              <div className='relative flex max-w-5xl px-5 mx-auto'>
                <div className='absolute bg-center bg-cover bg-no-repeat' style={{ top: -15 }}>
                  {subsName.imageUrl && (
                    <Image
                      src={subsName.imageUrl}
                      alt='커뮤니티 이미지'
                      width={70}
                      height={70}
                      className={cls(ownSub && 'cursor-pointer', 'rounded-full')}
                      onClick={() => openFileInput('image')}
                    />
                  )}
                </div>
                <div className='pt-1 pl-24'>
                  <div className='flex items-center'>
                    <h1 className='text-3xl font-bold '>{subsName.title}</h1>
                  </div>
                  <p className='font-bold text-gray-400 text-small'>/r/{subsName.name}</p>
                </div>
              </div>
            </div>
          </div>
          {/* 포스트와 사이드바 */}
          <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
            <div className='w-full md:mr-3 md:w-8/12'>{children}</div>
            <SideBar sub={subsName} />
          </div>
        </>
      )}
    </>
  );
};

export default SubLayout;

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import PostCard from '../../components/PostCard';
import SideBar from '../../components/SideBar';
import useAccount from '../../hooks/useAccount';
import useSubQuery, { SUB_QUERY_KEY } from '../../hooks/useSubQuery';
import { useAppSelector } from '../../redux/storeHooks';

import axios from '../../utils/axios';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      data: query,
    },
  };
};

const SubPage = ({ data }: any) => {
  console.log('data', data);
  const { user } = useAppSelector((state) => state.user);
  const { account } = useAccount();
  const [ownSub, setOwnSub] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [subNameParams, setSubNameParams] = useState<string>(String(data.sub));

  const qc = useQueryClient();

  const { subsName } = useSubQuery({
    subName: subNameParams && subNameParams,
    dependence: router,
  });

  useEffect(() => {
    if (router && router.query) {
      console.log(router.query);
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
    console.log('file', file);

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
            <input type='file' hidden={true} ref={fileInputRef} onChange={uploadImage} />
            {/* 배너 이미지 */}
            <div className='bg-gray-400'>
              {subsName.bannerUrl ? (
                <div
                  className='h-56'
                  style={{
                    backgroundImage: `url(${subsName.bannerUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  onClick={() => openFileInput('banner')}></div>
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
                      className='rounded-full cursor-pointer '
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
            <div className='w-full md:mr-3 md:w-8/12'> </div>
            <SideBar sub={subsName} />
          </div>
        </>
      )}
    </>
  );
};

export default SubPage;

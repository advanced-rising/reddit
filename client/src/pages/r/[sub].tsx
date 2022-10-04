import { GetServerSideProps, NextPage } from 'next';

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import PostCard from '@components/PostCard';

import useSubQuery, { SUB_QUERY_KEY } from '@hooks/useSubQuery';

import { Post } from '@_types/dto';
import SubLayout from '@components/layout/SubLayout';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      data: query,
    },
  };
};

interface SubPageProps {
  data: string;
}

const SubPage = ({ data }: SubPageProps) => {
  const router = useRouter();
  const [subNameParams, setSubNameParams] = useState<string>(String(data.sub));

  const { subsName } = useSubQuery({
    subName: subNameParams && subNameParams,
    dependence: router,
  });

  useEffect(() => {
    if (router && router.query) {
      setSubNameParams(String(router.query.sub));
    }
  }, [router]);

  return (
    <SubLayout data={data}>
      {subsName &&
        subsName.posts.map((post: Post) => (
          <PostCard key={post.identifier} post={post} />
        ))}
    </SubLayout>
  );
};

export default SubPage;

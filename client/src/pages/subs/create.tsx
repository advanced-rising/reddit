import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import InputGroup from '../../components/InputGroup';

interface CreateTypes {
  name: string;
  title: string;
  description: string;
}

const SubCreate = () => {
  const router = useRouter();
  const [create, setCreate] = useState<CreateTypes>({
    name: '',
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    return setCreate({ ...create, [name]: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await axios.post('/subs', create);
      router.push(`/r/${res.data.name}`);
    } catch (error: any) {
      console.log(error);
      setErrors(error.response.data);
    }
  };

  return (
    <div className='flex flex-col justify-center pt-16'>
      <div className='w-10/12 p-4 mx-auto bg-white rounded md:w-96'>
        <h1 className='mb-2 text-lg font-medium'>커뮤니티 만들기</h1>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className='my-6'>
            <p className='font-medium'>Name</p>
            <p className='mb-2 text-xs text-gray-400'>커뮤니티 이름은 변경할 수 없습니다.</p>
            <InputGroup
              placeholder='이름'
              value={create.name}
              setValue={handleChange}
              error={errors.name}
              type='text'
              name='name'
            />
          </div>
          <div className='my-6'>
            <p className='font-medium'>Title</p>
            <p className='mb-2 text-xs text-gray-400'>
              주제를 나타냅니다. 언제든지 변경할 수 있습니다.
            </p>
            <InputGroup
              placeholder='제목'
              value={create.title}
              setValue={handleChange}
              error={errors.title}
              name='title'
              type='text'
            />
          </div>
          <div className='my-6'>
            <p className='font-medium'>Description</p>
            <p className='mb-2 text-xs text-gray-400'>해당 커뮤니티에 대한 설명입니다.</p>
            <InputGroup
              placeholder='설명'
              value={create.description}
              setValue={handleChange}
              error={errors.description}
              name='description'
              type='text'
            />
          </div>
          <div className='flex justify-end'>
            <button
              disabled={
                create.name.length === 0 ||
                create.title.length === 0 ||
                create.description.length === 0
              }
              className='px-4 py-2 text-sm font-semibold text-white bg-red-400 
                border rounded disabled:bg-gray-400'>
              커뮤니티 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCreate;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    // 쿠키 없다면 에러 보내기
    if (!cookie) throw new Error('Missing auth token cookie');

    // 쿠키 있다면 쿠키를 이용해서 벡엔드 인증처리하기
    await axios.get('/auth/me', { headers: { cookie } });

    return { props: {} };
  } catch (error) {
    // 쿠키인증 처리에 에러가 나면 로그인 페이지로 이동
    res.writeHead(307, { Location: '/login' }).end();
    return { props: {} };
  }
};
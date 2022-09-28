import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';

import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GetServerSideProps } from 'next';
import axios from '../utils/axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 20,
    },
  },
});

function MyApp(props: AppProps<{ dehydratedState: unknown }>) {
  const { Component, pageProps } = props;
  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps?.dehydratedState}>
          <Provider store={store}>
            {!authRoute && <NavBar />}
            <div className={authRoute ? '' : 'pt-12 bg-gray-200 min-h-screen'}>
              <Component {...pageProps} />
            </div>
          </Provider>
          <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    // 쿠키 없다면 에러 보내기
    if (!cookie) throw new Error('Missing auth token cookie');
    // 쿠키 있다면 쿠키를 이용해서 벡엔드 인증처리하기
    await axios.get('/auth/me', { headers: { cookie } });
    return { props: {} };
  } catch (error) {
    return { props: {} };
  }
};

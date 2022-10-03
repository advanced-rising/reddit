import '../styles/globals.css';
import type { AppContext, AppInitialProps, AppProps } from 'next/app';

import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';

import { Hydrate, QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NextComponentType, NextPage } from 'next';
import { ReactElement, ReactNode, useRef, useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 1000 * 1,
    },
  },
});

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
}
const MyApp = ({ Component, pageProps }: MyAppProps) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  const [queryClient] = useState(() => new QueryClient());
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <>
      <QueryClientProvider client={queryClient || queryClientRef.current}>
        {/* @ts-ignore */}
        <Hydrate state={pageProps?.dehydratedState}>
          <Provider store={store}>
            {!authRoute && <NavBar />}
            <div className={authRoute ? '' : 'pt-12 bg-gray-200 min-h-screen'}>
              {getLayout(<Component {...pageProps} />)}
            </div>
          </Provider>
          <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
        </Hydrate>
      </QueryClientProvider>
    </>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }: AppContext): Promise<AppInitialProps> => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};

export default MyApp;

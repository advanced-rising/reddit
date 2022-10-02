import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';

import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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

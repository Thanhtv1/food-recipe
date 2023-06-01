import "@/styles/globals.css";
import React, { ReactElement } from "react";
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ChakraProvider, Flex} from "@chakra-ui/react";
import Layout from "@/component/Layout";
import { SessionProvider } from "next-auth/react";
import { queryOptions } from "@/utils/constant";
import { AppPropsWithLayout } from "@/types/UI";
import ButtonScrollToTop from "@/component/ButtonScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = React.useState(() => new QueryClient(queryOptions));
  const getLayout =
    Component?.getLayout ?? ((page: ReactElement) => <Layout>{page}</Layout>);

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ChakraProvider>
            <Flex scrollBehavior="smooth">
              {getLayout(<Component {...pageProps} />)}
              <ToastContainer
                position="top-right"
                autoClose={2000}
                closeOnClick
                draggable
                theme="light"
              />
            </Flex>
            <ButtonScrollToTop />
          </ChakraProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

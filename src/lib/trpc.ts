import { createTRPCClient, createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/server/routers/_app';
import superjson from 'superjson';
import { RootStore } from '@dappworks/kit';
import { UserStore } from '@/store/user';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.NODE_ENV === 'development') {
    return `https://127.0.0.1:${process.env.PORT ?? 3000}`;
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
};

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      async headers() {
        const initDataRaw = RootStore.Get(UserStore).initDataRaw;
        return {
          Authorization: initDataRaw ? `tma ${initDataRaw}` : undefined,
        };
      },
      transformer: superjson
    }),
  ],
});


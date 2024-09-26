import '../styles/globals.css';
import '../styles/nprogress.css';
import '@rainbow-me/rainbowkit/styles.css';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { NextUIProvider } from '@nextui-org/react';
import { RootStore } from '@dappworks/kit';
import Team from '@/store/team';
import { initStore } from '@/store';
import { DeviceDetectStore } from '@/store/deviceDetect';
import { useEffect } from 'react';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import { SDKProvider } from '@telegram-apps/sdk-react';
import { Root } from '@/components/Root';

const MyApp = ({ Component, pageProps }) => {
  initStore();
  RootStore.Get(Team).useTeams();
  RootStore.Get(DeviceDetectStore).use();
  useProgressBar();

  return (
    <Root>
      <SessionProvider session={pageProps.session}>
        <NextUIProvider>
          <ThemeProvider attribute="class" enableSystem={false}>
            <Component {...pageProps} />
          </ThemeProvider>
        </NextUIProvider>
      </SessionProvider>
    </Root>
  );
};

export default MyApp;

const useProgressBar = () => {
  let timer: NodeJS.Timeout | null = null;
  const stopDelayMs = 200;

  const routeChangeStart = () => {
    NProgress.start();
  };

  const routeChangeEnd = () => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      NProgress.done(true);
    }, stopDelayMs);
  };

  useEffect(() => {
    Router.events.on('routeChangeStart', routeChangeStart);
    Router.events.on('routeChangeComplete', routeChangeEnd);
    Router.events.on('routeChangeError', routeChangeEnd);

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      Router.events.off('routeChangeComplete', routeChangeEnd);
      Router.events.off('routeChangeError', routeChangeEnd);
    };
  }, []);
};

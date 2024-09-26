import '../styles/globals.css';
import '../styles/nprogress.css';
import '@rainbow-me/rainbowkit/styles.css';
import React, { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { NextUIProvider } from '@nextui-org/react';
import { SDKProvider, useLaunchParams, useMiniApp, useThemeParams, useViewport, bindMiniAppCSSVars, bindThemeParamsCSSVars, bindViewportCSSVars } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';
import { useTelegramMock } from '@/hooks/useTelegramMock';
import { useDidMount } from '@/hooks/useDidMount';

const InitProvider = ({ children }) => {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  return (
    <AppRoot appearance={miniApp.isDark ? 'dark' : 'light'} platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}>
      {children}
    </AppRoot>
  );
};

const MyApp = ({ Component, pageProps }) => {
  const didMount = useDidMount();
  if (process.env.NODE_ENV === 'development') {
    useTelegramMock();
  }
  return didMount ? (
    <SessionProvider session={pageProps.session}>
      <NextUIProvider>
        <ThemeProvider attribute="class" enableSystem={false}>
          <SDKProvider acceptCustomStyles debug={true}>
            <InitProvider>
              <ErrorBoundary fallback={ErrorPage}>
                <Component {...pageProps} />
              </ErrorBoundary>
            </InitProvider>
          </SDKProvider>
        </ThemeProvider>
      </NextUIProvider>
    </SessionProvider>
  ) : (
    <div className="root__loading">Loading</div>
  );
};

export default MyApp;

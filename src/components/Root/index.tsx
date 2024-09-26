'use client';

import { type PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { SDKProvider, useLaunchParams, useMiniApp, useThemeParams, useViewport, bindMiniAppCSSVars, bindThemeParamsCSSVars, bindViewportCSSVars } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';
import { useTelegramMock } from '@/hooks/useTelegramMock';
import { useDidMount } from '@/hooks/useDidMount';

function App(props: PropsWithChildren) {
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
      {props.children}
    </AppRoot>
  );
}

function RootInner({ children }: PropsWithChildren) {
  if (process.env.NODE_ENV === 'development') {
    useTelegramMock();
  }

  const debug = useLaunchParams().startParam === 'debug';

  useEffect(() => {
    if (debug) {
      import('eruda').then((lib) => lib.default.init());
    }
  }, [debug]);

  return (
    <SDKProvider acceptCustomStyles debug={debug}>
      <App>{children}</App>
    </SDKProvider>
  );
}

export function Root(props: PropsWithChildren) {
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className="root__loading">Loading</div>
  );
}

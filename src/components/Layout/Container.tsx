import { NextSeo } from 'next-seo';
import { observer } from 'mobx-react-lite';
import { cn, getCanonicalUrl } from '@/lib/utils';
import { useRouter } from 'next/router';
import Nav from './Nav';
import dynamic from 'next/dynamic';
import Footer from './Footer';
import Head from 'next/head';
import { helper } from '@/lib/helper';

const MyAppProvider = dynamic(() => import('./MyAppProvider').then((ctx) => ctx.MyAppProvider), {
  ssr: false,
});

const WalletProvider = dynamic(() => import('../WalletProvider').then((ctx) => ctx.WalletProvider), {
  ssr: false,
});

type ContainerProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  twitterImage?: string;
  className?: string;
  showFooter?: boolean;
  footerClassName?: string;
  isDeveloperNav?: boolean;
};

function Container(props: ContainerProps) {
  const { className, footerClassName, showFooter = true, children, isDeveloperNav = false, ...customMeta } = props;

  return (
    <>
      <WalletProvider>
        <main id="skip" className={cn('min-h-[calc(100vh-70px)] py-6 px-4 box-border', className)}>
          {children}
        </main>
        <Footer />
        <MyAppProvider />
      </WalletProvider>
    </>
  );
}

export default observer(Container);

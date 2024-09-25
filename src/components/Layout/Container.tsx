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
  // const router = useRouter();
  // const path = router.asPath;
  // const locale = router.locale;
  // const meta = Object.assign(
  //   {
  //     title: '',
  //     description: '',
  //     keywords: '',
  //   },
  //   customMeta,
  // );
  // const url = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
  // const canonical = getCanonicalUrl(url);

  return (
    <>
      {/* {meta.keywords && (
        <Head>
          <meta name="keywords" content={meta.keywords} />
        </Head>
      )} */}
      {/* <NextSeo
        title={meta.title}
        description={meta.description}
        canonical={canonical}
        openGraph={{
          url,
          type: 'website',
          title: meta.title,
          description: meta.description,
          images: [
            {
              url: meta.twitterImage || `${process.env.NEXT_PUBLIC_BASE_URL}/images/twitter-share-new.png`,
              width: 800,
              height: 600,
              alt: 'Og Image Alt',
            },
          ],
        }}
        twitter={{
          handle: '@iotex_com',
          site: '@iotex_com',
          cardType: 'summary_large_image',
        }}
      /> */}
      <WalletProvider>
        <Nav />
        <main id="skip" className={cn('min-h-[calc(100vh-70px)] py-6 px-4 box-border', className)}>
          {children}
        </main>
        {showFooter && <Footer className={footerClassName} />}
        <MyAppProvider />
      </WalletProvider>
    </>
  );
}

export default observer(Container);

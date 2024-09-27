import { observer } from 'mobx-react-lite';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import Footer from './Footer';
import { RootStore } from '@dappworks/kit';
import { UserStore } from '@/store/user';

const MyAppProvider = dynamic(() => import('./MyAppProvider').then((ctx) => ctx.MyAppProvider), {
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
  RootStore.Get(UserStore).use();
  return (
    <div>
      <main id="skip" className={cn('h-full py-6 px-4 box-border', className)}>
        {children}
      </main>
      <MyAppProvider />
      <Footer />
    </div>
  );
}

export default observer(Container);

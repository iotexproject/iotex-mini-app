import { observer } from 'mobx-react-lite';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import Footer from './Footer';

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

  return (
    <div>
      <main id="skip" className={cn('h-full py-6 px-4 box-border', className)}>
        {children}
      </main>
      <Footer />
      <MyAppProvider />
    </div>
  );
}

export default observer(Container);

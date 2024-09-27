import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';

const Footer = ({ className }: { className?: string }) => {
  const router = useRouter()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black shadow border-t-1 border-[#000] flex justify-around px-4 py-2">
      <a href="/" className={`text-center flex flex-col items-center ${router.pathname === '/' ? 'text-secondary' : 'text-white'}`}>
        <Icon icon="mdi:home-outline" className='w-5 h-5' />
        <div>Home</div>
      </a>
      <a href="/tasks" className={`text-center flex flex-col items-center ${router.pathname === '/tasks' ? 'text-secondary' : 'text-white'}`}>
        <Icon icon="material-symbols:share-outline" className='w-5 h-5' />
        <div>Share</div>
      </a>
    </div>
  );
};

export default Footer;

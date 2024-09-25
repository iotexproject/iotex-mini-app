import { cn } from '@/lib/utils';

const Footer = ({ className }: { className?: string }) => {
  return <footer className={cn('w-full flex flex-col items-center bg-transparent py-4 px-2 text-[12px] md:text-base', className)}></footer>;
};

export default Footer;

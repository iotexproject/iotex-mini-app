import { useRouter } from 'next/router';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface INavItem {
  icon?: JSX.Element;
  href: string;
  text: string;
  className?: string;
}

const NavItem = (props: INavItem) => {
  const router = useRouter();
  const isActive = router.asPath === props.href;

  return (
    <Link
      href={props.href}
      title={props.text}
      className={cn(
        isActive ? 'text-black dark:text-gray-200' : 'text-gray-500 dark:text-gray-400',
        'flex space-x-2 font-medium py-4 px-2 text-sm',
        'hover:text-black dark:hover:text-gray-200',
        props.className,
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {props.icon}
      <span>{props.text}</span>
    </Link>
  );
};

export default NavItem;

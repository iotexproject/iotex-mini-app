import { PaginationItemRenderProps, PaginationItemType, cn } from '@nextui-org/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const PaginationLinkItems = ({ paginationItemRenderProps, getHref }: { paginationItemRenderProps: PaginationItemRenderProps; getHref: (page: number) => string }) => {
  const { ref, key, value, isActive, activePage, total, onNext, onPrevious, className } = paginationItemRenderProps;

  if (value === PaginationItemType.NEXT) {
    const disabled = activePage >= total;
    return (
      <li key={key} className={cn(className, 'bg-default-200/50 min-w-8 w-8 h-8', !disabled && 'hover:bg-[#E4E4E7] dark:hover:bg-[#3F3F45]')}>
        <button disabled={disabled} onClick={onNext}>
          <ChevronRight size={15} className={disabled ? 'text-[#979696]' : 'text-[#737272]'} />
        </button>
      </li>
    );
  }

  if (value === PaginationItemType.PREV) {
    const disabled = activePage <= 1;
    return (
      <li key={key} className={cn(className, 'bg-default-200/50 min-w-8 w-8 h-8', !disabled && 'hover:bg-[#E4E4E7] dark:hover:bg-[#3F3F45]')}>
        <button disabled={disabled} onClick={onPrevious}>
          <ChevronLeft size={15} className={disabled ? 'text-[#979696]' : 'text-[#737272]'} />
        </button>
      </li>
    );
  }

  if (value === PaginationItemType.DOTS) {
    return (
      <li key={key} className={cn(className)}>
        ...
      </li>
    );
  }

  const href = getHref(value);

  return (
    <li ref={ref} key={key}>
      <Link className={cn(className, isActive ? 'text-white from-indigo-500' : 'hover:bg-[#E4E4E7] dark:hover:bg-[#3F3F45]')} href={href} prefetch={false}>
        {value}
      </Link>
    </li>
  );
};

export default PaginationLinkItems;

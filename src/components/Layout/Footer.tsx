import { Icon } from '@iconify/react';

const Footer = ({ className }: { className?: string }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black shadow border-t-1 border-[#000] text-white flex justify-around px-4 py-2">
      <a href="/" className="text-center flex flex-col items-center">
        <Icon icon="mdi:home-outline" width="1.3rem" height="1.3rem" />
        <div>Home</div>
      </a>
      <a href="/" className="text-center flex flex-col items-center">
        <Icon icon="material-symbols:share-outline" width="1.3rem" height="1.3rem" />
        <div>Share</div>
      </a>
    </div>
  );
};

export default Footer;

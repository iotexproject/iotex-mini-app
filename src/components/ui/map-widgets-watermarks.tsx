import { helper } from '@/lib/helper';
import { Image } from '@nextui-org/react';

const MapWidgetsWatermarks = () => {
  if (helper.env.isIopayMobile) {
    return null;
  }
  return (
    <>
      <a href={process.env.NEXT_PUBLIC_BASE_URL} target="_blank" className="absolute bottom-1 left-1">
        <Image
          className="transform transition-transform duration-500 hover:scale-110"
          classNames={{
            img: 'w-[100px]',
          }}
          radius="none"
          src="/map-widgets-watermarks-logo.svg"
          alt="DePIN Scan Logo"
        />
      </a>
      <div className="absolute bottom-0 right-0 p-2 bg-white/5 z-10 text-[#c2c2c2] text-xs flex items-center space-x-4">
        <div>&copy; DePIN Scan</div>
        <div>|</div>
        <a className="hover:underline" href="https://iotex.io/blog/what-are-decentralized-physical-infrastructure-networks-depin" target="_blank">
          What's DePIN?
        </a>
      </div>
    </>
  );
};

export default MapWidgetsWatermarks;

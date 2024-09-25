import { Avatar } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { Icon } from '@iconify/react';
import Container from '@/components/Layout/Container';

const Home = observer(() => {

  return (
    <Container className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-lg flex items-center gap-2">
          <Avatar size="sm" src="https://image.mimo.exchange/0x778e131aa8260c1ff78007cade5e64820744f320/1.png?width=100"></Avatar>
          <span>Hi,Test</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <Icon icon="ph:wallet-bold" width="2rem" height="2rem" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg h-[230px] shadow-lg bg-gradient-to-b from-[#865eff] to-[#65ead2]">
        <div className="text-base text-white mb-2">Total Points</div>
        <div className="text-white font-bold text-[40px]">100,000</div>
      </div>
      <div className="flex items-center justify-center mt-8 w-32 h-32 mx-auto rounded-full shadow-md bg-gradient-to-l from-[#865eff] to-[#73F1D9] text-white font-bold cursor-pointer">CHECK IN</div>
    </Container>
  );
});

export default Home;

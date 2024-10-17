import { Avatar, Button, Skeleton } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { Icon } from '@iconify/react';
import Container from '@/components/Layout/Container';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { RootStore } from '@dappworks/kit';
import { TaskStore } from '@/store/task';
import { WalletStore } from '@/store/wallet';

const Home = observer(() => {
  const task = RootStore.Get(TaskStore);
  const wallet = RootStore.Get(WalletStore)
  wallet.use()
  const { initData, initDataRaw } = retrieveLaunchParams();
  console.log('init', initData, initDataRaw);

  return (
    <Container className="flex flex-col gap-6">
      {task.getTotalPoint.loading.value && task.getTasks.loading.value ? (
        <>
          <Skeleton className="w-full h-8 rounded-lg" />
          <Skeleton className="w-full h-[230px] rounded-lg" />
          <Skeleton className="mt-8 w-32 h-32 mx-auto rounded-full" />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="font-semibold text-lg flex items-center gap-2">
              <Avatar size="sm" src="/images/logo.svg"></Avatar>
              <span>Hi,{initData?.user?.firstName}</span>
            </div>
            <wallet.ConnectButton />
            <div className="flex items-center gap-2 cursor-pointer">{/* <Icon icon="ph:wallet-bold" className="w-8 h-8" /> */}</div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg h-[230px] shadow-lg bg-gradient-to-b from-[#865eff] to-[#65ead2]">
            <div className="text-base text-white mb-2">Total Points</div>
            <div className="text-white font-bold text-[40px]">{task.getTotalPoint.value ?? 0}</div>
          </div>
         
          <div className='flex items-center justify-center gap-2'>
            <Button onClick={async e => {
              const signature = await wallet.signMessage("I am Message")
              alert(signature)
            }}>SignMessage</Button>
            <Button onClick={async e => {
              //if you want writeContract use encodeFunctionData
              // encodeFunctionData({
              //   abi,
              //   functionName,
              //   args,
              // })

              //approce example
              const tx = await wallet.sendTransaction({
                value:'0x095ea7b3000000000000000000000000610cbda6f0037b4141a5b949f56479106becb1e9000000000000000000000000000000000000000000000000000000000000000a',
                to: '0xa00744882684c3e4747faefd68d283ea44099d03',
                value: 1e18.toString()
              })
              alert(tx)
            }}>SendTransation</Button>
          </div>
          <Button
            isDisabled={task.isCheckIn}
            className="flex items-center justify-center mt-8 w-32 h-32 mx-auto rounded-full shadow-md bg-gradient-to-l from-[#865eff] to-[#73F1D9] text-white font-bold cursor-pointer"
            onClick={() => {
              task.doTask.call(1);
            }}
          >
            {task.isCheckIn ? <Icon icon="mdi:success" className="text-white w-10 h-10" /> : 'CHECK IN'}
          </Button>

        </>
      )}
    </Container>
  );
});

export default Home;

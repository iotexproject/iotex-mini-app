import { Button } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { Icon } from '@iconify/react';
import Container from '@/components/Layout/Container';
import { RootStore } from '@dappworks/kit/.';
import { TaskStore } from '@/store/task';

const SharePage = observer(() => {

  const tasks = [
    {name: 'Join Telegram Group/Channel', desc: 'Join IoTeX', btnName: 'Join'},
    {name: 'Register Footprint Analytics', btnName: 'Join'},
    {name: 'Speak in the Group', desc: 'Speak 2 times in the Footprint Analytics group', btnName: 'Go'},
    {name: 'Join Discord', desc: 'Join Footprint Official', btnName: 'Go'},
    {name: 'Join Telegram Group/Channel', desc: 'Join Footprint Analytics', btnName: 'Join'},
    {name: 'Visit Footprint Website', desc: 'Join mimo', btnName: 'Join'},
    {name: 'Follow X Account', btnName: 'Auth'},
  ]

  return (
    <Container className="flex flex-col h-full pb-8 overflow-y-auto gap-4">
      {
        tasks.map((task, index) => (
          <div key={index} className='p-2 border border-solid border-gray-400 rounded-lg flex items-center gap-2'>
            <div className='p-1 rounded-full bg-gray-400'>
              <Icon icon="solar:refresh-outline" className='text-white w-5 h-5' />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <div className='text-sm'>{task.name}</div>
              <div className='text-primary text-xs'>{task.desc}</div>
            </div>
            <div>
              <Button size='sm' color='secondary'>{task.btnName}</Button>
            </div>
          </div>
        ))
    }
    </Container>
  );
});

export default SharePage;

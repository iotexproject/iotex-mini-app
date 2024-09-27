import { Button, Skeleton } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { Icon } from '@iconify/react';
import Container from '@/components/Layout/Container';
import { RootStore } from '@dappworks/kit';
import { TaskStore } from '@/store/task';

const SharePage = observer(() => {
  const task = RootStore.Get(TaskStore);

  return (
    <Container className="flex flex-col h-full pb-8 overflow-y-auto gap-4">
      <div className="font-semibold text-lg flex items-center">
        <span>Tasks</span>
      </div>
      {task.getTasks.loading.value ? (
        [1, 2, 3, 4, 5].map((item, index) => {
          return <Skeleton key={index} className="h-12 w-full rounded-lg" />;
        })
      ) : (
        <>
          {task.getTasks.value?.map((item, index) => (
            <div key={item.title} className="p-2 border border-solid border-gray-400 rounded-lg flex items-center gap-2">
              {item.isCompleted ? (
                <div className="p-1 rounded-full bg-secondary flex-none">
                  <Icon icon="mdi:success" className="text-white w-5 h-5" />
                </div>
              ) : (
                <div className="p-1 rounded-full bg-gray-400 flex-none">
                  <Icon icon="solar:refresh-outline" className="text-white w-5 h-5" />
                </div>
              )}
              <div className="flex-1 flex flex-col">
                <div className="text-sm">{item.title}</div>
                <div className="text-primary text-xs">{item.description}</div>
              </div>
              <div>
                <Button
                  size="sm"
                  isDisabled={item.isCompleted}
                  color="secondary"
                  onClick={() => {
                    task.doTask.call(item.id);
                  }}
                >
                  {item.isCompleted ? 'Done' : 'Go'} ({item.point})
                </Button>
              </div>
            </div>
          ))}
        </>
      )}
    </Container>
  );
});

export default SharePage;

import { PromiseState, RootStore, Store } from '@dappworks/kit';
import { api } from '@/lib/trpc';
import { useEffect } from 'react';
import { UserStore } from './user';
import { ToastPlugin } from '@dappworks/kit/plugins';

export class TaskStore implements Store {
  sid = 'tasks';
  autoObservable = false;
  isCheckIn: boolean = false

  get toast() {
    return RootStore.Get(ToastPlugin);
  }

  get user() {
    return RootStore.Get(TaskStore);
  }

  getTasks = new PromiseState({
    function: async () => {
      try {
        const data = await api.task.tasks.query();
        this.isCheckIn = data.find(item => item.id === 1)?.isCompleted || false
        return data.filter(item => item.id !== 1)
      } catch (error) {
        console.error('GetTasks failed:', error);
      }
    }
  })

  getTotalPoint = new PromiseState({
    function: async () => {
      try {
        const data = await api.task.totalPoint.query();
        return data
      } catch (error) {
        console.error('GetTotalPoint failed:', error);
      }
    }
  })

  doTask = new PromiseState({
    function: async (id: number) => {
      try {
        const data = await api.task.check.mutate({
          id
        });
        if(data) {
          this.toast.success('Success !')
          this.publicData()
        }
      } catch (error) {
        console.error('DoTask failed:', error);
      }
    }
  })

  publicData() {
    this.getTasks.getOrCall()
    this.getTotalPoint.getOrCall()
  }

  setData(args: Partial<TaskStore>) {
    Object.assign(this, args);
  }
}

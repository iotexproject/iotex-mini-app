import { PromiseState, RootStore, Store } from '@dappworks/kit';
import { api } from '@/lib/trpc';
import { useEffect } from 'react';
import { UserStore } from './user';

export class TaskStore implements Store {
  sid = 'tasks';
  autoObservable = false;

  get user() {
    return RootStore.Get(TaskStore);
  }

  getTasks = new PromiseState({
    function: async () => {
      try {
        const data = await api.task.tasks.query();
        return data
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
          this.getTasks.call()
          this.getTotalPoint.call()
        }
      } catch (error) {
        console.error('DoTask failed:', error);
      }
    }
  })

  setData(args: Partial<TaskStore>) {
    Object.assign(this, args);
  }
}

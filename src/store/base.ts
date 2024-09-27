import { PromiseState, RootStore, Store } from '@dappworks/kit';


export class BaseStore implements Store {
  sid = 'base';
  autoObservable = false;
  activeTab: string = 'home'
  tabs = [
    {name: 'Home', key: 'home'},
    {name: 'Tasks', key: 'tasks'}
  ]

  setData(args: Partial<BaseStore>) {
    Object.assign(this, args);
  }
}

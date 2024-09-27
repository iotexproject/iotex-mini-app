import { PromiseState, RootStore, Store } from '@dappworks/kit';
import { api } from '@/lib/trpc';
import { InitDataParsed, retrieveLaunchParams, User } from '@telegram-apps/sdk-react';
import { useEffect } from 'react';
import { TaskStore } from './task';


export class UserStore implements Store {
  sid = 'user';
  autoObservable = false;
  id: string = '';
  token: string = '';
  initDataRaw: string = '';
  userInfo: User | null;
 
  get isLogin() {
    return !!this.token;
  }

  async login() {
    try {
      const { token } = await api.auth.signin.mutate({ initData: this.initDataRaw });
      this.token = token;
      console.log('token', this.initDataRaw, this.userInfo, token)
      RootStore.Get(TaskStore).getTasks.call()
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  initData({initDataRaw, initData} : {initDataRaw: string; initData: InitDataParsed}) {
    this.setData({ userInfo: initData.user, initDataRaw });
    const token = localStorage.getItem('')
  }

  setData(args: Partial<UserStore>) {
    Object.assign(this, args);
  }

  use( ) {
    const { initDataRaw, initData } = retrieveLaunchParams();

    useEffect(() => {
      if (initDataRaw && initData) {
        this.initData({ initDataRaw, initData });
        this.login();
      }
    }, [initDataRaw, initData]);
  }
}
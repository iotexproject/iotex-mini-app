import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { RootStore, Store } from '@dappworks/kit';
import { api } from '@/lib/trpc';
import { InitDataParsed, retrieveLaunchParams, User } from '@telegram-apps/sdk-react';


export class UserStore implements Store {
  sid = 'user';
  autoObservable = true;
  id: string = '';
  token: string = '';
  initDataRaw: string = '';
  userInfo: User | null;
  

  get event() {
    return RootStore.init().events;
  }

  wait() {
    return new Promise<UserStore>((res, rej) => {
      if (this.id && this.token) {
        res(this);
      }

      //@ts-ignore
      this.event.once('user:ready', (user) => {
        res(this);
      });
    });
  }

  static wait() {
    return RootStore.Get(UserStore).wait();
  }

  get isLogin() {
    return !!this.token;
  }

  async login() {
    try {
      const { token } = await api.auth.signin.mutate({ initData: this.initDataRaw });
      this.token = token;
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  initData({initDataRaw, initData} : {initDataRaw: string; initData: InitDataParsed}) {
    this.setData({ userInfo: initData.user || null, initDataRaw });
  }

  setData(args: Partial<UserStore>) {
    Object.assign(this, args);
  }

  ready(args: Partial<UserStore>) {
    this.setData(args);
    //@ts-ignore
    this.event.emit('user:ready', this);
  }

  use() {
    const { initDataRaw, initData } = retrieveLaunchParams();

    console.log('initDataRaw', initDataRaw, initData);

    useEffect(() => {
      if(initDataRaw && initData) {
        this.initData({initDataRaw, initData});
        this.login()
      }
    }, [initDataRaw, initData]);
  }
}
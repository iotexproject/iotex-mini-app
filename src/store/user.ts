import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { RootStore, Store } from '@dappworks/kit';
// import { UserInfo, remult } from 'remult';

export class UserStore implements User, Store {
  sid = 'user';
  autoObservable = true;

  id: string = '';
  name?: string = '';
  email?: string = '';
  image?: string = '';
  token: string = '';

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

  setData(args: Partial<UserStore>) {
    Object.assign(this, args);
  }

  ready(args: Partial<UserStore>) {
    this.setData(args);
    //@ts-ignore
    this.event.emit('user:ready', this);
  }

  use() {
    const { data: session } = useSession();
    useEffect(() => {
      const userStore = RootStore.Get(UserStore);
      if (!userStore.isLogin && session) {
        //@ts-ignore
        userStore.ready(session.user);
        // remult.user = session.user as UserInfo
      }
    }, [session]);
  }
}

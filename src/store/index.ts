import { helper } from '@/lib/helper';
import { rootStore } from '@dappworks/kit';
import { ToastPlugin } from '@dappworks/kit/plugins';
import { enableStaticRendering } from 'mobx-react-lite';
import { useEffect } from 'react';

enableStaticRendering(typeof window === 'undefined');

export const initStore = () => {
  useEffect(() => {
    if (process.env.NODE_ENV == 'development') {
      Promise.all([import('@dappworks/kit/dev'), import('@dappworks/kit/inspector')]).then(([{ DevTool }, { DevInspectorPlugin }]) => {
        rootStore.addStores([new DevTool(), new DevInspectorPlugin()]);
      });
    }

    rootStore.addStores([new ToastPlugin()]);

    if (helper.env.isBrowser) {
      if (process.env.NODE_ENV == 'development') {
        rootStore.events.on('*', console.log);
      }
    }
  }, []);
};

import { Store } from '@dappworks/kit';
import { StoragePlugin } from '@dappworks/kit/experimental';

export class Project implements Store {
  sid = 'project';
  autoObservable?: boolean = false;
  // title = StoragePlugin.Get({ key: 'project.title', value: '@dappworks/kit', engine: StoragePlugin.engines.asyncStorage });
  // description = StoragePlugin.Get({ key: 'project.description', value: 'This is dapp kit template project', engine: StoragePlugin.engines.asyncStorage });
  // script = StoragePlugin.Get({ key: 'project.script', value: "console.log('from script')", engine: StoragePlugin.engines.asyncStorage });
  // body = StoragePlugin.Get({ key: 'project.body', value: '', engine: StoragePlugin.engines.asyncStorage });
  topNavList = [
    {
      title: 'Home',
      url: '/',
    },
    {
      title: 'Docs',
      url: 'https://docs.fastblocks.io/',
      target: '_blank',
    },
    {
      title: 'Support',
      url: 'mailto:Support@fastblocks.io',
      target: '_blank',
    },
  ];
}

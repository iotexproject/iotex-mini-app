import { useEffect } from 'react';
import { Store } from '@dappworks/kit';

export class DeviceDetectStore implements Store {
  sid = 'DeviceDetectStore';
  autoObservable = true;

  isMobile = false;

  onlyMapView = false;

  use() {
    useEffect(() => {
      const handleResize = () => {
        this.isMobile = window.innerWidth < 991;
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  }
}

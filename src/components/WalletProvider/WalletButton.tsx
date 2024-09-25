import { cn } from '@/lib/utils';
import { RootStore } from '@dappworks/kit';
import { WalletStore } from '@/store/wallet';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';
import { useEffect } from 'react';

export const WalletButton = ({ className, customDropdown }: { className?: string; customDropdown?: (displayName) => React.ReactNode }) => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        useEffect(() => {
          if (mounted) {
            const walletStore = RootStore.Get(WalletStore);
            walletStore.openConnectModal = openConnectModal;
          }
        }, [mounted]);
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');
        if (!connected) {
          return (
            <div className={cn('w-fit flex items-center space-x-2 rounded-md py-1.5 px-2 bg-primary text-xs text-white hover:opacity-80 cursor-pointer', className)} onClick={openConnectModal}>
              <Wallet size={16} />
              <span>Connect Wallet</span>
            </div>
          );
        }
        if (chain.unsupported) {
          return (
            <div onClick={openChainModal} className="rounded-md py-1.5 px-2 text-xs bg-red-500 text-white cursor-pointer">
              Wrong network
            </div>
          );
        }
        if (customDropdown) {
          return customDropdown(account.displayName);
        }
      }}
    </ConnectButton.Custom>
  );
};

import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RootStore } from '@dappworks/kit';
import { WalletStore } from '@/store/wallet';
import { LogOut, Settings } from 'lucide-react';
import { useDisconnect } from 'wagmi';

const GeneralWalletUserDropdown = ({ displayName }: { displayName: string }) => {
  const walletStore = RootStore.Get(WalletStore);
  const { disconnect } = useDisconnect();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-md py-1.5 px-2 bg-primary text-xs text-[#fff] dark:text-[#000] hover:opacity-80">{displayName}</DropdownMenuTrigger>
      <DropdownMenuContent collisionPadding={10} sideOffset={5}>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
          <Settings size={18} />
          <span className="ml-2">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={(e) => {
            disconnect();
            walletStore.logout();
          }}
        >
          <LogOut size={18} />
          <span className="ml-2">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GeneralWalletUserDropdown;

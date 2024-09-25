import { useTheme } from 'next-themes';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { RootStore } from '@dappworks/kit';
import { WalletStore } from '@/store/wallet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ThemeMap = {
  light: lightTheme,
  dark: darkTheme,
};

const queryClient = new QueryClient();

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const currentTheme = ThemeMap[theme || 'light'] ?? ThemeMap.light;
  const { wagmiConfig } = RootStore.Get(WalletStore);
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en" theme={currentTheme()}>
          {children}
        </RainbowKitProvider>
        <WalletConnect />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const WalletConnect = () => {
  const walletStore = RootStore.Get(WalletStore);
  walletStore.useWalletConnect();
  return null;
};

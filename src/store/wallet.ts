import { BigNumberState, ObjectPool, PromiseHook, RootStore, StorageState, Store } from '@dappworks/kit';
import { useEffect } from 'react';
import { Chain, iotex } from 'wagmi/chains';
import { StoragePlugin } from '@dappworks/kit/experimental';
import { ToastPlugin } from '@dappworks/kit/plugins';
import { createPublicClient, http, WalletClient } from 'viem';
import { iotexTestnet } from '@/lib/chain';
import { ethers } from 'ethers';
import { _ } from '../lib/lodash';
import BigNumber from 'bignumber.js';
import { makeObservable } from 'mobx';
import { useAccount, useSwitchChain, useWalletClient } from 'wagmi';
import { signMessage } from '@wagmi/core';
import { SiweMessage } from 'siwe';
import axios from 'axios';
import { Wallet, WalletDetailsParams, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { helper } from '@/lib/helper';
import { binanceWallet, injectedWallet, metaMaskWallet, okxWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

const supportedChains: readonly [Chain, ...Chain[]] = [
  {
    ...iotex,
    // @ts-ignore
    iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_iotex.jpg',
  },
  {
    ...iotexTestnet,
    iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_iotex.jpg',
  },
];

const ioPayWallet = (): Wallet => ({
  id: 'ioPay',
  name: 'ioPay',
  iconUrl: '/iopay-wallet.svg',
  iconBackground: 'transparent',
  downloadUrls: {
    android: 'https://iopay.me/',
    ios: 'https://iopay.me/',
    chrome: 'https://iopay.me/',
    qrCode: 'https://iopay.me/',
  },
  mobile: {
    getUri: (uri: string) => uri,
  },
  createConnector: (walletDetails: WalletDetailsParams) => injectedWallet().createConnector(walletDetails),
});

export class WalletStore implements Store {
  sid = 'WalletStore';
  autoObservable = false;

  account: `0x${string}` | null = null;

  token = StoragePlugin.Get({
    key: 'wallet:token',
    value: '',
    engine: StoragePlugin.engines.localStorage,
  });

  tokenAddress = StoragePlugin.Get({
    key: 'wallet:tokenAddress',
    value: '',
    engine: StoragePlugin.engines.localStorage,
  });

  balance = PromiseHook.wrap({
    func: async () => {
      if (!this.signer) return new BigNumberState({ value: new BigNumber(0) });
      const balance = await this.signer?.getBalance();
      if (balance) {
        return new BigNumberState({ value: new BigNumber(balance?.toString() ?? '0') });
      }
    },
  });

  get event() {
    return RootStore.init().events;
  }

  wait() {
    return new Promise<WalletStore>((res, rej) => {
      if (this.account && this.token.value) {
        res(this);
      }

      //@ts-ignore
      this.event.once('walletAccount:ready', () => {
        res(this);
      });
    });
  }

  static wait() {
    return RootStore.Get(WalletStore).wait();
  }

  get isLogin() {
    return !!this.token.value;
  }

  setData(args: Partial<WalletStore>) {
    Object.assign(this, args);
  }

  constructor() {
    makeObservable(this, {
      account: true,
      token: true,
      // writeTicker: true,
      // updateTicker: true,
    });
  }

  defaultChainId = 4689;
  chainId: number | undefined;
  get chain() {
    if (!this.chainId) return null;
    return supportedChains.find((i) => i.id == this.chainId);
  }
  get supportChainId() {
    if (!supportedChains.map((i) => i.id).includes(this.chain?.id as any)) {
      return this.defaultChainId;
    }
    return this.chain?.id || this.defaultChainId;
  }
  getSupportChain(chainId: any) {
    if (!supportedChains.map((i) => i.id).includes(chainId)) {
      return supportedChains[0];
    }
    return supportedChains.find((i) => i.id == chainId) || supportedChains[0];
  }
  getSupportChainId() {
    if (!supportedChains.map((i) => i.id).includes(this.chain?.id as any)) {
      return this.defaultChainId;
    }
    return this.chainId || this.defaultChainId;
  }

  wagmiConfig = getDefaultConfig({
    appName: 'depinscan',
    projectId: 'b69e844f38265667350efd78e3e1a5fb',
    chains: supportedChains,
    wallets: [
      {
        groupName: 'Recommended',
        wallets: [metaMaskWallet, walletConnectWallet, okxWallet, binanceWallet],
      },
    ],
    ssr: false,
  });
  walletClient: WalletClient;
  signer: ethers.providers.JsonRpcSigner;
  switchChain: (({ chainId }: { chainId: number }) => void) | undefined;
  openConnectModal: () => void;

  writeTicker = 0;
  updateTicker = 0;

  useWalletConnect() {
    const { address, isConnected, chain } = useAccount();
    const { switchChain } = useSwitchChain();
    const { data: walletClient } = useWalletClient();
    // @ts-ignore
    this.walletClient = walletClient;

    useEffect(() => {
      if (!isConnected) {
        if (this.account) {
          this.account = null;
        }
        return;
      }

      if (address && chain) {
        this.setData({
          account: address,
          chainId: chain.id,
        });

        this.updateTicker++;

        this.debounceReady();
      }
    }, [isConnected, chain, address]);

    useEffect(() => {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        const provider = new ethers.providers.Web3Provider(window?.ethereum);
        this.setData({
          switchChain,
          signer: provider.getSigner(),
        });
      }
    }, []);
  }

  debounceReady = _.debounce(this.ready, 1000);

  async ready() {
    if (!this.account) {
      return;
    }
    const account = this.account.toLowerCase();
    const tokenAddress = this.tokenAddress.value?.toLowerCase();
    if (tokenAddress !== account) {
      this.clearToken();
      // await this.login(this.account);
    } else {
      // @ts-ignore
      this.event.emit('walletAccount:ready');
    }
  }

  async createSiweMessage(address: string, chainId: number) {
    const res = await axios.get(`/api/auth/siwe/nonce`);
    const nonce = res.data.nonce;
    const message = new SiweMessage({
      address,
      nonce,
      chainId,
      statement: `Log in to DePIN Scan.`,
      domain: window.location.host,
      uri: window.location.origin,
      version: '1',
    });
    return message.prepareMessage();
  }

  async login(account: `0x${string}`) {
    await new Promise<void>((res) => {
      setTimeout(() => {
        res();
      }, 1000);
    });
    try {
      const message = await this.createSiweMessage(account, this.supportChainId);
      const signature = await signMessage(this.wagmiConfig, {
        account,
        message,
      });
      const tokenRes = await axios.post(`/api/auth/siwe/jwt`, {
        account,
        message,
        signature,
      });
      const token = tokenRes.data.token;
      if (token) {
        this.setData({
          account,
        });
        this.token.set?.(token);
        this.tokenAddress.set?.(account);

        // @ts-ignore
        this.event.emit('walletAccount:ready');
      }
    } catch (error) {
      console.log(error);
      // RootStore.Get(ToastPlugin).error(error.message);
    }
  }

  logout() {
    if (this.account) {
      this.account = null;
    }
    this.clearToken();
  }

  clearToken() {
    this.token.set?.('');
    this.tokenAddress.set?.('');
  }

  async prepare(chainId?: number): Promise<WalletStore> {
    const promise = new Promise<void>(async (res, rej) => {
      if (!window) return;
      if (this.account) {
        if (Number(this.chain?.id) == Number(chainId)) {
          res();
          return;
        }
        if (chainId) {
          this.switchChain?.({ chainId });
        }

        const interval = setInterval(() => {
          if (this.switchChain) {
            if (this.chain?.id == chainId) {
              clearInterval(interval);
              res();
            }
          }
        }, 1000);
      } else {
        try {
          this.openConnectModal();
          const interval = setInterval(async () => {
            console.log('wait connect', this.account);
            if (this.account) {
              clearInterval(interval);
              res();
            }
          }, 1000);
        } catch (error) {
          rej(error);
        }
      }
    });

    await promise;
    return this;
  }

  getPublicClient(chainId: number) {
    const res = ObjectPool.get(`publicClient-${chainId}`, () => {
      let chain: Chain = iotex;
      if (supportedChains.map((i) => i.id).includes(chainId as any)) {
        chain = supportedChains.find((i) => i.id == chainId) as Chain;
      }
      return createPublicClient({
        chain,
        transport: http(),
        batch: {
          multicall: {
            wait: 300,
          },
        },
      });
    });
    return res;
  }

  history = new StorageState<WalletTransactionHistoryType[] | null>({ value: [], key: 'history' });

  async sendTx({ chainId, tx, autoAlert = true, loadingText, successText }: { chainId: number | string; tx: any; autoAlert?: boolean; loadingText?: string; successText?: string }) {
    const toast = RootStore.Get(ToastPlugin);
    try {
      if (loadingText) toast.loading(loadingText);
      if (!chainId) throw new Error('chainId, address, data is required');
      await this.prepare(Number(chainId));
      const hash = await tx();
      const publicClient = this.getPublicClient(Number(chainId));
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      toast.dismiss();
      if (receipt.status == 'success') {
        toast.success('The transaction was successful');
      } else {
        toast.error('The transaction failed');
        return {
          errMsg: 'The transaction failed',
        };
      }
      if (successText) toast.success(successText);
      this.writeTicker++;
      this.updateTicker++;
      return {
        receipt,
        errMsg: '',
      };
    } catch (error) {
      toast.dismiss();
      if (autoAlert) {
        const errMsg = error?.message;
        if (errMsg?.includes('User rejected transaction') || errMsg?.toLowerCase().includes('user rejected')) {
          toast.error('User rejected transaction');
          return {
            errMsg: 'User rejected transaction',
          };
        }
        const msg = /reason="[A-Za-z0-9_ :"]*/g.exec(errMsg);
        if (msg) {
          toast.error(msg as unknown as string);
          return {
            errMsg: msg,
          };
        } else {
          toast.error(errMsg);
          return {
            errMsg: errMsg,
          };
        }
      } else {
        throw error;
      }
    }
  }

  async sendRawTx({
    chainId,
    address,
    data,
    value = 0,
    autoAlert = true,
    onSended,
    onSuccess,
    onError,
    historyItem,
    loadingText,
  }: {
    loadingText?: string;
    chainId: number | string;
    address: string;
    data: string | null;
    value?: string | number;
    autoRefresh?: boolean;
    autoAlert?: boolean;
    historyItem?: Pick<WalletTransactionHistoryType, 'msg' | 'type'>;
    showTransactionSubmitDialog?: boolean;
    onSended?: ({ res }: { res: ethers.providers.TransactionResponse }) => void;
    onSuccess?: ({ res }: { res: any }) => void;
    onError?: ({ res }: { res: any }) => void;
  }): Promise<any | undefined> {
    chainId = Number(chainId);
    const toast = RootStore.Get(ToastPlugin);
    try {
      if (!chainId || !address) throw new Error('chainId, address, is required');
      const wallet = await RootStore.Get(WalletStore).prepare(chainId);
      if (loadingText) toast.loading(loadingText);
      let sendTransactionParam: any = _.omitBy(
        {
          to: address,
          data,
          value: value ? ethers.BigNumber.from(value) : null,
          gasPrice: null,
        },
        _.isNil,
      );
      const res = await wallet.signer.sendTransaction(sendTransactionParam);
      onSended ? onSended({ res }) : null;
      const receipt = await res.wait();
      if (receipt.status == 1) {
        onSuccess && onSuccess({ res: receipt });
        toast.dismiss();
        toast.success('The transaction was successful');
      } else {
        onError && onError({ res: receipt });
        toast.dismiss();
        toast.error('The transaction failed');
      }
      return receipt;
    } catch (error) {
      toast.dismiss();
      const errMsg = error?.message;
      if (errMsg?.includes('User rejected transaction') || errMsg?.toLowerCase().includes('User rejected') || errMsg?.toLowerCase().includes('user denied')) {
        autoAlert && toast.error('User rejected transaction');
        return;
      }
      const msg = /reason="[A-Za-z0-9_ :"]*/g.exec(errMsg);
      if (msg) {
        autoAlert && toast.error(msg as unknown as string);
      } else {
        autoAlert && toast.error(errMsg);
      }
      if (!autoAlert) {
        throw error;
      }
    }
  }

  static async SendTx(...args: Parameters<WalletStore['sendTx']>) {
    return RootStore.Get(WalletStore).sendTx(...args);
  }

  static async SendRawTx(...args: Parameters<WalletStore['sendRawTx']>) {
    return RootStore.Get(WalletStore).sendRawTx(...args);
  }
}

export type WalletTransactionHistoryType = { chainId: number; tx?: string; msg: string; timestamp: number; type: 'Approve' | 'Swap' | 'Liquidity'; status: 'loading' | 'success' | 'fail' };

export type NetworkObject = {
  name: string;
  chainId: number;
  rpcUrl: string;
  logoUrl: string;
  explorerUrl: string;
  explorerName: string;
  nativeCoin: string;
  type: 'mainnet' | 'testnet';
};

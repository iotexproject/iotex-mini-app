
import { helper } from '@dappworks/kit/utils';
import { Store } from "@dappworks/kit";
import { Button } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { encodeFunctionData, SignableMessage } from "viem";
import { Config, useAccount, useConnect, useDisconnect, useSendTransaction, useSignMessage,  useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { SendTransactionMutateAsync, SignMessageMutateAsync,  WriteContractMutateAsync } from "wagmi/query";

export class WalletStore implements Store {
  sid = 'WalletStore';
  autoObservable = true

  connect: any;
  account: string = '';
  connectors: any;
  disconnect: any;
  isConnected: boolean = false;
  onConnectWallet() {
    this.connect?.({ connector: this.connectors[0]! })
  }
  ConnectButton = observer(() => {
    return <>
      {!this.isConnected ? (
        <Button className="button is-glowing w-full mt-4 modal_open" onClick={() => this.onConnectWallet()}>
          Connect Wallet
        </Button>
      ) : (
        <>
          <div className="text-sm mb-[-4px]">{helper.string.truncate(this.account, 16, '...')}</div>
          <Button size='sm' onClick={() => this.disconnect?.()}>Disconnect</Button>
        </>
      )}
    </>
  })
  sendTransactionAsync: SendTransactionMutateAsync<Config, unknown> | null = null;
  writeContractAsync: WriteContractMutateAsync<Config, unknown> | null = null;
  signMessageAsync: SignMessageMutateAsync<unknown> | null = null;
  waitForTransactionReceiptData: any | null = null;
  async sendTransaction({ data, value, to }: { data?: `0x${string}`, value?: string, to: `0x${string}` }) {
    return new Promise(async (res, rej) => {
      const hash = await this.sendTransactionAsync!({
        to,
        data: data ?? undefined,
        value: value ? BigInt(value) : undefined
      }, {
        onError: (err) => {
          rej(err)
        }
      });
      const interval = setInterval(() => {
        if (this.waitForTransactionReceiptData?.isSuccess) {
          clearInterval(interval)
          res(hash)
        }
      }, 1000)
      alert('The transaction has been sent, please manually switch to the wallet')
    })
  }

  async signMessage(message: SignableMessage) {
    const signature = await this.signMessageAsync?.({ message })
    return signature
  }

  setData(args: Partial<WalletStore>) {
    Object.assign(this, args);
  }

  use() {
    const { writeContractAsync } = useWriteContract();
    const { signMessageAsync } = useSignMessage()
    const { address, isConnected } = useAccount();
    const { connectors, connect, status, error } = useConnect();
    const { disconnect } = useDisconnect();

    const { data: hash, sendTransactionAsync } = useSendTransaction();
    const waitForTransactionReceiptData =
      useWaitForTransactionReceipt({
        hash,
      })

    this.setData(
      {
        disconnect,
        connectors,
        connect,
        isConnected,
        account: address,
        sendTransactionAsync,
        writeContractAsync,
        waitForTransactionReceiptData,
        signMessageAsync
      }
    )
  }
}
import { http, createConfig, useSendTransaction as useSendTransactionWagmi, useSignMessage as useSignMessageWagmi, ResolvedRegister, Config } from "wagmi";
import { iotex, iotexTestnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { helper } from "./helper";

if (typeof window != "undefined") {
  window.open = (function (open) {
    return function (url, _, features) {
      return open.call(window, url, "_blank", features);
    };
  })(window.open);
}

export const config = createConfig({
  chains: [iotexTestnet],
  connectors: [
    // injected(),
    // coinbaseWallet(),
    walletConnect({
      projectId: "b69e844f38265667350efd78e3e1a5fb",
      qrModalOptions: {
        explorerRecommendedWalletIds: [
          "1a5f2435e8e31c4034f1d142e85d9f7d3be2a09ddf710e5ef1ad4e36c719d3c0",
        ],
      },
    }),
  ],
  transports: {
    [iotexTestnet.id]: http(),
  },
});

// walletConnect.on("message", ({ type, data }) => {
//   if (type === "display_uri") {
//     const walletUri = `https://metamask.app.link/wc?uri=${data}`;
//     window.open(walletUri, "_blank");
//   }
// });

export const useSendTransaction = <
config extends Config = ResolvedRegister['config'],
context = unknown,
>() => {
  const {sendTransactionAsync, sendTransaction,...rest} = useSendTransactionWagmi<config, context>()
  return {
    ...rest,
    sendTransactionAsync: async (...data: Parameters<typeof sendTransactionAsync>) => {
      window.open("iopay://")
      return sendTransactionAsync(...data)
    },
    sendTransaction: async (...data: Parameters<typeof sendTransaction>) => {
      window.open("iopay://")
      return sendTransaction(...data)
    }
  }
}

export const useSignMessage = <context = unknown>() => {
  const {signMessageAsync, signMessage,...rest} = useSignMessageWagmi<context>()
  return {
    ...rest,
    signMessageAsync: async (...data: Parameters<typeof signMessageAsync>) => {
      window.open("iopay://")
      return signMessageAsync(...data)
    },
    signMessage: async (...data: Parameters<typeof signMessage>) => {
      window.open("iopay://")
      return signMessage(...data)
    }
  }
}
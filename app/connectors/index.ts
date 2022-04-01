import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

const chainIdToNetwork: { [network: number]: string } = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby",
  5: "goerli",
  42: "kovan",
  100: "xdai",
  30: "orchid",
  31: "orchidTestnet",
  99: "core",
  77: "sokol",
  61: "classic",
  8: "ubiq",
  108: "thundercore",
  18: "thundercoreTestnet",
  163: "lightstreams",
  122: "fuse",
  137: "matic",
  80001: "maticMumbai",
  1313161554: "auroraTestnet",
  1313161555: "auroraMainnet",
  1313161556: "auroraLocalnet",
};

export { chainIdToNetwork };

export const connectorList = {
  MetaMask: injected,
};

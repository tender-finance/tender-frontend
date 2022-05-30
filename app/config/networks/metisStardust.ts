export default {
  ChainId: 588,
  blockExplorerName: "Metis Stardust Explorer",
  blockExplorerUrl: "https://stardust-explorer.metis.io/tx",
  Contracts: {
    Comptroller: "0x0...",
    PriceOracle: "0x0...",
  },
  Tokens: {
    DAI: {
      name: "Dai",
      symbol: "DAI",
      decimals: 18,
      address: "0x0...",
      icon: "/images/coin-icons/dai.svg",
      cToken: {
        name: "Compound Dai 📈",
        symbol: "cDAI",
        decimals: 8,
        address: "0x0...",
      },
    },
  },
};

export default {
  ChainId: 588,
  blockExplorerName: "Metis Stardust Explorer",
  blockExplorerUrl: "https://stardust-explorer.metis.io/tx",
  Contracts: {
    Comptroller: "0xB937ced1C603dd369319f3e6db216bB215FDE950",
    PriceOracle: "0xdE9758a753d9670B6BAD534C996EC02101B3787B",
  },
  Tokens: {
    TMETIS: {
      name: "tMetis",
      symbol: "tMETIS",
      decimals: 18,
      address: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
      icon: "/images/coin-icons/dai.svg",
      cToken: {
        name: "tMetis 📈",
        symbol: "tMetis",
        decimals: 8,
        address: "0x406306CaCC160C1ca1101310c6D823D1E6F4C08c",
      },
    },
    BMETIS: {
      name: "bMetis",
      symbol: "bMETIS",
      decimals: 18,
      address: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
      icon: "/images/coin-icons/bat.svg",
      cToken: {
        name: "bMetis 📈",
        symbol: "bMetis",
        decimals: 8,
        address: "0x9207bD664553FdDc730f791D589A50e2EA36b5a6",
      },
    },
    KMETIS: {
      name: "kMetis",
      symbol: "kMETIS",
      decimals: 18,
      address: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
      icon: "/images/coin-icons/usdc.svg",
      cToken: {
        name: "kMetis 📈",
        symbol: "kMetis",
        decimals: 8,
        address: "0xa40f433D1A2e7F394DDf470C03353e56d278E361",
      },
    },
  },
};

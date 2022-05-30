export default {
  ChainId: 4,
  blockExplorerName: "Etherscan (Rinkeby)",
  blockExplorerUrl: "https://rinkeby.etherscan.io/tx",
  Contracts: {
    Comptroller: "0x2EAa9D77AE4D8f9cdD9FAAcd44016E746485bddb",
    PriceOracle: "0xE465d3F3832EF48DF3e663Cf986dfA03c50DE790",
  },
  Tokens: {
    DAI: {
      name: "Dai",
      symbol: "DAI",
      decimals: 18,
      address: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
      icon: "/images/coin-icons/dai.svg",
      cToken: {
        name: "Compound Dai 📈",
        symbol: "cDAI",
        decimals: 8,
        address: "0x6D7F0754FFeb405d23C51CE938289d4835bE3b14",
      },
    },
    BAT: {
      name: "Basic Attention Token",
      symbol: "BAT",
      decimals: 18,
      address: "0xbF7A7169562078c96f0eC1A8aFD6aE50f12e5A99",
      icon: "/images/coin-icons/bat.svg",
      cToken: {
        name: "Compound Basic Attention Token 📈",
        symbol: "cBAT",
        decimals: 8,
        address: "0xEBf1A11532b93a529b5bC942B4bAA98647913002",
      },
    },
    USDC: {
      description: "Standard",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b",
      icon: "/images/coin-icons/usdc.svg",
      cToken: {
        name: "Compound USD Coin 📈",
        symbol: "cUSDC",
        decimals: 8,
        address: "0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1",
      },
    },
    WBTC: {
      name: "Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      address: "0x577D296678535e4903D59A4C929B718e1D575e0A",
      icon: "/images/coin-icons/bitcoin.svg",
      cToken: {
        name: "Compound Wrapped BTC 📈",
        symbol: "cWBTC",
        decimals: 8,
        address: "0x0014F450B8Ae7708593F4A46F8fa6E5D50620F96",
      },
    },
  },
};

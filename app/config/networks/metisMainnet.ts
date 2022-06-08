export default {
  ChainId: 1088,
  blockExplorerName: "Metis Andromeda Explorer",
  blockExplorerUrl: "https://andromeda-explorer.metis.io/tx",
  Contracts: {
    Comptroller: "0x798752C2cd661b3eA4B7A5b45041fA95AcE3fc02",
    PriceOracle: "0x670f22666415A7aE45166151F9aa158BeC7C1549",
  },
  Tokens: {
    USDC: {
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      address: "0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
      icon: "/images/coin-icons/usdc.svg",
      cToken: {
        name: "tUSDC",
        symbol: "tUSDC",
        decimals: 8,
        address: "0x18320599eA58B19B3FE12d383F2969C61C1B43F4",
      },
    },
    ETH: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      address: "0x420000000000000000000000000000000000000a",
      icon: "/images/coin-icons/ethereum.svg",
      cToken: {
        name: "tETH",
        symbol: "tETH",
        decimals: 8,
        address: "0x08EE3541EEB3ba1d519EF4848D8B2A7d75BCE688",
      },
    },
    METIS: {
      name: "METIS",
      symbol: "METIS",
      decimals: 18,
      address: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
      icon: "/images/coin-icons/metis.png",
      cToken: {
        name: "tMETIS",
        symbol: "tMETIS",
        decimals: 8,
        address: "0xB01f3D0F5dD254280aC64C89aFB3363d05b91658",
      },
    },
    WBTC: {
      name: "wBTC",
      symbol: "wBTC",
      decimals: 8,
      address: "0xa5B55ab1dAF0F8e1EFc0eB1931a957fd89B918f4",
      icon: "/images/coin-icons/bitcoin.svg",
      cToken: {
        name: "tWBTC",
        symbol: "tWBTC",
        decimals: 8,
        address: "0xA1377dbB30BFdc548eE8c9d7Fa3693E512dD6288",
      },
    },
    DAI: {
      name: "DAI",
      symbol: "DAI",
      decimals: 18,
      address: "0x4651B38e7ec14BB3db731369BFE5B08F2466Bd0A",
      icon: "/images/coin-icons/dai.svg",
      cToken: {
        name: "tDAI",
        symbol: "tDAI",
        decimals: 8,
        address: "0x0fB0D26Ef8348c43d9eda482e180D54B0296DB22",
      },
    },
    USDT: {
      name: "USDT",
      symbol: "USDT",
      decimals: 6,
      address: "0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC",
      icon: "/images/coin-icons/usdt.svg",
      cToken: {
        name: "tUSDT",
        symbol: "tUSDT",
        decimals: 8,
        address: "0x0fB0D26Ef8348c43d9eda482e180D54B0296DB22",
      },
    },
  },
};

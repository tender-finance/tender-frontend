export default {
  ChainId: 588,
  blockExplorerName: "Metis Stardust Explorer",
  blockExplorerUrl: "https://stardust-explorer.metis.io/tx",
  Contracts: {
    Comptroller: "0xB937ced1C603dd369319f3e6db216bB215FDE950",
    PriceOracle: "0xdE9758a753d9670B6BAD534C996EC02101B3787B",
  },
  Tokens: {
    tMETIS: {
      name: "Metis",
      symbol: "METIS",
      decimals: 18,
      address: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
      icon: "/images/coin-icons/metis.png",
      cToken: {
        name: "tMetis 📈",
        symbol: "tMetis",
        decimals: 8,
        address: "0x406306CaCC160C1ca1101310c6D823D1E6F4C08c",
      },
    },
    tTESTDAI: {
      name: "TestDai",
      symbol: "TestDAI",
      decimals: 18,
      address: "0x5197487406336229a37D724710380278A1dca6b2",
      icon: "/images/coin-icons/dai.svg",
      cToken: {
        name: "tTestDAI 📈",
        symbol: "tTestDAI",
        decimals: 8,
        address: "0xF735E27a9C7d2eF1Ec77c94D45Daa02447b89D80",
      },
    },
    tTestETH: {
      name: "TestETH",
      symbol: "TestETH",
      decimals: 18,
      address: "0xaD26Cc863cb1aaba691469246B4B4D65D951188e",
      icon: "/images/coin-icons/ethereum.svg",
      cToken: {
        name: "tTestETH 📈",
        symbol: "tTestETH",
        decimals: 8,
        address: "0x1F039BD941B80D327Cb3d07A86b170e925247b3a",
      },
    },
    tTestBTC: {
      name: "TestBTC",
      symbol: "TestBTC",
      decimals: 18,
      address: "0xAE745689b84ed533580610504Fe4baf38BEfc2C8",
      icon: "/images/coin-icons/bitcoin.svg",
      cToken: {
        name: "tTestBTC 📈",
        symbol: "tTestBTC",
        decimals: 8,
        address: "0xBB2f3435D2A7632f1a983d57745B2328C2228DD6",
      },
    },
  },
};

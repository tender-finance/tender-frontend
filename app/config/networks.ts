import type { Networks } from "~/types/global";

import auroraLocalnet from "./networks/aurora-localnet";
import auroraMainnet from "./networks/aurora-mainnet";
import auroraTestnet from "./networks/aurora-testnet";
import metisMainnet from "./networks/metis-mainnet";
import metisTestnet from "./networks/metis-testnet";
import mainnet from "./networks/mainnet";
import rinkeby from "./networks/rinkeby";
import ropsten from "./networks/ropsten";

const networks: Networks = {
  auroraLocalnet,
  auroraMainnet,
  auroraTestnet,
  mainnet,
  rinkeby,
  ropsten,
  metisTestnet,
  metisMainnet,
};

export default networks;

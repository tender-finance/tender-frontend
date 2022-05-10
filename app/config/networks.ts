import { NetworkName, Networks } from "~/types/global";

import rinkeby from "./networks/rinkeby";
import metisStartdust from "./networks/metisStardust";
import metisMainnet from "./networks/metisMainnet";

const networks: Networks = {
  [NetworkName.rinkeby]: rinkeby,
  [NetworkName.metisStartdust]: metisStartdust,
  [NetworkName.metisMainnet]: metisMainnet,
};

export default networks;

import type { Networks } from "~/types/global";
import mainnet from "./networks/mainnet";
import rinkeby from "./networks/rinkeby";

const networks: Networks = { mainnet, rinkeby };

export default networks;

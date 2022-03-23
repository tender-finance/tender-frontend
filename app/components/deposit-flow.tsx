import { cToken, SwapRow, Token } from "~/types/global";
import { useEffect, useState } from "react";
import { Signer } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import SampleErc20Abi from "~/config/sampleErc20Abi";
import SampleCTokenAbi from "~/config/sampleCTokenAbi";
import { ethers } from "ethers";

interface Props {
  closeModal: Function;
  row: SwapRow;
}

async function enable(
  signer: Signer,
  token: Token,
  cToken: cToken
): Promise<void> {
  console.log("boop", signer, token, cToken);

  // const isCEth = token.address ? false : true;
  // if (isCEth) {
  //   throw "Don't need to approve ETH";
  // }

  // @ts-ignore
  let contract = new ethers.Contract(token.address, SampleErc20Abi, signer);
  let approvalVal = "1000000000000000000";
  let approvalTx = await contract.approve(cToken.address, approvalVal);
}

async function deposit(value: string, signer: Signer, cToken: cToken) {
  // if (isCEth) {
  //   console.log("supply() w/ cEth");

  //   const formattedValue = ethers.utils.parseEther(value);
  //   console.log("input value:", value, "formattedValue:", formattedValue.toString());

  //   let contract = new ethers.Contract(address, sampleAbi, web3React.library?.getSigner());
  //   let tx = await contract.mint({ value: ethers.utils.parseEther(value) });
  // }
  // else {
  console.log("supply() with cToken", cToken.name, cToken.address);

  const formattedValue = ethers.BigNumber.from(value);
  console.log(
    "input value:",
    value,
    "formattedValue:",
    formattedValue.toString()
  );

  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  let tx = await contract.mint(formattedValue);
  // }
}
async function redeem(value: string, signer: Signer, cToken: cToken) {
  // if (isCEth) {
  //   console.log("redeem() with cEth");

  //   const formattedValue = ethers.utils.parseEther(value);
  //   console.log("input value:", value, "formattedValue:", formattedValue);

  //   let contract = new ethers.Contract(
  //     address,
  //     sampleAbi,
  //     web3React.library?.getSigner()
  //   );
  //   let tx = await contract.redeemUnderlying(formattedValue);
  // } else {
  console.log("redeem() with cToken", name, "address:", cToken.address);

  const formattedValue = ethers.utils.parseEther(value);
  console.log("input value:", value, "formattedValue:", formattedValue);

  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  let tx = await contract.redeem(formattedValue);
  // }
}

export default function DepositFlow({ closeModal, row }: Props) {
  let [isSupplying, setIsSupplying] = useState<boolean>(true);
  let [isEnabled, setIsEnabled] = useState<boolean>(false);
  let [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  let [value, setValue] = useState<string>("");

  const { library } = useWeb3React<Web3Provider>();

  useEffect(() => {
    if (!library) {
      // DO we need to reset signer if null here?
      return;
    }
    setSigner(library.getSigner());
  }, [library]);

  // no library?
  // library.getSigner();

  return isSupplying ? (
    <div>
      <div className="py-8" style={{ backgroundColor: "#23262B" }}>
        <div className="float-right">
          <button
            onClick={() => closeModal()}
            className="text-4xl rotate-45 text-gray-400 mr-8"
          >
            +
          </button>
        </div>
        <div className="flex align-middle justify-center items-center">
          <div className="mr-4">
            <img src={row.icon} />
          </div>
          <div>Deposit {row.name}</div>
        </div>

        {!isEnabled && (
          <div>
            <div className="mt-12 mb-6 bg-white w-16 h-16 rounded-full ml-auto mr-auto"></div>
            <div className="max-w-sm text-center m-auto mt-5 mb-5 text-sm text-gray-400">
              To supply or repay {row.name} to the Tender Protocol, you need to
              enable it first.
            </div>
          </div>
        )}
        {isEnabled && (
          <div className="flex flex-col justify-center items-center overflow-hidden">
            <input
              onChange={(e) => setValue(e.target.value)}
              className="bg-transparent text-6xl text-white text-center outline-none"
              placeholder="0"
            />
            <div className="text-gray-400 text-sm m-auto">Max ⬆</div>
          </div>
        )}
      </div>

      <div className="flex mb-10">
        <button
          className="flex-grow py-3 text-brand-green border-b-2 border-b-brand-green"
          onClick={() => setIsSupplying(true)}
        >
          Supply
        </button>
        <button
          className="flex-grow py-3"
          onClick={() => setIsSupplying(false)}
        >
          Withdraw
        </button>
      </div>
      <div className="py-6 px-12" style={{ background: "#1C1E22" }}>
        <div className="flex mb-4">
          <span className="font-bold mr-3">Supply Rates</span>{" "}
          <img src="/images/box-arrow.svg" alt="box arrow" />
        </div>
        <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 pb-6">
          <div className="mr-3">
            <img src="/images/supply-icon.svg" />
          </div>
          <div className="flex-grow">Supply APY</div>
          <div>X.XX%</div>
        </div>
        <div className="flex items-center text-gray-400 pt-4 pb-8">
          <div className="mr-3">
            <img src="/images/distribution-icon.svg" />
          </div>
          <div className="flex-grow">Distribution APY</div>
          <div>0%</div>
        </div>

        <div className="mb-8">
          {!signer && <div>Connect wallet to get started</div>}
          {signer && !isEnabled && (
            <button
              onClick={async () => {
                try {
                  // @ts-ignore existence of signer is gated above.
                  await enable(signer, row.token, row.cToken);
                  setIsEnabled(true);
                } catch (e) {
                  console.error(e);
                }
              }}
              className="py-4 text-center text-white font-bold rounded bg-brand-green w-full"
            >
              Enable
            </button>
          )}

          {signer && isEnabled && (
            <button
              onClick={async () => {
                try {
                  // TODO: error state no value
                  // @ts-ignore existence of signer is gated above.
                  deposit(value, signer, row.cToken);
                } catch (e) {
                  console.error(e);
                }
              }}
              className="py-4 text-center text-white font-bold rounded bg-brand-green w-full"
            >
              Deposit
            </button>
          )}
        </div>

        <div className="flex text-gray-500">
          <div className="flex-grow">Wallet Balance</div>
          <div>0 {row.name}</div>
        </div>
      </div>
    </div>
  ) : (
    <div>
      {/* Withdraw */}
      <div>
        <div className="py-8" style={{ backgroundColor: "#23262B" }}>
          <div className="float-right">
            <button
              onClick={() => closeModal()}
              className="text-4xl rotate-45 text-gray-400 mr-8"
            >
              +
            </button>
          </div>
          <div className="flex align-middle justify-center items-center">
            <div className="mr-4">
              <img src={row.icon} />
            </div>
            <div>Deposit {row.name}</div>
          </div>

          <div className="flex flex-col justify-center items-center overflow-hidden">
            <input
              onChange={(e) => setValue(e.target.value)}
              className="bg-transparent text-6xl text-white text-center outline-none"
              placeholder="0"
            />
            <div className="text-gray-400 text-sm m-auto">Max ⬆</div>
          </div>
        </div>
        <div className="flex">
          <button
            className="flex-grow py-3"
            onClick={() => setIsSupplying(true)}
          >
            Supply
          </button>
          <button
            className="flex-grow py-3 text-brand-green border-b-2 border-b-brand-green"
            onClick={() => setIsSupplying(false)}
          >
            Withdraw
          </button>
        </div>
        <div className="py-8" style={{ background: "#1C1E22" }}>
          <div className="py-6 px-12" style={{ background: "#1C1E22" }}>
            <div className="flex mb-4">
              <span className="font-bold mr-3">Supply Rates</span>{" "}
              <img src="/images/box-arrow.svg" alt="box arrow" />
            </div>
            <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 pb-6">
              <div className="mr-3">
                <img src="/images/supply-icon.svg" />
              </div>
              <div className="flex-grow">Borrow APY</div>
              <div>X.XX%</div>
            </div>
            <div className="flex items-center text-gray-400 pt-4 pb-8">
              <div className="mr-3">
                <img src="/images/distribution-icon.svg" />
              </div>
              <div className="flex-grow">Distribution APY</div>
              <div>0%</div>
            </div>

            <div className="mb-8">
              {!signer && <div>Connect wallet to get started</div>}
              {signer && (
                <button
                  onClick={async () => {
                    try {
                      // TODO: error state no value
                      // @ts-ignore existence of signer is gated above.
                      redeem(value, signer, row.cToken);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="py-4 text-center text-white font-bold rounded bg-brand-green w-full"
                >
                  Withdraw
                </button>
              )}
            </div>

            <div className="flex text-gray-500">
              <div className="flex-grow">Currently Borrowing</div>
              <div>0 {row.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

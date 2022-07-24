import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import dynamic from "next/dynamic";
import qs from "qs";
import useDebounce from "../hooks/useDebounce";
import {
  erc20ABI,
  useAccount,
  useContract,
  useNetwork,
  useProvider,
  useSigner,
  useWebSocketProvider,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ERC20TokenContract } from "@0x/contract-wrappers";
import { BigNumber, ethers, Signer } from "ethers";

const DynamicModal = dynamic(() => import("../components/Modal"), {
  ssr: false,
});

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const getTokenList = (data: any) => {
  if (!data) {
    return [];
  }

  const tokens = data.tokens.filter((token: any) => token.chainId == 1);
  tokens.sort((a: any, b: any) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  return tokens;
};

const getQuote = async (params: {
  sellToken: string;
  buyToken: string;
  takerAddress?: string;
  sellAmount?: number;
  buyAmount?: number;
}) => {
  const { sellToken, buyToken, takerAddress, sellAmount, buyAmount } = params;

  if (!sellToken || !buyToken) {
    return;
  }

  // const response = await fetch(
  //   `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`
  // );

  console.log("takerAddress", takerAddress);

  const response = await fetch(
    `https://ropsten.api.0x.org/swap/v1/quote?${qs.stringify(params)}`
  );

  const data = await response.json();

  console.log("gotten quote", data);
  return data;
};

const Home: NextPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [fromToken, setFromToken] = useState({
    symbol: "ETH",
    decimals: 18,
    address: "",
  });
  const [toToken, setToToken] = useState({
    symbol: "",
    decimals: 0,
    address: "",
  });
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [selectId, setSelectId] = useState("");
  const [inputId, setInputId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { address, isConnected } = useAccount();
  const provider = useProvider();

  const { data, error } = useSWR(
    "https://gateway.ipfs.io/ipns/tokens.uniswap.org",
    fetcher
  );

  const tokenList = useMemo(() => getTokenList(data), [data]);

  console.log("tokenList", tokenList[1]);

  const { debouncedFromValue, debouncedToValue } = useDebounce<string>(
    fromAmount,
    toAmount,
    inputId,
    500
  );

  console.log("debounce", debouncedFromValue, debouncedToValue);

  const modalHandler = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    console.log(e.currentTarget.id);
    setSelectId(e.currentTarget.id);
    setModalOpen((p) => !p);
  };

  const setAmountHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "fromAmount") {
      setInputId("fromAmount");
      setFromAmount(value);
    } else {
      setInputId("toAmount");
      setToAmount(value);
    }
  };

  const { data: signer, isSuccess } = useSigner();

  const contract = useContract({
    addressOrName: "0xc778417e063141139fce010982780140aa0cd5ab",
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  });

  const trySwap = async () => {
    if (!address) return;

    const quote = await getQuote({
      sellToken: fromToken.symbol,
      buyToken: toToken.symbol,
      sellAmount: Number(fromAmount) * 10 ** fromToken.decimals,
      takerAddress: address,
    });

    console.log("quote", quote);

    const tokenAddress =
      process.env.NEXT_PUBLIC_ENVIRONMENT === "testnet"
        ? "0xc778417e063141139fce010982780140aa0cd5ab"
        : fromToken.address;
    console.log("tokenAddress", tokenAddress);

    const maxApproval = BigNumber.from(2).pow(256).sub(1);
    console.log("maxApproval", maxApproval);
    console.log("contract", contract);

    // const approve = await contract.approve(quote.allowanceTarget, maxApproval);
    // console.log("approve", approve);

    const receipt = await signer?.sendTransaction(quote);
    console.log("receipt", receipt);
  };

  useEffect(() => {
    let cancelled = false;
    const getPrice = async (params: {
      sellToken: string;
      buyToken: string;
      sellAmount?: number;
      buyAmount?: number;
    }) => {
      setIsLoading(true);

      const { sellToken, buyToken, sellAmount, buyAmount } = params;

      if (!sellToken || !buyToken) {
        return;
      }

      console.log("starting fetch");

      // const response = await fetch(
      //   `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`
      // );

      const response = await fetch(
        `https://ropsten.api.0x.org/swap/v1/price?${qs.stringify(params)}`
      );

      if (cancelled) return;

      console.log("gotten reponse");
      const data = await response.json();

      console.log("gotten data", data);

      let amount: number;
      if (inputId === "fromAmount") {
        amount = data.buyAmount / 10 ** toToken.decimals;
        console.log("amount", amount);
        setToAmount(amount.toString());
      } else {
        amount = data.sellAmount / 10 ** fromToken.decimals;
        console.log("amount", amount);
        setFromAmount(amount.toString());
      }
    };

    if (!debouncedFromValue && !debouncedToValue) {
      return;
    }

    if (inputId === "fromAmount") {
      const amount = Number(debouncedFromValue);
      getPrice({
        sellToken: fromToken.symbol,
        buyToken: toToken.symbol,
        sellAmount: amount * 10 ** fromToken.decimals,
      });
      setIsLoading(false);
    } else {
      const amount = Number(debouncedToValue);
      console.log("debouncedToValue", debouncedToValue);
      getPrice({
        sellToken: fromToken.symbol,
        buyToken: toToken.symbol,
        buyAmount: amount * 10 ** toToken.decimals,
      });
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [debouncedFromValue, debouncedToValue]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Token Swap</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Hello</h1>

        <div className="col col-md-6 offset-md-3" id="window">
          <h4>Swap</h4>
          <div id="form">
            <div className="swapbox">
              <div
                className="swapbox_select token_select"
                id="from"
                onClick={modalHandler}
              >
                {fromToken.symbol ? fromToken.symbol : "SELECT A TOKEN"}
              </div>
              <div className="swapbox_select">
                <input
                  className="number form-control"
                  placeholder="amount"
                  id="fromAmount"
                  value={fromAmount}
                  onChange={setAmountHandler}
                />
              </div>
            </div>
            <div className="swapbox">
              <div
                className="swapbox_select token_select"
                id="to"
                onClick={modalHandler}
              >
                {toToken.symbol ? toToken.symbol : "SELECT A TOKEN"}
              </div>
              <div className="swapbox_select">
                <input
                  className="number form-control"
                  placeholder="amount"
                  id="toAmount"
                  value={toAmount}
                  onChange={setAmountHandler}
                />
              </div>
            </div>
            <div className="gas_estimate_label">
              Estimated Gas: <span id="gas_estimate"></span>
            </div>
            <button
              // disabled
              className="btn btn-large btn-primary btn-block"
              id="swap_button"
              onClick={trySwap}
            >
              Swap
            </button>
          </div>
        </div>

        {modalOpen && (
          <Modal
            tokens={tokenList}
            selectId={selectId}
            setFromToken={setFromToken}
            setToToken={setToToken}
          />
        )}
        {/* {modalOpen && <DynamicModal tokens={tokenList} />} */}
      </main>
    </div>
  );
};

export default Home;

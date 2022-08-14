/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal";
import useSWR from "swr";
import dynamic from "next/dynamic";
import qs from "qs";
import useDebounce from "../hooks/useDebounce";
import {
  erc20ABI,
  useAccount,
  useContract,
  useSendTransaction,
  useSigner,
} from "wagmi";
import { BigNumber, BigNumberish, BytesLike } from "ethers";
import { AccessListish } from "ethers/lib/utils";
import styled from "styled-components";
import { fetcher, getQuote, getTokenList } from "../utils";
import { useGlobalState } from "../hooks/useGlobalContext";

const DynamicModal = dynamic(() => import("../components/Modal"), {
  ssr: false,
});

export type TransactionRequest = {
  to?: string;
  from?: string;
  nonce?: BigNumberish;

  gasLimit?: BigNumberish;
  gasPrice?: BigNumberish;

  data?: BytesLike;
  value?: BigNumberish;
  chainId?: number;

  type?: number;
  accessList?: AccessListish;

  maxPriorityFeePerGas?: BigNumberish;
  maxFeePerGas?: BigNumberish;

  customData?: Record<string, any>;
  ccipReadEnabled?: boolean;
};

const SwapForm = () => {
  const [fromToken, setFromToken] = useState({
    symbol: "ETH",
    decimals: 18,
    address: "",
    image: "./eth.wine.svg",
  });
  const [toToken, setToToken] = useState({
    symbol: "",
    decimals: 0,
    address: "",
    image: "",
  });
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [inputId, setInputId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // const [quote, setQuote] = useState<TransactionRequest | undefined>();
  const [state, setState] = useGlobalState();

  const quote = state.quote;

  const { data } = useSWR(
    "https://gateway.ipfs.io/ipns/tokens.uniswap.org",
    fetcher
  );

  const tokenList = useMemo(() => getTokenList(data), [data]);

  const { address, isConnected } = useAccount();

  const { debouncedFromValue, debouncedToValue } = useDebounce<string>(
    fromAmount,
    toAmount,
    inputId,
    500
  );

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

  const { data: signer } = useSigner();

  const contract = useContract({
    addressOrName: "0xc778417e063141139fce010982780140aa0cd5ab",
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  });

  const { sendTransaction } = useSendTransaction({
    request: {
      to: quote?.to,
      value: quote?.value,
      data: quote?.data,
      from: quote?.from,
      gasPrice: quote?.gasPrice,
      gasLimit: quote?.gas,
      chainId: quote?.chainId,
    },
    onSuccess() {
      console.log("success");
      // setQuote({});
      setState((prev) => ({ ...prev, quote: {} }));
    },
  });

  const trySwap = async () => {
    if (!address) {
      setError("Not connected to wallet");
      return;
    }

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

    // setQuote(quote);
    setState((prev) => ({ ...prev, quote }));
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

      const { sellToken, buyToken } = params;

      if (!sellToken || !buyToken) {
        return;
      }

      // const response = await fetch(
      //   `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`
      // );

      const response = await fetch(
        `https://ropsten.api.0x.org/swap/v1/price?${qs.stringify(params)}`
      );

      if (cancelled) return;

      const data = await response.json();

      let amount: number;
      if (inputId === "fromAmount") {
        amount = data.buyAmount / 10 ** toToken.decimals;
        setToAmount(amount.toString());
      } else {
        amount = data.sellAmount / 10 ** fromToken.decimals;
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

  useEffect(() => {
    if (!quote) return;

    sendTransaction();
  }, [quote]);

  return (
    <Wrapper>
      <SwapContainer>
        <HeadingWrapper>
          <Heading>
            <span>currency</span> / <span>swap</span>
          </Heading>

          <ContinueButton onClick={trySwap}>Continue</ContinueButton>
        </HeadingWrapper>

        <FormWrapper>
          <InputWrapper>
            <InputLabel htmlFor="from">from</InputLabel>
            <SelectWrapper>
              <Modal tokens={tokenList} setFromToken={setFromToken}>
                <SelectButton id="from">
                  <IconWrapper>
                    <img src={fromToken.image} alt={fromToken.symbol} />
                  </IconWrapper>
                  <span>{fromToken.symbol ? fromToken.symbol : "CHOOSE"}</span>
                  <span>..</span>
                </SelectButton>
              </Modal>

              <Input
                id="fromAmount"
                placeholder="0.00"
                value={fromAmount}
                onChange={setAmountHandler}
              />
            </SelectWrapper>
          </InputWrapper>

          <ArrowIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.3 -0.3 2.6 7.6">
              <path
                d="M 0 0 L 2 1 M 0 3 L 2 2 M 2 4 L 0 5 M 2 7 L 0 6"
                stroke="#000000"
                strokeWidth="0.5"
                fill="#000000"
              />
            </svg>
          </ArrowIcon>

          <InputWrapper>
            <InputLabel htmlFor="to">to</InputLabel>
            <SelectWrapper>
              <Modal tokens={tokenList} setToToken={setToToken}>
                <SelectButton id="to">
                  <IconWrapper>
                    {toToken.image && (
                      <img src={toToken.image} alt={toToken.symbol} />
                    )}
                  </IconWrapper>
                  <span>{toToken.symbol ? toToken.symbol : "CHOOSE"}</span>
                  <span>..</span>
                </SelectButton>
              </Modal>
              <Input
                id="toAmount"
                placeholder="0.00"
                value={toAmount}
                onChange={setAmountHandler}
              />
            </SelectWrapper>
          </InputWrapper>
        </FormWrapper>
      </SwapContainer>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  /* font-scale */
  --step-0: clamp(2rem, calc(1.64rem + 1.82vw), 3rem);

  --spacing-select-top: 16px;

  font-family: var(--font-family-incon);
  width: min(100% - var(--spacing-wrapper), 1200px);
  margin-inline: auto;
`;

const SwapContainer = styled.div`
  grid-area: main;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const HeadingWrapper = styled.div`
  margin-bottom: 64px;
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h1`
  text-transform: uppercase;
  font-size: var(--step-0);
  font-weight: 500;
  font-stretch: 100%;
  letter-spacing: 0.4em;
`;

const ContinueButton = styled.button`
  background: var(--color-primary-light);
  border: none;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-elevation-medium);
  padding-inline: 28px;
  padding-block: 24px;
  color: var(--color-primary-dark);
  text-transform: uppercase;
  font-family: var(--font-family-nova);
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
`;

const FormWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const ArrowIcon = styled.div`
  width: 12px;
  height: 12px;
  align-self: center;
  padding-top: calc(var(--spacing-select-top) * 0.65);
`;

const InputWrapper = styled.div`
  flex: 1;
`;

const InputLabel = styled.label`
  text-transform: uppercase;
  font-family: var(--font-family-nova);
  font-size: 0.9rem;
  color: var(--color-primary-dark);
`;

const SelectWrapper = styled.div`
  background: var(--color-white);
  padding: 4px;
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-select-top);
`;

const SelectButton = styled.button`
  border: none;
  background: var(--color-black);
  color: var(--color-white);
  font-family: var(--font-family-incon);
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding-inline: 12px;
  padding-block: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;

  & > span:last-of-type {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }
`;

const Input = styled.input`
  border: none;
  font-family: var(--font-family-incon);
  text-align: right;
  padding-right: 24px;
  font-size: 1.2rem;
  font-weight: 500;
  outline: none;

  /* &:focus {
    outline: none;
    border: none;
  } */
`;

const IconWrapper = styled.div`
  width: 30px;
  height: 30px;
  background: #fff;

  img {
    width: 100%;
    height: 100%;
  }
`;

export default SwapForm;

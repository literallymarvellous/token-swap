import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal";
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
  useSendTransaction,
  useSigner,
  useWebSocketProvider,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ERC20TokenContract } from "@0x/contract-wrappers";
import { BigNumber, BigNumberish, BytesLike, ethers, Signer } from "ethers";
import { AccessListish } from "ethers/lib/utils";
import styled from "styled-components";

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
  console.log("takerAddress", takerAddress);

  const response = await fetch(
    `https://ropsten.api.0x.org/swap/v1/quote?${qs.stringify(params)}`
  );

  const data = await response.json();

  console.log("gotten quote", data);
  return data;
};

const SwapForm = () => {
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
  const [error, setError] = useState("");
  const [quote, setQuote] = useState<TransactionRequest | undefined>();

  const { data } = useSWR(
    "https://gateway.ipfs.io/ipns/tokens.uniswap.org",
    fetcher
  );

  const tokenList = useMemo(() => getTokenList(data), [data]);

  console.log("tokenList", tokenList[1]);

  const { address, isConnected } = useAccount();
  const provider = useProvider();

  const { debouncedFromValue, debouncedToValue } = useDebounce<string>(
    fromAmount,
    toAmount,
    inputId,
    500
  );

  console.log("debounce", debouncedFromValue, debouncedToValue);

  const modalHandler = (e: MouseEvent<HTMLButtonElement>) => {
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

  const { sendTransaction } = useSendTransaction({
    request: {
      to: quote?.to,
      value: quote?.value,
      data: quote?.data,
      from: quote?.from,
      gasPrice: quote?.gasPrice,
      gasLimit: quote?.gasLimit,
      chainId: quote?.chainId,
    },
    onSuccess() {
      console.log("success");
      setQuote({});
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

    setQuote(quote);
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

          <ContinueButton>Continue</ContinueButton>
        </HeadingWrapper>

        <FormWrapper>
          <InputWrapper>
            <InputLabel htmlFor="from">from</InputLabel>
            <SelectWrapper>
              <SelectButton id="from" onClick={modalHandler}>
                <IconWrapper></IconWrapper>
                <span>Choose</span>
                <span>..</span>
              </SelectButton>
              <Input id="fromAmount" placeholder="0.00" />
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
              <SelectButton id="to" onClick={modalHandler}>
                <IconWrapper></IconWrapper>
                <span>Choose</span>
                <span>..</span>
              </SelectButton>
              <Input id="toAmount" placeholder="0.00" />
            </SelectWrapper>
          </InputWrapper>
        </FormWrapper>
      </SwapContainer>

      <Modal
        modalOpen={modalOpen}
        tokens={tokenList}
        selectId={selectId}
        setFromToken={setFromToken}
        setToToken={setToToken}
      />
    </Wrapper>
  );
};

const Wrapper = styled.section`
  /* font-scale */
  --step-0: clamp(2rem, calc(1.64rem + 1.82vw), 3rem);

  --spacing-select-top: 16px;

  font-family: var(--font-family-incon);
  min-height: 100vh;
  display: grid;
  grid-template-rows: 1fr 2fr 1.6fr;
  grid-template-areas:
    "."
    "main"
    ".";
`;

const SwapContainer = styled.div`
  grid-area: main;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const HeadingWrapper = styled.div`
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
`;

export default SwapForm;

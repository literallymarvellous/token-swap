import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import Modal from "../components/Modal";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import dynamic from "next/dynamic";

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

const Home: NextPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [selectId, setSelectId] = useState("");

  const { data, error } = useSWR(
    "https://gateway.ipfs.io/ipns/tokens.uniswap.org",
    fetcher
  );

  const tokenList = useMemo(() => getTokenList(data), [data]);

  console.log("tokenList", tokenList);

  const modalHandler = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    console.log(e.currentTarget.id);
    setSelectId(e.currentTarget.id);
    setModalOpen((p) => !p);
  };

  const setAmountHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    id === "fromAmount" ? setFromAmount(value) : setToAmount(value);
  };

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
                {fromToken ? fromToken : "SELECT A TOKEN"}
              </div>
              <div className="swapbox_select">
                <input
                  className="number form-control"
                  placeholder="amount"
                  id="fromAmount"
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
                {toToken ? toToken : "SELECT A TOKEN"}
              </div>
              <div className="swapbox_select">
                <input
                  className="number form-control"
                  placeholder="amount"
                  id="toAmount"
                />
              </div>
            </div>
            <div className="gas_estimate_label">
              Estimated Gas: <span id="gas_estimate"></span>
            </div>
            <button
              disabled
              className="btn btn-large btn-primary btn-block"
              id="swap_button"
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
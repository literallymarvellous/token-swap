import React, { ReactNode } from "react";
import styled from "styled-components";
import { useGlobalState } from "../hooks/useGlobalContext";
import { CustomConnectButton } from "./CustomConnectButton";

const Layout = ({ children }: { children: ReactNode }) => {
  const [state] = useGlobalState();
  const quote = state.quote;

  return (
    <Wrapper>
      <Header>
        <FirstDiv>
          <BoldSpan>Swap</BoldSpan> <span>your</span> <span> favourite</span>{" "}
          <span>coins</span>
        </FirstDiv>

        <SecondDiv>
          <BoldSpan>Cryptocurrency</BoldSpan> <span>indices</span>
        </SecondDiv>
        <WalletWrapper>
          <CustomConnectButton />
        </WalletWrapper>
      </Header>

      {children}

      <Footer>
        <BalanceDisplay>
          <span>Balance</span> <span>0.00</span> <span>USD</span>
        </BalanceDisplay>
        <SwapInfo>
          <div>
            <span>minimum recieved</span> <span>{quote.guaranteedPrice}</span>
          </div>
          <div>
            <span>price impact</span> <span>{quote.estimatedPriceImpact}</span>
          </div>
          <div>
            <span>liquidity provide fee</span>{" "}
            <span>{quote.minimumProtocolFee}</span>
          </div>
          <div>
            <span>slippage tolerance</span>{" "}
            <span>{quote.expectedSlippage}</span>
          </div>
        </SwapInfo>
      </Footer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  --padding-items: 8px;
  --line-height: 24px;

  --span-gap: 8px;

  /* font-scale */
  --step-0: clamp(0.75rem, calc(0.7rem + 0.23vw), 0.88rem);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-height: 100vh;
  width: min(100% - var(--spacing-wrapper), 1200px);
  margin-inline: auto;
`;

const Header = styled.header`
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0; */
  width: min(100% - var(--spacing-wrapper), 1200px);
  margin-inline: auto;
  /* padding-inline: var(--spacing-wrapper); */
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-family: var(--font-family-nova);
  font-size: var(--step-0);

  & > div {
    color: var(--color-primary-dark);
  }
`;

const FirstDiv = styled.div`
  padding-block: var(--padding-items);
  display: flex;
  gap: var(--span-gap);
`;

const SecondDiv = styled.div`
  margin-inline: auto;
  padding-block: var(--padding-items);
  display: flex;
  gap: var(--span-gap);
`;

export const BoldSpan = styled.span`
  font-weight: 700;
  color: var(--color-black);
`;

const WalletWrapper = styled.div`
  padding-block: var(--padding-items);
`;

const Footer = styled.footer`
  /* position: fixed;
  bottom: 0;
  left: 0;
  right: 0; */
  width: min(100% - var(--spacing-wrapper), 1200px);
  margin-inline: auto;
  /* padding-inline: var(--spacing-wrapper); */
  /* margin-top: auto; */
  padding-bottom: 32px;
  display: flex;
  text-transform: uppercase;
  color: var(--color-primary-dark);
  font-size: 0.85rem;
`;

const BalanceDisplay = styled.div`
  flex: 1;
  display: flex;
  gap: 16px;
`;

const SwapInfo = styled.div`
  flex: 1;

  & > div {
    display: flex;
    padding-top: 8px;

    & > span:first-of-type {
      text-align: left;
      flex: 2;
    }

    & > span:last-of-type {
      text-align: left;
      flex: 1;
    }
  }
`;

export default Layout;

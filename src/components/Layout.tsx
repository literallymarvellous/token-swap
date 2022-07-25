import React from "react";
import styled from "styled-components";
import { CustomConnectButton } from "./CustomConnectButton";

const Layout = ({ children }: { children: React.ReactNode }) => {
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
            <span>minimum recieved</span> <span>2.056836330</span>
          </div>
          <div>
            <span>price impat</span> <span>0.00</span>
          </div>
          <div>
            <span>liquidity provide fee</span> <span>0.23740</span>
          </div>
          <div>
            <span>slippage tolerance</span> <span>0.00</span>
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

  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding-inline: var(--spacing-wrapper);
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
  padding-inline: var(--spacing-wrapper);
  margin-top: auto;
  padding-bottom: 32px;
  display: flex;
`;

const BalanceDisplay = styled.div`
  flex: 1;
`;

const SwapInfo = styled.div`
  flex: 1;

  & > div {
    display: flex;

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

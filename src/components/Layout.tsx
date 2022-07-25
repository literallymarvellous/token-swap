import React from "react";
import styled from "styled-components";
import { CustomConnectButton } from "./CustomConnectButton";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper>
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
      {/* {children} */}
    </Wrapper>
  );
};

const Wrapper = styled.header`
  --padding-items: 8px;
  --line-height: 24px;

  --span-gap: 8px;

  /* font-scale */
  --step-0: clamp(0.75rem, calc(0.7rem + 0.23vw), 0.88rem);

  padding-inline: var(--spacing-wrapper);
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-family: var(--font-family-header);
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

export default Layout;

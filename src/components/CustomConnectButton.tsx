import { ConnectButton } from "@rainbow-me/rainbowkit";
import styled from "styled-components";
import { BoldSpan } from "./Layout";
export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <ConnectButtonCustom onClick={openConnectModal} type="button">
                    Connect
                  </ConnectButtonCustom>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <>
                  <WalletButton onClick={openChainModal} type="button">
                    <BoldSpan>Wallet</BoldSpan>
                  </WalletButton>
                  <AccountButton onClick={openAccountModal} type="button">
                    {account.displayName}
                  </AccountButton>
                </>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

const BaseButton = styled.button`
  border: none;
  background: inherit;
  font-family: inherit;
  cursor: pointer;
  text-transform: uppercase;
`;

const ConnectButtonCustom = styled(BaseButton)`
  background: var(--color-white);
  font-size: calc(var(--step-0) * 0.75);
  font-weight: 700;
  box-shadow: var(--shadow-elevation-high);
  line-height: var(--line-height);
  padding-inline: 16px;
  padding-block: 8px;
`;

const WalletButton = styled(BaseButton)``;

const AccountButton = styled(BaseButton)``;

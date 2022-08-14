/* eslint-disable @next/next/no-img-element */
import { Dispatch, MouseEvent, SetStateAction } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import styled, { keyframes } from "styled-components";

type ModalProps = {
  children: React.ReactNode;
  tokens: any;
  setFromToken?: Dispatch<
    SetStateAction<{
      symbol: string;
      decimals: number;
      address: string;
      image: string;
    }>
  >;
  setToToken?: Dispatch<
    SetStateAction<{
      symbol: string;
      decimals: number;
      address: string;
      image: string;
    }>
  >;
};

const Modal = ({ tokens, setFromToken, setToToken, children }: ModalProps) => {
  const selectTokenHandler = ({
    symbol,
    decimals,
    address,
    image,
  }: {
    symbol: string;
    decimals: number;
    address: string;
    image: string;
  }) => {
    setFromToken && setFromToken({ symbol, decimals, address, image });
    setToToken && setToToken({ symbol, decimals, address, image });
  };

  return (
    <ModalWrapper>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <ModalOverlay />
      <ModalContent>
        <Title>choose coin</Title>
        <ListBox>
          <List>
            <ListItem
              onClick={() =>
                selectTokenHandler({
                  symbol: "ETH",
                  decimals: 18,
                  address: "",
                  image: "./eth.wine.svg",
                })
              }
            >
              <ListCloseButton>
                <ImageContainer>
                  <img src="./eth.wine.svg" alt="ethereum logo" />
                </ImageContainer>
                <TokenSymbol>ETH</TokenSymbol>
              </ListCloseButton>
            </ListItem>
            {tokens.map((token: any) => (
              <ListItem
                key={token.name}
                onClick={() =>
                  selectTokenHandler({
                    symbol: token.symbol,
                    decimals: parseInt(token.decimals),
                    address: token.address,
                    image: token.logoURI,
                  })
                }
              >
                <ListCloseButton key={token.name}>
                  <ImageContainer>
                    <img src={token.logoURI} alt={`${token.name} logo`} />
                  </ImageContainer>
                  <TokenSymbol>{token.symbol}</TokenSymbol>
                </ListCloseButton>
              </ListItem>
            ))}
          </List>
        </ListBox>
        <ButtonsContainer>
          <SearchButton>search</SearchButton>
          <CloseButton asChild>
            <button>close</button>
          </CloseButton>
        </ButtonsContainer>
      </ModalContent>
    </ModalWrapper>
  );
};

const overlayShow = keyframes`
  0% { opacity: 0 };
  100% { opacity: 1 };
`;

const overlayClose = keyframes`
  0% { opacity: 1 };
  100% { opacity: 0};
`;

const contentShow = keyframes`
  0% { opacity: 0 };
  100% { opacity: 1};
`;

const contentClose = keyframes`
  0% { opacity: 1 };
  100% { opacity: 0};
`;

const ModalWrapper = styled(Dialog)`
  padding: 0;
  margin: 0;
`;

const ModalOverlay = styled(DialogOverlay)`
  --blur: 40px;
  --brightness: 10%;
  --opacity: 10%;

  background: var(--color-white);
  position: fixed;
  inset: 0;
  z-index: 2;
  filter: blur(5px) opacity(0.96);

  &[data-state="open"] {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${overlayShow} 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  }

  &[data-state="closed"] {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${overlayClose} 200ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  }
`;

const ModalContent = styled(DialogContent)`
  --space-m-xl: clamp(2rem, calc(1.26rem + 3.7vw), 4.5rem);
  /* --space-m-2xl: clamp(2rem, calc(0.22rem + 8.89vw), 8rem); */
  --space-m-2xl: clamp(1.5rem, calc(-0.13rem + 8.15vw), 7rem);
  /* --space-m-3xl: clamp(2rem, calc(-0.96rem + 14.81vw), 12rem); */
  --space-m-3xl: clamp(1.5rem, calc(-0.72rem + 11.11vw), 9rem);

  --step-0: clamp(2rem, calc(1.41rem + 2.96vw), 4rem);

  background: transparent;
  /* opacity: 0.9; */
  padding-inline: var(--space-m-2xl);
  padding-block: var(--space-m-xl);
  position: fixed;
  inset: 0;
  z-index: 3;
  display: grid;
  grid-auto-columns: minmax(30rem, 1fr);
  grid-template-areas:
    "title listbox"
    "buttons .";

  &[data-state="open"] {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${contentShow} 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  }

  &[data-state="closed"] {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${contentClose} 200ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  }
`;

const Title = styled(DialogTitle)`
  /* --step-0: clamp(1.25rem, calc(1.1rem + 0.74vw), 1.75rem); */
  /* --step-0: clamp(2rem, calc(1.7rem + 1.48vw), 3rem); */
  --step-0: clamp(2rem, calc(1.56rem + 2.22vw), 3.5rem);

  font-family: var(--font-family-incon);
  font-size: var(--step-0);
  font-weight: 400;
  text-transform: uppercase;
  margin-top: 96px;
  grid-area: title;
`;

const ListBox = styled.div`
  --padding-inline: 36px;
  --padding-block: 32px;
  --box-height: 400px;

  padding-inline: var(--padding-inline);
  padding-block: var(--padding-block);
  background: var(--color-black);
  height: var(--box-height);
  align-self: flex-end;
  overflow: hidden;
  grid-area: listbox;
  color: var(--color-white);
`;

const List = styled.ul`
  list-style: none;
  overflow: scroll;
  height: 100%;
`;

const ListItem = styled.li``;

const ImageContainer = styled.div`
  width: 32px;
  height: 32px;

  & img {
    width: 100%;
    height: 100%;
  }
`;

const TokenSymbol = styled.div`
  letter-spacing: 2px;
  font-size: 1rem;
`;

const ButtonsContainer = styled.div`
  /* --step-0: clamp(0.88rem, calc(0.76rem + 0.56vw), 1.25rem); */
  --step-0: clamp(0.88rem, calc(0.84rem + 0.19vw), 1rem);

  justify-self: end;
  display: flex;
  gap: 8px;
  padding-right: 1px;
  grid-area: buttons;
`;

const SearchButton = styled.button`
  padding-block: 2.1em;
  padding-inline: 1.4em;
  align-self: flex-start;
  border: none;
  border-radius: 2px;
  background: var(--color-black);
  color: var(--color-white);
  font-family: var(--font-family-incon);
  font-size: var(--step-0);
  text-transform: uppercase;
  cursor: pointer;
`;

const CloseButton = styled(DialogClose)`
  padding-block: 2.1em;
  padding-inline: 1.6em;
  align-self: flex-start;
  border: none;
  border-radius: 2px;
  background: var(--color-primary-light);
  color: var(--color-black);
  font-family: var(--font-family-incon);
  font-size: var(--step-0);
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;
`;

const ListCloseButton = styled(DialogClose)`
  height: calc((var(--box-height) - (var(--padding-block) * 2)) / 6);
  border: none;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-black);
  color: var(--color-white);
`;

export default Modal;

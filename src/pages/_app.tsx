import GlobalStyles from "../components/GlobalStyles";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Layout from "../components/Layout";
import { GlobalStateProvider } from "../hooks/useGlobalContext";

const { chains, provider } = configureChains(
  [chain.ropsten, chain.goerli, chain.mainnet],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Token Swap",
  chains,
});

const wagmiClient = createClient({
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <GlobalStyles />
        <GlobalStateProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </GlobalStateProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;

import qs from "qs";

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const getTokenList = (data: any) => {
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

export const getQuote = async (params: {
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

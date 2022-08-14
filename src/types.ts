export interface QuoteInterface {
  chainId: number;
  price: string;
  guaranteedPrice: string;
  estimatedPriceImpact: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  from: string;
  gasPrice: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  sources: Source[];
  orders: Order[];
  allowanceTarget: string;
  decodedUniqueId: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
  expectedSlippage: null;
}

export interface Order {
  type: number;
  source: string;
  makerToken: string;
  takerToken: string;
  makerAmount: string;
  takerAmount: string;
  fillData: FillData;
  fill: Fill;
  sourcePathId: string;
}

export interface Fill {
  input: string;
  output: string;
  adjustedOutput: string;
  gas: number;
}

export interface FillData {
  tokenAddressPath: string[];
  router: string;
}

export interface Source {
  name: string;
  proportion: string;
}

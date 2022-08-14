import { BigNumberish, BytesLike } from "ethers";
import { AccessListish } from "ethers/lib/utils";
import { createContext, ReactNode, useContext, useState } from "react";
import { QuoteInterface } from "../types";

const initialState = {
  quote: {},
};

const useMyState = () =>
  useState<{ quote: Partial<QuoteInterface> }>(initialState);

const Context = createContext<ReturnType<typeof useMyState> | null>(null);

export const useGlobalState = () => {
  const value = useContext(Context);
  if (value === null) throw new Error("Please add SharedStateProvider");
  return value;
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => (
  <Context.Provider value={useMyState()}>{children}</Context.Provider>
);

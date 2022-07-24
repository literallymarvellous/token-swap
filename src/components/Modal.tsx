/* eslint-disable @next/next/no-img-element */
import { Dispatch, MouseEvent, SetStateAction } from "react";
import Image from "next/image";

const Modal = ({
  tokens,
  selectId,
  setFromToken,
  setToToken,
}: {
  tokens: any;
  selectId: string;
  setFromToken: Dispatch<
    SetStateAction<{
      symbol: string;
      decimals: number;
    }>
  >;
  setToToken: Dispatch<
    SetStateAction<{
      symbol: string;
      decimals: number;
    }>
  >;
}) => {
  const selectTokenHandler = ({
    symbol,
    decimals,
  }: {
    symbol: string;
    decimals: number;
  }) => {
    selectId === "from"
      ? setFromToken((p) => ({ ...p, symbol, decimals }))
      : setToToken((p) => ({ ...p, symbol, decimals }));
  };

  return (
    <div className="modal" id="token_modal" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select a Token</h5>
            <button
              id="modal_close"
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div>
              <div
                onClick={() =>
                  selectTokenHandler({
                    symbol: "ETH",
                    decimals: 18,
                  })
                }
              >
                <div>ETH</div>
                <div>Ether</div>
                <img
                  src="./eth.wine.svg"
                  width={50}
                  height={50}
                  alt="ethereum logo"
                />
              </div>
            </div>
            {tokens.map((token: any) => (
              <div
                key={token.name}
                onClick={() =>
                  selectTokenHandler({
                    symbol: token.symbol,
                    decimals: parseInt(token.decimals),
                  })
                }
              >
                <div>{token.symbol}</div>
                <div>{token.name}</div>
                <img
                  src={token.logoURI}
                  width={50}
                  height={50}
                  alt={`${token.name} logo`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

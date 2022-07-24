/* eslint-disable @next/next/no-img-element */
import { MouseEvent } from "react";
import Image from "next/image";

const Modal = ({
  tokens,
  selectId,
  setFromToken,
  setToToken,
}: {
  tokens: any;
  selectId: string;
  setFromToken: any;
  setToToken: any;
}) => {
  const selectTokenHandler = (tokenName: string) => {
    selectId === "from" ? setFromToken(tokenName) : setToToken(tokenName);
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
              <div onClick={() => selectTokenHandler("ETH")}>
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
                onClick={() => selectTokenHandler(token.symbol)}
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

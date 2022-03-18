import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import mining from "./assets/mine.gif";
import React from "react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import epicNft from "./utils/epicNFT.json";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0x17a7Ed37F303B2d0b3389616F27b175e076Ec145";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [tokensMinted, setTokensMinted] = useState({});
  const [isMining, setIsMining] = useState(false);

  const isWalletConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask installed!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      let chainId = await ethereum.request({ method: "eth_chainId" });

      //String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby TestNetwork");
        return;
      }
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
      getTokensMinted();
      eventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });

      //String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby TestNetwork");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      getTokensMinted();
      eventListener();
    } catch (error) {
      console.log(error);
    }
  };

  const eventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          epicNft.abi,
          signer
        );

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkChainId = async () => {
    try {
      const { ethereum } = window;
      let chainId = await ethereum.request({ method: "eth_chainId" });

      //String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby TestNetwork");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    isWalletConnected();
    getTokensMinted();
  }, []);

  const getTokensMinted = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          epicNft.abi,
          signer
        );

        console.log("Get em while there hot!!!");
        let remainingTxn = await connectedContract.getTokensRemaining();

        // console.log("Mining...please wait.");
        // await remainingTxn.wait();

        console.log(
          `Minted: ${remainingTxn[0]}/${remainingTxn[1]}: ${remainingTxn[2]}`
        );

        setTokensMinted({
          minted: `Minted: ${remainingTxn[0]}/${remainingTxn[1]}`,
          soldOut: remainingTxn[2],
        });
      } else {
        console.log("ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mintNftFromContract = async () => {
    try {
      const { ethereum } = window;

      let chainId = await ethereum.request({ method: "eth_chainId" });

      //String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby TestNetwork");
        return;
      }

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          epicNft.abi,
          signer
        );

        console.log("Get ready to break your bank paying gas fees");
        let nftTxn = await connectedContract.mintEpicNFT();

        setIsMining(true);

        console.log("Mining...please wait.");
        await nftTxn.wait();
        setIsMining(false);
        getTokensMinted();
        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );

        // connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        //   console.log(from, tokenId.toNumber());
        //   alert(
        //     `Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`
        //   );
        // });
      } else {
        console.log("ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(".mmmm", error);
    }
  };

  const soldout = () => {
    if (tokensMinted.soldOut === "Sold Out!") {
      return "soldout";
    }
    return "cta-button mint-button";
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {!currentAccount ? (
            renderNotConnectedContainer()
          ) : isMining ? (
            <img
              alt="Mining"
              className="mine"
              src={mining}
              width="500"
              height="auto"
            />
          ) : (
            <button onClick={mintNftFromContract} className={soldout()}>
              Mint NFT
            </button>
          )}
          <div className="mint-count">
            {tokensMinted.minted} {tokensMinted.soldOut}
          </div>
        </div>
        <div className="footer-container">
          <div>
            <button
              className="cta-button opensea-button"
              onClick={() =>
                window.open(
                  "https://testnets.opensea.io/collection/starnft-oiiksmtuel",
                  "_blank"
                )
              }
            >
              See the Collection
            </button>
          </div>
          <div className="tweet">
            <img
              alt="Twitter Logo"
              className="twitter-logo"
              src={twitterLogo}
            />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`built on @${TWITTER_HANDLE}`}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

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

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [tokensMinted, setTokensMinted] = useState("");
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
  }, []);

  const getTokensMinted = async () => {
    const CONTRACT_ADDRESS = "0x90BE7ABbe65A13624200EEcCE504BBB7947Be622";

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

        console.log(`Minted: ${remainingTxn[0]}/${remainingTxn[1]}`);

        setTokensMinted(`Minted: ${remainingTxn[0]}/${remainingTxn[1]}`);
      } else {
        console.log("ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  getTokensMinted();
  const mintNftFromContract = async () => {
    const CONTRACT_ADDRESS = "0x90BE7ABbe65A13624200EEcCE504BBB7947Be622";

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

        console.log("Get ready to break your bank paying gas fees");
        setIsMining(true);
        let nftTxn = await connectedContract.mintEpicNFT();

        console.log("Mining...please wait.");
        await nftTxn.wait();
        setIsMining(false);
        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
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
            <button
              onClick={mintNftFromContract}
              className="cta-button connect-wallet-button"
            >
              Mint NFT
            </button>
          )}
          <div className="mint-count">{tokensMinted}</div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

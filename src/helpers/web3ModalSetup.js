import dotenv from "dotenv";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

dotenv.config();

/**
  Web3 modal helps us "connect" external wallets:
**/
const web3ModalSetup = () =>
  new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {
      metamask:{
        display:{
          name: "Injected",
          description: "Connect with the provider in your Browser"
        },
        package:null
      },
     
      walletconnect:{
        package:WalletConnectProvider,
        options:{
          infuraId:"5c867c36019445949c0a2cb02e8d528e"
        }
      },

    },
  });

export default web3ModalSetup;

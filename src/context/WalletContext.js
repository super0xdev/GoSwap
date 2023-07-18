import React, { useState } from 'react'
import { useContext } from 'react';
import { local } from 'web3modal';

const  WalletContext = React.createContext({})

export const WalletProvider = ({children}) => {

  const T_KEY = 'wallet';
  const getInitialWallet = () => {
    const tmp = localStorage.getItem(T_KEY);
    if(tmp == null) return {
        account: 'empty',
        connection: false,
    };
    else return JSON.parse(tmp);
  }
  const [ wallet, setWallet ] = useState(getInitialWallet);

  const handleWallet = (value) => {
    const tmp = getInitialWallet();
    console.log('---', value);
    console.log('--tmp--', tmp);
    if(tmp.account == 'empty') {
        localStorage.setItem(T_KEY, JSON.stringify(value));
    } else {
        const res = {
            account: value.account,
            connection: value.connection,
        }
        console.log('--res--', res);
        localStorage.setItem(T_KEY, JSON.stringify(res));
    }
    setWallet(value);
  }

  const setConnection = (isConnected) => {
    const tmp = getInitialWallet();
    tmp.connection = isConnected;
    localStorage.setItem(T_KEY, JSON.stringify(tmp));
  }

  return(
    <WalletContext.Provider
      value={{
        wallet,
        setWallet: handleWallet,
        setConnection: setConnection,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext);
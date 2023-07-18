import Swap from "./pages/Swap";
import React, { useState,useEffect,useRef} from 'react';
import { WalletProvider } from './context/WalletContext';

function App() {
  return (
    <WalletProvider>
      <Swap></Swap>
    </WalletProvider>
  );
}

export default App;

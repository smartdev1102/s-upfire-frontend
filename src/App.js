import { Box } from '@mui/material';
import Header from './components/common/Header';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Footer from './components/common/Footer';
import Farms from './components/farms/Farms';
import Tokens from './components/Tokens';
import Pools from './components/Pools';
import Banner from './components/common/Banner';
import { useState } from 'react';
import Referral from './components/Referral';

function App() {
  const [walletAddress, setWalletAddress] = useState();
  const [chain, setChain] = useState(97);
  
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });  // connect wallet
      setWalletAddress(account);
    }
  }
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <BrowserRouter>
        <Box>
          <Header walletAddress={walletAddress} connectWallet={connectWallet} />
        </Box>
        <Box
          sx={{
            mt: '20px'
          }}
        >
          <Banner chain={chain} setChain={setChain} />
        </Box>
        <Box
          sx={{
            p: '20px'
          }}
        >
          <Routes>
            <Route path='/' element={<Navigate to="/farms" />} />
            <Route path="/farms" element={<Farms walletAddress={walletAddress} chain={chain} />} />
            <Route path="/tokens" element={<Tokens chain={chain} />} />
            <Route path="/pools" element={<Pools />} />
            <Route path="/referral" element={<Referral walletAddress={walletAddress} />} />
          </Routes>
        </Box>
        <Footer />
      </BrowserRouter>
    </Box>
  );
}

export default App;

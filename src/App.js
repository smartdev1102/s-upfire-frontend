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
import ReferralDlg from './components/common/ReferralDlg';
import CreatePool from './components/CreatePool';
import { address, erc20Abi, signer, generatorWeb3 } from './utils/ethers.util';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import WalletAlert from './components/common/WalletAlert';

function App() {
  const [walletAddress, setWalletAddress] = useState();
  const [chain, setChain] = useState(4);
  const [referral, setReferral] = useState();
  const [openWalletAlert, setOpenWalletAlert] = useState(false);

  const createFarm = async (
    farmToken,
    amountIn,
    lptoken,
    blockReward,
    startBlock,
    bonusEndBlock,
    bonus,
    withReferral
  ) => {
    if (!walletAddress) {
      setOpenWalletAlert(true);
    } else {
      const contract = new ethers.Contract(farmToken, erc20Abi, signer);
      await contract.approve(address[chain]['generator'], parseEther(amountIn));
      contract.once("Approval", async () => {
        const tx = await generatorWeb3(chain).createFarmV2(
          farmToken,
          parseEther(amountIn),
          lptoken,
          blockReward,
          startBlock,
          bonusEndBlock,
          bonus,
          withReferral
        );
        await tx.wait();
      });
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });  // connect wallet
      setWalletAddress(account);
    }
  }

  const handleReferral = () => {
    if (!walletAddress) {
      setOpenWalletAlert(true);
    } else {
      setReferral(`http://localhost:3000/create_pool/${walletAddress}`);
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
          <Header chain={chain} handleReferral={handleReferral} walletAddress={walletAddress} connectWallet={connectWallet} />
        </Box>
        <ReferralDlg referral={referral} onClose={() => setReferral()} />
        <WalletAlert open={openWalletAlert} onClose={() => setOpenWalletAlert(false)} />
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
            <Route path="/farms" element={<Farms openWalletAlert={() => setOpenWalletAlert(true)} walletAddress={walletAddress} chain={chain} />} />
            <Route path="/tokens" element={<Tokens chain={chain} walletAddress={walletAddress} />} />
            <Route path="/pools" element={<Pools chain={chain} walletAddress={walletAddress} />} />
            <Route path="/referral" element={<Referral chain={chain} walletAddress={walletAddress} />} />
            <Route path="/create_pool/:referralAddress" element={<CreatePool chain={chain} create={createFarm} walletAddress={walletAddress} />} />
          </Routes>
        </Box>
        <Footer />
      </BrowserRouter>
    </Box>
  );
}

export default App;

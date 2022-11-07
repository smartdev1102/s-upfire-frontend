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
import { useEffect, useState } from 'react';
import Referral from './components/Referral';
import ReferralDlg from './components/common/ReferralDlg';
import CreateFarm from './components/CreateFarm';
import { address, erc20Abi, signer, generatorWeb3, factory, farm, tokenContract, pair, pool, swapFactory, sfactory, spool, sgeneratorWeb3 } from './utils/ethers.util';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import WalletAlert from './components/common/WalletAlert';
import Hidden from '@mui/material/Hidden';
import Main from './components/Main';
import WalletModal from './components/common/WalletModal';
import { useWeb3React } from '@web3-react/core';
import backgroundImage from './assets/background.svg';
import { farmService, pairService, poolService } from './services/api.service';

const admin = process.env.REACT_APP_ADMIN.toLowerCase();

function App() {
  const [walletAddress, setWalletAddress] = useState();
  const [chain, setChain] = useState(Number(process.env.REACT_APP_CHAIN));
  const [referral, setReferral] = useState();
  const [openWalletAlert, setOpenWalletAlert] = useState(false);
  const [openWalletModal, setOpenWalletModal] = useState(false);

  // farm info
  const [farmLiq, setFarmLiq] = useState(0);
  const [poolLiq, setPoolLiq] = useState(0);
  const [farms, setFarms] = useState([]);
  const [farmsv3, setFarmsv3] = useState([]);
  const [farmTokens, setFarmTokens] = useState([]);
  const [stakeTokens, setStakeTokens] = useState([]);
  
  const { account, library } = useWeb3React();

  useEffect(() => {
    setWalletAddress(account);
  }, [account]);

  // pool info
  const [stakePools, setStakePools] = useState([]);
  
  // get farms
  useEffect(() => {
    setFarms([]);
    setFarmLiq(0);
    setFarmsv3([]);
    setFarmTokens([]);
    setStakeTokens([]);
    async function getFarms() {
      if (!chain || !walletAddress) return;
      const res1 = await farmService.fetchFarms(chain);
      let temp = res1;
      console.log(walletAddress.toLowerCase(), admin);
      if (walletAddress.toLowerCase() != admin) {
        temp = res1.filter(item => !item.invisible || String(item.owner).toLowerCase() === walletAddress.toLowerCase());
      }
      setFarms(temp);
      const res2 = await poolService.fetchPools(chain);
      temp = res2;
      if (walletAddress.toLowerCase() != admin) {
        temp = res2.filter(item => !item.invisible || String(item.owner).toLowerCase() === walletAddress.toLowerCase());
      }
      setStakePools(temp);      
    }
    getFarms();
  }, [chain, walletAddress]);

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
      const contract = new ethers.Contract(farmToken, erc20Abi, library.getSigner());
      await contract.approve(address[chain]['generator'], parseEther(amountIn));
      contract.once("Approval", async () => {
        const tx = await generatorWeb3(chain, library.getSigner()).createFarmV2(
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

  // create pool
  const createPool = async (rewardToken, stakeToken, apr, amountIn) => {
    const contract = new ethers.Contract(rewardToken, erc20Abi, library.getSigner());
    await contract.approve(address[chain]['sgenerator'], parseEther(amountIn));
    contract.once("Approval", async () => {
      const tx = await sgeneratorWeb3(chain, library.getSigner()).createPool(
        rewardToken,
        stakeToken,
        apr,
        parseEther(amountIn)
      );
      await tx.wait();
    });
  }

  const connectWallet = async () => {
    setOpenWalletModal(true);
    // if (typeof window.ethereum !== 'undefined') {
    //   const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });  // connect wallet
    //   setWalletAddress(account);
    // }
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
        width: '100%',
        backgroundImage: `url(${backgroundImage})`,
        fontFamily: 'Exo'
      }}
    >
      <WalletModal chain={chain} open={openWalletModal} onClose={() => setOpenWalletModal(false)} />
      <BrowserRouter>
        <Box>
          <Header chain={chain} setChain={setChain} handleReferral={handleReferral} walletAddress={walletAddress} connectWallet={connectWallet} />
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
        <Box>
          <Routes>
            <Route path='/' element={<Navigate to="/main" />} />
            <Route path='/main'
              element={
                <Main
                  openWalletAlert={() => setOpenWalletAlert(true)}
                  walletAddress={walletAddress}
                  chain={chain}
                  farms={farms}
                  farmsv3={farmsv3}
                  totalLiquidity={farmLiq}
                  farmTokens={farmTokens}
                  stakeTokens={stakeTokens}
                  stakePools={stakePools}
                  poolLiq={poolLiq}
                  setFarms={setFarms}
                  setPools={setStakePools}
                />
              }
            />
            <Route path="/referral" element={<Referral chain={chain} walletAddress={walletAddress} />} />
            <Route path="/create_pool/:referralAddress"
              element={
                <CreateFarm
                  chain={chain}
                  create={createFarm}
                  walletAddress={walletAddress}
                  createPool={createPool}
                />}
            />
            <Route
              path="/tokens"
              element={
                <Tokens
                  chain={chain}
                  walletAddress={walletAddress}
                  farmTokens={farmTokens}
                  stakeTokens={stakeTokens}
                />}
            />
          </Routes>
        </Box>
        {/* <Footer /> */}
      </BrowserRouter>
    </Box>
  );
}

export default App;

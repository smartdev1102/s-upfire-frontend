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
import { farmService, pairService } from './services/api.service';

function App() {
  const [walletAddress, setWalletAddress] = useState();
  const [chain, setChain] = useState(97);
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
  const [pairs, setPairs] = useState([]);

  const { account, library } = useWeb3React();

  useEffect(() => {
    setWalletAddress(account);
  }, [account]);

  // pool info
  const [stakePools, setStakePools] = useState([]);
  // useEffect(() => {
  //   async function getPools() {
  //     if (!chain || !walletAddress) return;
  //     const poolsLength = await sfactory(chain).poolsLength();
  //     let tempPools = [];
  //     let tempTokens = [];
  //     let pooltotal = 0;
  //     for (let i = 0; i < Number(poolsLength); i++) {
  //       const poolAddress = await sfactory(chain).poolAtIndex(i);
  //       const rewardToken = await spool(chain, poolAddress).rewardToken();
  //       const stakeToken = await spool(chain, poolAddress).token();
  //       const stakeName = await tokenContract(chain, stakeToken).name();
  //       const apr = await spool(chain, poolAddress).aprPercent();
  //       const owner = await spool(chain, poolAddress).ownAddr();
  //       const balance = await spool(chain, poolAddress).balanceOf(walletAddress);
  //       const rewardSymbol = await tokenContract(chain, rewardToken).symbol();
  //       const stakeSymbol = await tokenContract(chain, stakeToken).symbol();
  //       const liq = await tokenContract(chain, rewardToken).balanceOf(poolAddress);
  //       pooltotal = liq.add(pooltotal);
  //       setPoolLiq(formatEther(pooltotal));
  //       tempTokens.push({
  //         name: stakeName,
  //         symbol: stakeSymbol,
  //         address: stakeToken
  //       });
  //       setStakeTokens(tempTokens);
  //       tempPools.push({
  //         name: `${stakeSymbol}/${rewardSymbol}`,
  //         apr: Number(apr),
  //         owner: owner.toLowerCase(),
  //         balance: formatEther(balance),
  //         rewardToken: rewardToken,
  //         stakeToken: stakeToken
  //       });
  //       setStakePools(tempPools);
  //     }
  //   }
  //   getPools();
  // }, [chain, walletAddress]);

  // get farms
  useEffect(() => {
    setFarms([]);
    setFarmLiq(0);
    setFarmsv3([]);
    setFarmTokens([]);
    setStakeTokens([]);
    async function getFarms() {
      if (!chain || !walletAddress) return;
      const res = await farmService.fetchFarms(chain);
      setFarms(res);      
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

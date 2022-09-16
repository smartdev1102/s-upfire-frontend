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

function App() {
  const [walletAddress, setWalletAddress] = useState();
  const [chain, setChain] = useState(4);
  const [referral, setReferral] = useState();
  const [openWalletAlert, setOpenWalletAlert] = useState(false);

  // farm info
  const [farmLiq, setFarmLiq] = useState(0);
  const [farms, setFarms] = useState([]);
  const [farmsv3, setFarmsv3] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [farmTokens, setFarmTokens] = useState([]);
  const [stakeTokens, setStakeTokens] = useState([]);

  // pool info
  const [stakePools, setStakePools] = useState([]);
  useEffect(() => {
    async function getPools() {
      if (!chain || !walletAddress) return;
      const poolsLength = await sfactory(chain).poolsLength();
      let tempPools = [];
      let tempTokens = [];
      for (let i = 0; i < Number(poolsLength); i++) {
        const poolAddress = await sfactory(chain).poolAtIndex(i);
        const rewardToken = await spool(chain, poolAddress).rewardToken();
        const stakeToken = await spool(chain, poolAddress).token();
        const stakeName = await tokenContract(chain, stakeToken).name();
        const apr = await spool(chain, poolAddress).aprPercent();
        const owner = await spool(chain, poolAddress).ownAddr();
        const balance = await spool(chain, poolAddress).balanceOf(walletAddress);
        const rewardSymbol = await tokenContract(chain, rewardToken).symbol();
        const stakeSymbol = await tokenContract(chain, stakeToken).symbol();
        tempTokens.push({
          name: stakeName,
          symbol: stakeSymbol,
          address: stakeToken
        });
        setStakeTokens(tempTokens);
        tempPools.push({
          name: `${stakeSymbol}/${rewardSymbol}`,
          apr: Number(apr),
          owner: owner.toLowerCase(),
          balance: formatEther(balance),
          rewardToken: rewardToken,
          stakeToken: stakeToken
        });
        setStakePools(tempPools);
      }
    }
    getPools();
  }, [chain, walletAddress]);

  // get farms
  useEffect(() => {
    setFarms([]);
    setPairs([]);
    setFarmLiq(0);
    setFarmsv3([]);
    setFarmTokens([]);
    setStakeTokens([]);
    async function getFarms() {
      if (!chain) return;
      let farmsLength = await factory(chain).farmsLength();
      let tempFarms = [];
      let tempTotal = 0;
      let tempTokens = [];
      // get farms v2
      for (let i = 0; i < Number(farmsLength); i++) {
        const farmAddress = await factory(chain).farmAtIndex(i);
        const farminfo = await farm(chain, farmAddress).farmInfo();
        const blockReward = farminfo.blockReward;
        const farmSupply = farminfo.farmableSupply;
        tempTotal += Number(formatEther(farmSupply));
        setFarmLiq(tempTotal);
        const rewardToken = farminfo.rewardToken;
        const lptoken = farminfo.lpToken;
        const startBlock = farminfo.startBlock;
        const endBlock = farminfo.endBlock;
        const start = new Date(startBlock * 1000);
        const end = new Date(endBlock * 1000);
        const numFarmers = farminfo.numFarmers;
        const rewardSymbol = await tokenContract(chain, rewardToken).symbol();
        const token0 = await pair(chain, lptoken).token0();
        const token1 = await pair(chain, lptoken).token1();
        const symbol1 = await tokenContract(chain, token0).symbol();
        const symbol2 = await tokenContract(chain, token1).symbol();
        const lpSymbol = `${symbol1}-${symbol2}`;
        const lpName = await tokenContract(chain, lptoken).name();
        tempTokens.push({
          name: lpName,
          symbol: lpSymbol,
          address: lptoken
        })
        tempFarms.push({
          icon: '',
          name: lpSymbol,
          baseToken: rewardSymbol,
          symbol: lpSymbol,
          start: start,
          end: end,
          numFarmers: numFarmers.toString(),
          supply: formatEther(farmSupply),
          blockReward: blockReward.toNumber(),
          address: farmAddress,
          lptoken: lptoken,
          rewardToken: rewardToken,
          token0: token0,
          token1: token1
        });
        setFarms(tempFarms);
        setFarmTokens(tempTokens);
      }
      // get farms v3
      tempFarms = [];
      farmsLength = await factory(chain).farmsLengthV3();
      for (let i = 0; i < Number(farmsLength); i++) {
        const farmAddress = await factory(chain).farmAtIndex(i);
        const farminfo = await farm(chain, farmAddress).farmInfo();
        const blockReward = farminfo.blockReward;
        const farmSupply = farminfo.farmableSupply;
        tempTotal += Number(formatEther(farmSupply));
        setFarmLiq(tempTotal);
        const rewardToken = farminfo.rewardToken;
        const lptoken = farminfo.lpToken;
        const startBlock = farminfo.startBlock;
        const endBlock = farminfo.endBlock;
        const start = new Date(startBlock * 1000);
        const end = new Date(endBlock * 1000);
        const numFarmers = farminfo.numFarmers;
        const rewardSymbol = await tokenContract(chain, rewardToken).symbol();
        const token0 = await pool(chain, lptoken).token0();
        const token1 = await pool(chain, lptoken).token1();
        const symbol1 = await tokenContract(chain, token0).symbol();
        const symbol2 = await tokenContract(chain, token1).symbol();
        const lpSymbol = `${symbol1}-${symbol2}`;
        const lpName = await tokenContract(chain, lptoken).name();
        tempTokens.push({
          name: lpName,
          symbol: lpSymbol,
          address: lptoken
        });
        tempFarms.push({
          icon: '',
          name: lpSymbol,
          baseToken: rewardSymbol,
          symbol: lpSymbol,
          start: start,
          end: end,
          numFarmers: numFarmers.toString(),
          supply: formatEther(farmSupply),
          blockReward: blockReward.toNumber(),
          address: farmAddress,
          lptoken: lptoken,
          rewardToken: rewardToken,
          token0: token0,
          token1: token1
        });
        setFarmsv3(tempFarms);
        setFarmTokens(tempTokens);
      }
      const pairsLength = await swapFactory(chain).allPairsLength();
      const tempPair = [];
      for (let i = 0; i < Number(pairsLength); i++) {
        const pairAddress = await swapFactory(chain).allPairs(i);
        const token0 = await pair(chain, pairAddress).token0();
        const token1 = await pair(chain, pairAddress).token1();
        const symbol1 = await tokenContract(chain, token0).symbol();
        const symbol2 = await tokenContract(chain, token1).symbol();
        tempPair.push({
          address: pairAddress,
          symbol1: symbol1,
          symbol2: symbol2
        });
        setPairs(tempPair);
      }
    }
    getFarms();
  }, [chain]);

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

  // create pool
  const createPool = async (rewardToken, stakeToken, apr, amountIn) => {
    const contract = new ethers.Contract(rewardToken, erc20Abi, signer);
    await contract.approve(address[chain]['sgenerator'], parseEther(amountIn));
    contract.once("Approval", async () => {
      const tx = await sgeneratorWeb3(chain).createPool(
        rewardToken,
        stakeToken,
        apr,
        parseEther(amountIn)
      );
      await tx.wait();
    });
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
        width: '100%'
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
        <Box>
          <Routes>
            <Route path='/' element={<Navigate to="/farms" />} />
            <Route path="/farms"
              element={
                <Farms
                  openWalletAlert={() => setOpenWalletAlert(true)}
                  walletAddress={walletAddress} chain={chain}
                  farms={farms}
                  farmsv3={farmsv3}
                  pairs={pairs}
                  totalLiquidity={farmLiq}
                />}
            />
            <Route path="/tokens"
              element={
                <Tokens
                  chain={chain}
                  walletAddress={walletAddress}
                  farmTokens={farmTokens}
                  stakeTokens={stakeTokens}
                />}
            />
            <Route path="/pools" element={
              <Pools chain={chain}
                walletAddress={walletAddress}
                stakePools={stakePools}
              />}
            />
            <Route path="/referral" element={<Referral chain={chain} walletAddress={walletAddress} />} />
            <Route path="/create_pool/:referralAddress"
              element={
                <CreateFarm
                  chain={chain}
                  create={createFarm}
                  walletAddress={walletAddress}
                  pairs={pairs}
                  createPool={createPool}
                />}
            />
          </Routes>
        </Box>
        <Footer />
      </BrowserRouter>
    </Box>
  );
}

export default App;

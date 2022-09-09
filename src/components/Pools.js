import React, { useEffect, useState } from 'react';
import { Box, Switch, IconButton, Grid, TextField, Button } from '@mui/material';
import RoundButton from './common/RoundButton';
import SearchInput from './common/SearchInput';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';
import deeznutsIcon from '../assets/tokenIcons/deeznuts.svg';
import PoolDlg from './common/PoolDlg';
import { address, erc20Abi, signer, generatorWeb3, factory, pool, farm, tokenContract } from '../utils/ethers.util';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import FarmCard from './common/FarmCard';
import FarmCardV3 from './common/FarmCardV3';


const Pools = ({ chain, walletAddress }) => {
  // const [activeTab, setActiveTab] = useState('mining');
  const [stakePools, setStakePools] = useState([]);
  const [openDlg, setOpenDlg] = useState(false);
  const [amountIn, setAmountIn] = useState('0');
  const [amountOut, setAmountOut] = useState('0');
  const [openIndex, setOpenIndex] = useState([]);

  const [selectedFarm, setSelectedFarm] = useState();

  useEffect(() => {
    async function getPools() {
      if (!walletAddress) return;
      const farmsLength = await factory(chain).farmsLengthV3();
      let tempFarms = [];
      for (let i = 0; i < Number(farmsLength); i++) {
        const farmAddress = await factory(chain).farmAtIndexV3(i);
        const farmInfo = await farm(chain, farmAddress).farmInfo();
        const blockReward = farmInfo.blockReward;
        const farmSupply = farmInfo.farmableSupply;
        const rewardToken = farmInfo.rewardToken;
        const lptoken = farmInfo.lpToken;
        const startBlock = farmInfo.startBlock;
        const endBlock = farmInfo.endBlock;
        const start = new Date(startBlock * 1000);
        const end = new Date(endBlock * 1000);
        const numFarmers = farmInfo.numFarmers;
        const rewardSymbol = await tokenContract(chain, rewardToken).symbol();
        const token0 = await pool(chain, lptoken).token0();
        const token1 = await pool(chain, lptoken).token1();
        const symbol1 = await tokenContract(chain, token0).symbol();
        const symbol2 = await tokenContract(chain, token1).symbol();
        const lpSymbol = `${symbol1}-${symbol2}`;
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
        setStakePools(tempFarms);
      }
    }
    getPools();
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
    const contract = new ethers.Contract(farmToken, erc20Abi, signer);
    await contract.approve(address[chain]['generator'], parseEther(amountIn));
    contract.once("Approval", async () => {
      const tx = await generatorWeb3(chain).createFarmV3(
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
      setOpenDlg(false);
    });
  }

  
  const handleOpenIndex = (i) => {
    const index = openIndex.findIndex(ind=>ind===i);
    let temp = [...openIndex];
    if(index === -1) {
      temp.push(i);
      setOpenIndex(temp);
    } else {
      temp.splice(index, 1);
      setOpenIndex(temp);
    }
  }

 
  return walletAddress && (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <PoolDlg
        open={openDlg}
        onClose={() => setOpenDlg(false)}
        chain={chain}
        walletAddress={walletAddress}
        create={createFarm}
      />
      <Box
        sx={{
          width: '1366px',
          bgcolor: '#010621',
          minHeight: '200px',
          p: '20px'
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: '#030930',
            p: '30px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            {/* <Box>
              <RoundButton onClick={() => setActiveTab('mining')} color={activeTab === 'mining' ? 'primary' : 'secondary'} variant='contained'>Liquidity mining</RoundButton>
            </Box> */}
            <Box>
              <RoundButton color='secondary' sx={{ width: '150px' }} variant='contained'>Staking Pools</RoundButton>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'secondary.main',
                px: '20px',
                borderRadius: '20px'
              }}
            >
              <Switch />
              <Box>My Pools</Box>
            </Box>
            <Box>
              <RoundButton onClick={() => setOpenDlg(true)} variant='contained'>create pool</RoundButton>
            </Box>
            <Box
              sx={{ position: 'relative', width: '300px' }}
            >
              <SearchInput
                sx={{
                  position: 'absolute'
                }}
                placeholder='Search by name, symbol, address'
              />
              <IconButton
                sx={{ position: 'absolute', right: '0px', top: '4px' }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ my: '20px', color: 'primary.main', fontWeight: 'bold', p: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                #
              </Grid>
              <Grid item xs={4}>
                Pool
              </Grid>
              <Grid item xs={2}>
                APR
              </Grid>
              <Grid item xs={4}>
                Balance
              </Grid>
            </Grid>
          </Box>
          {/* pools */}
          <Box>
            {
              stakePools.map((pool, i) => (
                <FarmCardV3 key={i} setSelectedFarm={setSelectedFarm} chain={chain} farmInfo={pool} />
              ))
            }
          </Box>
        </Box>
      </Box>
    </Box >
  );
}

export default Pools;
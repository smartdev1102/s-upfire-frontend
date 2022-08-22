import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import RoundButton from '../common/RoundButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Card } from '@mui/material';
import Pagination from '@mui/material/Pagination';

import dnxcIcon from '../../assets/tokenIcons/dnxc.svg';

import CreateFarm from './CreateFarm';
import { address, erc20Abi, factory, farm, generator, generatorWeb3, pair, signer, swapFactory, tokenContract } from '../../utils/ethers.util';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { BigNumber, ethers } from 'ethers';
import FarmCard from '../common/FarmCard';
import StakeDlg from '../common/StakeDlg';

const Farms = ({walletAddress, chain}) => {
  const [totalLiquidity, setTotalLiquidity] = useState(0);
  const [openCreateFarm, setOpenCreateFarm] = useState(false);
  const [farms, setFarms] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState();


  // get farms
  useEffect(() => {
    async function getFarms () {
      if(!chain) return;
      const farmsLength = await factory(chain).farmsLength();
      let tempFarms = [];
      let tempTotal = 0;
      for (let i = 0; i < Number(farmsLength); i++) {
        const farmAddress = await factory(chain).farmAtIndex(i);
        const farmInfo = await farm(chain, farmAddress).farmInfo();
        const farmSupply = farmInfo.farmableSupply;
        tempTotal += Number(formatEther(farmSupply));
        setTotalLiquidity(tempTotal);
        const rewardToken = farmInfo.rewardToken;
        const lptoken = farmInfo.lpToken;
        const startBlock = farmInfo.startBlock;
        const endBlock = farmInfo.endBlock;
        const start = new Date(startBlock * 1000);
        const end = new Date(endBlock * 1000);
        const numFarmers = farmInfo.numFarmers;
        const rewardSymbol = await tokenContract(chain, rewardToken).symbol();
        const token0 = await pair(chain, lptoken).token0();
        const token1 = await pair(chain, lptoken).token1();
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
          address: farmAddress,
          lptoken: lptoken,
          rewardToken: rewardToken,
          token0: token0,
          token1: token1
        });
        setFarms(tempFarms);
      }
      const pairsLength = await swapFactory(chain).allPairsLength();
      let tempPair = [];
      for(let i = 0; i < Number(pairsLength); i++) {
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
    const contract = new ethers.Contract(farmToken, erc20Abi, signer);
    await contract.approve(address[chain]['generator'], parseEther(amountIn));
    contract.once("Approval", async() => {
      const tx = await generatorWeb3(chain).createFarm(
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
      setOpenCreateFarm(false);
    });
  }

  return (
    <Box
      sx={{
        p: '20px'
      }}
    >
      <StakeDlg onClose={()=>setSelectedFarm()} farm={selectedFarm} chain={chain} walletAddress={walletAddress} />
      {/* create farm */}
      <CreateFarm pairs={pairs} chain={chain} open={openCreateFarm} onClose={() => setOpenCreateFarm(false)} create={createFarm} walletAddress={walletAddress}/>
      {/* total farming liquidity */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(0deg, #004186 0%, #289AF7 100%)',
            borderRadius: '20px',
            height: '152px',
            width: '1366px',
            py: '20px',
            px: '80px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography variant="h2" gutterBottom component="h2">
              {`$${Math.trunc(totalLiquidity)}`}
            </Typography>
            <Box>
              <Typography variant="h6" gutterBottom component="h6">
                Total farming liquidity
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box>
            <RoundButton
              onClick={()=>setOpenCreateFarm(true)}
              sx={{
                color: 'text.primary',
                border: '1px solid white',
                width: '150px'
              }}
              variant='outlined'
            >
              Create farm
            </RoundButton>
          </Box>
          <Box>
            <RoundButton
              sx={{
                color: 'text.primary',
                border: '1px solid white',
                mx: '10px'
              }}
              variant='outlined'
            >
              <FilterAltIcon />
            </RoundButton>
          </Box>
        </Box>
      </Box>
      {/* farms */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            width: '1366px',
            minHeight: '400px'
          }}
        >
          {
            farms.map((farm, i) => (
              <FarmCard key={i} setSelectedFarm={setSelectedFarm} chain={chain} farmInfo={farm}/>
            ))
          }
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {/* <Pagination count={10} variant='outlined'/> */}
      </Box>
    </Box>
  )
}

export default Farms;
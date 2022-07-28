import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import RoundButton from '../common/RoundButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Card } from '@mui/material';
import Pagination from '@mui/material/Pagination';

import dnxcIcon from '../../assets/tokenIcons/dnxc.svg';
import farmIcon from '../../assets/icons/farm.svg';
import airdropIcon from '../../assets/icons/airdrop.svg';
import accountIcon from '../../assets/icons/account.svg';
import CreateFarm from './CreateFarm';
import { address, erc20Abi, factory, farm, generator, generatorWeb3, signer, tokenContract } from '../../utils/ethers.util';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { ethers } from 'ethers';

const Farms = ({walletAddress}) => {
  const [totalLiquidity, setTotalLiquidity] = useState(0);
  const [openCreateFarm, setOpenCreateFarm] = useState(false);
  const [farms, setFarms] = useState([]);


  // get farms
  useEffect(() => {
    async function getFarms () {
      const farmsLength = await factory.farmsLength();
      let tempFarms = [];
      for (let i = 0; i < Number(farmsLength); i++) {
        const farmAddress = await factory.farmAtIndex(i);
        const farmInfo = await farm(farmAddress).farmInfo();
        const farmSupply = farmInfo.farmableSupply;
        setTotalLiquidity(totalLiquidity + Number(formatEther(farmSupply)));
        const rewardToken = farmInfo.rewardToken;
        const lptoken = farmInfo.lpToken;
        const startBlock = farmInfo.startBlock;
        const endBlock = farmInfo.endBlock;
        const start = new Date(startBlock * 1000);
        const end = new Date(endBlock * 1000);
        const numFarmers = farmInfo.numFarmers;
        const rewardSymbol = await tokenContract(rewardToken).symbol();
        const lpSymbol = await tokenContract(lptoken).symbol();
        tempFarms = [...farms];
        tempFarms.push({
          icon: dnxcIcon,
          name: lpSymbol,
          baseToken: rewardSymbol,
          symbol: lpSymbol,
          start: start,
          end: end,
          numFarmers: numFarmers.toString(),
          supply: formatEther(farmSupply)
        });
        setFarms(tempFarms);
      }
    }
    getFarms();
  }, []);


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
    await contract.approve(address['generator'], parseEther(amountIn));
    contract.once("Approval", async() => {
      const tx = await generatorWeb3.createFarm(
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
      {/* create farm */}
      <CreateFarm open={openCreateFarm} onClose={() => setOpenCreateFarm(false)} create={createFarm} walletAddress={walletAddress}/>
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
            width: '1366px'
          }}
        >
          {
            farms.map((farm, i) => (
              <Card
                sx={{
                  p: '10px',
                  my: '10px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                key={i}
              >
                <Box>
                  <img src={dnxcIcon} />
                </Box>
                <Box
                  sx={{
                    mx: '50px'
                  }}
                >
                  <Box>
                    <Typography variant="h4" gutterBottom component="h4">
                      {`Farm ${farm.name.toUpperCase()}`}
                    </Typography>
                  </Box>
                  <Box>
                    {`${farm.symbol} / ${farm.baseToken}`}
                  </Box>
                  <Box>
                    {
                      farm.start >  new Date() && (
                        <Box sx={{ color: 'skyBlue' }}>
                          Farming is not started.
                        </Box>
                      )
                    }
                    {
                      (farm.start < new Date() && farm.end > new Date()) && (
                        <Box sx={{ color: 'skyBlue' }}>
                          Farming is active.
                        </Box>
                      )
                    }
                    {
                      farm.bonusEndBlock <  new Date() && (
                        <Box sx={{ color: 'skyBlue' }}>
                          Farming has finished.
                        </Box>
                      )
                    }
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Box sx={{ mx: '30px' }}>
                  <img src={farmIcon} />
                </Box>
                <Box sx={{ mx: '30px', display: 'flex' }}>
                  <Box sx={{ mx: '10px' }}>
                    <img src={airdropIcon} />
                  </Box>
                  <Box>
                    {Math.trunc(farm.supply)}
                  </Box>
                </Box>
                <Box sx={{ mx: '30px', display: 'flex' }}>
                  <Box sx={{ mx: '10px' }}>
                    <img style={{height: '20px'}} src={accountIcon} />
                  </Box>
                  <Box>
                    {farm.numFarmers}
                  </Box>
                </Box>
              </Card>
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
        <Pagination count={10} variant='outlined'/>
      </Box>
    </Box>
  )
}

export default Farms;
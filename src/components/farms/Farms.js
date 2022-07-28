import React, { useState } from 'react';
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
import { address, erc20Abi, generator, generatorWeb3, signer } from '../../utils/ethers.util';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { ethers } from 'ethers';
const farmArray = [
  {
    icon: dnxcIcon,
    name: 'dnxc',
    baseToken: 'USDC',
    symbol: 'DERC',
    status: 'end',
    liquidity: '1.12M',
    holders: 42
  },
  {
    icon: dnxcIcon,
    name: 'dnxc',
    baseToken: 'USDC',
    symbol: 'DERC',
    status: 'end',
    liquidity: '1.12M',
    holders: 42
  },
  {
    icon: dnxcIcon,
    name: 'dnxc',
    baseToken: 'USDC',
    symbol: 'DERC',
    status: 'end',
    liquidity: '1.12M',
    holders: 42
  },
  {
    icon: dnxcIcon,
    name: 'dnxc',
    baseToken: 'USDC',
    symbol: 'DERC',
    status: 'end',
    liquidity: '1.12M',
    holders: 42
  },
  {
    icon: dnxcIcon,
    name: 'dnxc',
    baseToken: 'USDC',
    symbol: 'DERC',
    status: 'end',
    liquidity: '1.12M',
    holders: 42
  },
]
const Farms = ({walletAddress}) => {
  const [totalLiquidity, setTotalLiquidity] = useState('2.98M');
  const [openCreateFarm, setOpenCreateFarm] = useState(false);


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
    const balance = await contract.balanceOf(walletAddress)
    await contract.approve(address['generator'], balance);
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
              {`$${totalLiquidity}`}
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
            farmArray.map((farm, i) => (
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
                      farm.status === 'end' && (
                        <Box sx={{ color: 'skyBlue' }}>
                          Farming has ended
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
                    {farm.liquidity}
                  </Box>
                </Box>
                <Box sx={{ mx: '30px', display: 'flex' }}>
                  <Box sx={{ mx: '10px' }}>
                    <img style={{height: '20px'}} src={accountIcon} />
                  </Box>
                  <Box>
                    {farm.holders}
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
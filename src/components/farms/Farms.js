import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import RoundButton from '../common/RoundButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Hidden, Menu, MenuItem } from '@mui/material';
// import Pagination from '@mui/material/Pagination';

import CreateFarm from './CreateFarm';
import { address, erc20Abi, generatorWeb3, signer } from '../../utils/ethers.util';
import { parseEther } from 'ethers/lib/utils';
import { ethers } from 'ethers';
import FarmCard from '../common/FarmCard';
import StakeDlg from '../common/StakeDlg';
import FarmCardV3 from '../common/FarmCardV3';

const Farms = ({ walletAddress, chain, openWalletAlert, farms, farmsv3, pairs, totalLiquidity }) => {
  const [openCreateFarm, setOpenCreateFarm] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState();
  const open = Boolean(anchorEl);


  const handleOpenCreateFarm = () => {
    if (!walletAddress) {
      openWalletAlert();
    } else {
      setOpenCreateFarm(true);
    }
  }

  const handleFilter = (filterValue) => {
    setFilter(filterValue);
    setAnchorEl(null);
  }

  // sort 
  useEffect(() => {
    if (filter === 'apr') {
      farms.sort((a, b) => {
        if (a.blockReward < b.blockReward) { return -1; }
        if (a.blockReward > b.blockReward) { return 1; }
        return 0;
      });
      farmsv3.sort((a, b) => {
        if (a.blockReward < b.blockReward) { return -1; }
        if (a.blockReward > b.blockReward) { return 1; }
        return 0;
      })
    }
    if (filter === 'liq') {
      farms.sort((a, b) => {
        if (a.supply < b.supply) { return -1; }
        if (a.supply > b.supply) { return 1; }
        return 0;
      });
      farmsv3.sort((a, b) => {
        if (a.supply < b.supply) { return -1; }
        if (a.supply > b.supply) { return 1; }
        return 0;
      });
    }
    if (filter === 'alpha') {
      farms.sort((a, b) => {
        if (a.symbol < b.symbol) { return -1; }
        if (a.symbol > b.symbol) { return 1; }
        return 0;
      })
      farmsv3.sort((a, b) => {
        if (a.symbol < b.symbol) { return -1; }
        if (a.symbol > b.symbol) { return 1; }
        return 0;
      })
    }
  }, [filter]);


  const createFarm = async (
    farmToken,
    amountIn,
    lptoken,
    blockReward,
    startBlock,
    bonusEndBlock,
    bonus,
    isV3
  ) => {
    const contract = new ethers.Contract(farmToken, erc20Abi, signer);
    await contract.approve(address[chain]['generator'], parseEther(amountIn));
    contract.once("Approval", async () => {
      if (isV3) {
        const tx = await generatorWeb3(chain).createFarmV3(
          farmToken,
          parseEther(amountIn),
          lptoken,
          blockReward,
          startBlock,
          bonusEndBlock,
          bonus,
          false
        );
        await tx.wait();
      } else {
        const tx = await generatorWeb3(chain).createFarmV2(
          farmToken,
          parseEther(amountIn),
          lptoken,
          blockReward,
          startBlock,
          bonusEndBlock,
          bonus,
          false
        );
        await tx.wait();
      }
      setOpenCreateFarm(false);
    });
  }

  return (
    <Box
      sx={{
        p: '1%'
      }}
    >
      <StakeDlg onClose={() => setSelectedFarm()} farm={selectedFarm} chain={chain} walletAddress={walletAddress} />
      {/* create farm */}
      <CreateFarm pairs={pairs} chain={chain} open={openCreateFarm} onClose={() => setOpenCreateFarm(false)} create={createFarm} walletAddress={walletAddress} />
      {/* total farming liquidity */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          
            <Box
              sx={{
                width: '1366px'
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(0deg, #004186 0%, #289AF7 100%)',
                  borderRadius: '20px',
                  py: '2%',
                  px: '8%',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <Box>
                  <Box>
                    <Typography sx={{ mb: '0px' }} variant="h4" gutterBottom component="h4">
                      {!!totalLiquidity ? `$${Math.trunc(totalLiquidity)}` : '0'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom component="h6">
                      Total farming liquidity
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Box>
                  <RoundButton
                    onClick={handleOpenCreateFarm}
                    sx={{
                      color: 'text.primary',
                      border: '1px solid white',
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
                      mx: '10%'
                    }}
                    variant='outlined'
                    id="filter-button"
                    aria-controls={open ? 'filter-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={e => setAnchorEl(e.currentTarget)}
                  >
                    <FilterAltIcon />
                  </RoundButton>
                  <Menu
                    id="filter-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    MenuListProps={{
                      'aria-labelledby': 'filter-button',
                    }}
                    PaperProps={{
                      sx: {

                      }
                    }}
                  >
                    <MenuItem onClick={() => handleFilter('apr')}>
                      APR
                    </MenuItem>
                    <MenuItem onClick={() => handleFilter('liq')}>
                      Liquidity
                    </MenuItem>
                    <MenuItem onClick={() => handleFilter('alpha')}>
                      Alphabetic
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
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
            minHeight: '60vh'
          }}
        >
          {
            farms.map((farm, i) => (
              <FarmCard key={i} setSelectedFarm={setSelectedFarm} chain={chain} farmInfo={farm} />
            ))
          }
          {
            farmsv3.map((farm, i) => (
              <FarmCardV3 key={i} setSelectedFarm={setSelectedFarm} chain={chain} farmInfo={farm} />
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
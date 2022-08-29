import React, { useEffect, useState } from 'react';
import { Box, Switch, IconButton, Grid } from '@mui/material';
import RoundButton from './common/RoundButton';
import SearchInput from './common/SearchInput';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';
import deeznutsIcon from '../assets/tokenIcons/deeznuts.svg';
import PoolDlg from './common/PoolDlg';
import { address, erc20Abi, pool, poolFactory, poolGeneratorWeb3, signer, tokenContract } from '../utils/ethers.util';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';


const Pools = ({chain, walletAddress}) => {
  // const [activeTab, setActiveTab] = useState('mining');
  const [stakePools, setStakePools] = useState([]);
  const [openDlg, setOpenDlg] = useState(false);

  useEffect(() => {
    async function getPools() {
      if(!walletAddress) return;
      const poolsLength = await poolFactory(chain).poolsLength();
      let tempPools = [];
      for(let i = 0; i < Number(poolsLength); i++) {
        const poolAddress = await poolFactory(chain).poolAtIndex(i);
        const rewardToken = await pool(chain, poolAddress).rewardToken();
        const stakeToken = await pool(chain, poolAddress).token();
        const apr = await pool(chain, poolAddress).aprPercent();
        const owner = await pool(chain, poolAddress).ownAddr();
        const balance = await pool(chain, poolAddress).balanceOf(walletAddress);
        const rewardSymbol = await tokenContract(chain, rewardToken).symbol();
        const stakeSymbol = await tokenContract(chain, stakeToken).symbol();
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

  const createPool = async (rewardToken, stakeToken, apr, amountIn) => {
    const contract = new ethers.Contract(rewardToken, erc20Abi, signer);
    await contract.approve(address[chain]['poolGenerator'], parseEther(amountIn));
    contract.once("Approval", async () => {
      const tx = await poolGeneratorWeb3(chain).createPool(
        rewardToken,
        stakeToken,
        apr,
        parseEther(amountIn)
      );
      await tx.wait();
      setOpenDlg(false);
    });
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
        onClose={()=>setOpenDlg(false)}
        chain={chain}
        walletAddress={walletAddress}
        create={createPool}
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
              <RoundButton onClick={()=>setOpenDlg(true)} variant='contained'>create pool</RoundButton>
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
                <Box
                  key={i}
                  sx={{
                    bgcolor: 'background.paper',
                    my: '10px',
                    p: '20px',
                    borderRadius: '20px'
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={2}>
                      {i + 1}
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <img style={{ marginRight: '10px' }} src={deeznutsIcon} /> */}
                        {pool.name}
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      {`${pool.apr}%`}
                    </Grid>
                    <Grid item xs={4}>
                      {pool.balance}
                    </Grid>
                  </Grid>
                </Box>
              ))
            }
          </Box>
        </Box>
      </Box>
    </Box >
  );
}

export default Pools;
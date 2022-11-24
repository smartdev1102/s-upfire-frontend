import React, { useEffect, useState } from 'react';
import { Box, Switch, IconButton, Grid, TextField, Button, FormGroup, FormControlLabel, Typography } from '@mui/material';
import RoundButton from './common/RoundButton';
import SearchInput from './common/SearchInput';
import SearchIcon from '@mui/icons-material/Search';
import PoolDlg from './common/PoolDlg';
import { address, erc20Abi, generatorWeb3, factory, pool, farm, tokenContract, sgeneratorWeb3, spoolWeb3, sfactory, tokenWeb3 } from '../utils/ethers.util';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import Hidden from '@mui/material/Hidden';
import { useWeb3React } from '@web3-react/core';
import { poolService } from '../services/api.service';

const admin = process.env.REACT_APP_ADMIN.toLowerCase();

const Pools = ({ chain, walletAddress, stakePools, openWalletAlert, setPools }) => {
  // const [activeTab, setActiveTab] = useState('mining');
  const [openDlg, setOpenDlg] = useState(false);
  const [amountIn, setAmountIn] = useState('0');
  const [amountOut, setAmountOut] = useState('0');
  const [openIndex, setOpenIndex] = useState([]);
  const [isMyPool, setIsMyPool] = useState(false);
  const [filterdPools, setFilteredPools] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  
  const handleVisible = async (id, invisible) => {
    await poolService.setVisible({
      id: id,
      invisible: invisible
    });
    const index = stakePools.findIndex(item => item._id === id);
    let temp = [...stakePools];
    temp[index].invisible = invisible;
    setPools(temp);
  }



  useEffect(() => {
    if (isMyPool) {
      const temp = stakePools.filter(pool => Number(pool.balance) > 0);
      setFilteredPools(temp);
    } else {
      setFilteredPools(stakePools);
    }
  }, [isMyPool, stakePools]);
  useEffect(() => {
    if (!!searchKey) {
      const temp = stakePools.filter(pool => pool.name.includes(searchKey));
      setFilteredPools(temp);
    } else {
      setFilteredPools(stakePools);
    }
  }, [searchKey])

  const { library } = useWeb3React();

  const handleCreatePool = () => {
    if (!walletAddress) {
      openWalletAlert();
    } else {
      setOpenDlg(true);
    }
  }

  const createPool = async (rewardToken, stakeToken, apr, amountIn) => {
    const allowance = await tokenContract(chain, rewardToken).allowance(walletAddress, address[chain][0]['sgenerator']);
    if (allowance < parseEther(amountIn)) {
      const tx = await tokenWeb3(rewardToken, library.getSigner()).approve(address[chain][0]['sgenerator'], parseEther(amountIn));
      await tx.wait();
    }
    const tx = await sgeneratorWeb3(chain, library.getSigner()).createPool(
      rewardToken,
      stakeToken,
      apr,
      parseEther(amountIn)
    );
    await tx.wait();

    const length = await sfactory(chain).poolsLength();
    const poolAddress = await sfactory(chain).poolAtIndex(Number(length) - 1);
    const rewardSymbol = await tokenContract(chain, rewardToken).symbol();
    const stakeSymbol = await tokenContract(chain, stakeToken).symbol();
    const res = await poolService.createPool({
      name: `${stakeSymbol}/${rewardSymbol}`,
      apr: Number(apr),
      owner: walletAddress,
      rewardToken: rewardToken,
      stakeToken: stakeToken,
      address: poolAddress,
      chain: chain
    });
    setPools([...stakePools, res]);
    setOpenDlg(false);
  }


  const handleOpenIndex = (i) => {
    const index = openIndex.findIndex(ind => ind === i);
    let temp = [...openIndex];
    if (index === -1) {
      temp.push(i);
      setOpenIndex(temp);
    } else {
      temp.splice(index, 1);
      setOpenIndex(temp);
    }
  }


  const stake = async (tokenAddress, poolAddress) => {
    await tokenContract(chain, tokenAddress).approve(poolAddress, parseEther(amountIn));
    tokenContract(chain, tokenAddress).once("Approval", async () => {
      const tx = await spoolWeb3(poolAddress, library.getSigner()).stake(parseEther(amountIn));
      await tx.wait();
      window.alert("staked");
    });
  }


  const unstake = async (poolAddress) => {
    const tx = await spoolWeb3(poolAddress, library.getSigner()).unstake(parseEther(amountOut));
    await tx.wait();
    window.alert('unstake');
  }

  const harvest = async (poolAddress) => {
    const tx = await spoolWeb3(poolAddress, library.getSigner()).harvest();
    await tx.wait();
    window.alert('harvest');
  }

  return (
    <Box
      sx={{
        p: '1%'
      }}
    >
      <PoolDlg
        open={openDlg}
        onClose={() => setOpenDlg(false)}
        chain={chain}
        walletAddress={walletAddress}
        create={createPool}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            px: '40px',
            py: '10px',
            background: '#001126',
            borderRadius: '20px'
          }}
        >
          <Hidden smDown>
            <Typography sx={{ mt: '5px' }} variant="h6" gutterBottom component="h6">
              Total Pool liquidity
            </Typography>
          </Hidden>
          <Typography sx={{ mx: '5px', mt: '10px' }} variant="h5" gutterBottom component="h5">
            
          </Typography>
          <Hidden smDown>
            <Box>
              <FormGroup sx={{ mx: '10px' }}>
                <FormControlLabel control={<Switch checked={isMyPool} onChange={e => setIsMyPool(e.target.checked)} />} label="My pools" />
              </FormGroup>
            </Box>
          </Hidden>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box>
            <RoundButton onClick={handleCreatePool} variant='contained'>
              <Typography variant='h3' component='h3'>
                Create Pool
              </Typography>
            </RoundButton>
          </Box>
          <Hidden mdDown>
            <SearchInput
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
              placeholder='Search by name, symbol'
            />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Hidden>
        </Box>
      </Box>
      <Box
        sx={{
          mt: '10px',
          p: '20px',
          borderRadius: '20px',
          cursor: 'pointer',
          background: '#001126'
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Typography variant='h3' component='h3'>
              #
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant='h3' component='h3'>
              name
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant='h3' component='h3'>
              APR
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant='h3' component='h3'>
              Liquidity
            </Typography>
          </Grid>
        </Grid>
      </Box>
      {/* pools */}
      <Box
        sx={{
          minHeight: '60vh',
          width: '100%'
        }}
      >
        {
          filterdPools.map((pool, i) => (
            <Box
              key={i}
            >
              <Box
                onClick={() => handleOpenIndex(i)}
                sx={{
                  bgcolor: 'background.paper',
                  mt: '10px',
                  p: '20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  border: '1px solid white',
                  alignItems: 'center'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <Typography variant='h3' component='h3'>
                      {i + 1}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant='h3' component='h3'>
                      {pool.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    {`${pool.apr}%`}
                  </Grid>
                  <Grid item xs={4}>
                    {pool.balance}
                  </Grid>
                </Grid>
                {
                  openIndex.includes(i) && (
                    <Box
                      sx={{
                        background: '#020826',
                        px: '30px',
                        py: '10px'
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Grid container spacing={2}>
                            <Grid item xs={8}>
                              <TextField size='small' fullWidth value={amountIn} onChange={e => setAmountIn(e.target.value)} label="Stake Amount" />
                            </Grid>
                            <Grid item xs={4}>
                              <Button fullWidth onClick={() => stake(pool.rewardToken, pool.address)} variant='contained'>Stake</Button>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Grid container spacing={2}>
                            <Grid item xs={8}>
                              <TextField size='small' fullWidth value={amountOut} onChange={e => setAmountOut(e.target.value)} label="Unstake Amount" />
                            </Grid>
                            <Grid item xs={4}>
                              <Button fullWidth onClick={() => unstake(pool.address)} variant='contained'>Unstake</Button>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Button fullWidth onClick={() => harvest(pool.address)} variant='contained'>Harvest</Button>
                            </Grid>
                            <Grid item xs={8}>
                              {
                                (String(walletAddress).toLowerCase() === admin || String(walletAddress).toLowerCase() === pool.owner.toLowerCase()) && (
                                  <Box>
                                    <FormControlLabel control={<Switch checked={!pool.invisible} onChange={e => handleVisible(pool._id, !e.target.checked)} />} label="show/hide" />
                                  </Box>
                                )
                              }
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  )
                }
              </Box>
            </Box>
          ))
        }
      </Box>
    </Box >
  );
}

export default Pools;
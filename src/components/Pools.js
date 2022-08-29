import React, { useEffect, useState } from 'react';
import { Box, Switch, IconButton, Grid, TextField, Button } from '@mui/material';
import RoundButton from './common/RoundButton';
import SearchInput from './common/SearchInput';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';
import deeznutsIcon from '../assets/tokenIcons/deeznuts.svg';
import PoolDlg from './common/PoolDlg';
import { address, erc20Abi, pool, poolFactory, poolGeneratorWeb3, poolWeb3, signer, tokenContract, tokenWeb3 } from '../utils/ethers.util';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';


const Pools = ({ chain, walletAddress }) => {
  // const [activeTab, setActiveTab] = useState('mining');
  const [stakePools, setStakePools] = useState([]);
  const [openDlg, setOpenDlg] = useState(false);
  const [amountIn, setAmountIn] = useState('0');
  const [amountOut, setAmountOut] = useState('0');
  const [openIndex, setOpenIndex] = useState([]);

  useEffect(() => {
    async function getPools() {
      if (!walletAddress) return;
      const poolsLength = await poolFactory(chain).poolsLength();
      let tempPools = [];
      for (let i = 0; i < Number(poolsLength); i++) {
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
          stakeToken: stakeToken,
          address: poolAddress
        });
        setStakePools(tempPools);
      }
    }
    getPools();
  }, [chain, walletAddress]);

  const stake = async (tokenAddress, poolAddress) => {
    await tokenWeb3(tokenAddress).approve(poolAddress, parseEther(amountIn));
    tokenWeb3(tokenAddress).once("Approval", async () => {
      const tx = await poolWeb3(poolAddress).stake(parseEther(amountIn));
      await tx.wait();
      window.alert("staked");
    });
  }

  const unstake = async (poolAddress) => {
    const tx = await poolWeb3(poolAddress).unstake(parseEther(amountOut));
    await tx.wait();
    window.alert('unstake');
  }

  const harvest = async (poolAddress) => {
    const tx = await poolWeb3(poolAddress).harvest();
    await tx.wait();
    window.alert('harvest');
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
        onClose={() => setOpenDlg(false)}
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
                <Box
                  key={i}
                >
                  <Box
                    onClick={()=>handleOpenIndex(i)}
                    sx={{
                      bgcolor: 'background.paper',
                      mt: '10px',
                      p: '20px',
                      borderRadius: '20px',
                      cursor: 'pointer'
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
                  {
                    openIndex.includes(i) && (
                      <Box
                        sx={{
                          background: '#020826',
                          px: '30px',
                          py: '10px'
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Box>
                            <TextField value={amountIn} onChange={e=>setAmountIn(e.target.value)} label="Stake Amount" />
                          </Box>
                          <Box sx={{mx: '20px'}}>
                            <Button onClick={()=>stake(pool.stakeToken, pool.address)} variant='contained'>Stake</Button>
                          </Box>
                          <Box>
                            <TextField value={amountOut} onChange={e=>setAmountOut(e.target.value)} label="Unstake Amount" />
                          </Box>
                          <Box sx={{mx: '20px'}}>
                            <Button onClick={()=>unstake(pool.address)} variant='contained'>Unstake</Button>
                          </Box>
                          <Box sx={{mx: '40px'}}>
                            <Button onClick={()=>harvest(pool.address)} variant='contained'>Harvest</Button>
                          </Box>
                        </Box>
                      </Box>
                    )
                  }
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
import { Box, Button, Card, Grid, IconButton, TextField, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { address, coinSymbols, farmWeb3, routerWeb3, swapFactories, tokenContract, tokenWeb3 } from '../../utils/ethers.util';
import { networks } from '../../utils/network.util';
import { Close } from '@mui/icons-material';

const StakeDlg = ({ farm, chain, walletAddress, onClose }) => {
  const [balance0, setBalance0] = useState('0');
  const [balance1, setBalance1] = useState('0');
  const [symbol0, setSymbol0] = useState('');
  const [symbol1, setSymbol1] = useState('');
  const [isEther, setIsEther] = useState();
  const [amountIn0, setAmountIn0] = useState('0');
  const [amountIn1, setAmountIn1] = useState('0');
  const [isApproved, setIsApproved] = useState();
  const [lpBalance, setLpBalance] = useState('0');
  const [amountIn, setAmountIn] = useState('0');


  useEffect(() => {
    async function getPairTokens() {
      if (!farm || !walletAddress) return;
      if (farm.token0.toLowerCase() == address[chain]['wether'].toLowerCase()) {
        const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
        const balance = await provider.getBalance(walletAddress);
        setBalance0(balance);
        setSymbol0(coinSymbols[chain]);
        setIsEther(0);
      } else {
        const balance = await tokenContract(chain, farm.token0).balanceOf(walletAddress);
        const symbol = await tokenContract(chain, farm.token0).symbol();
        setBalance0(balance);
        setSymbol0(symbol);
      }
      if (farm.token1.toLowerCase() == address[chain]['wether'].toLowerCase()) {
        const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
        const balance = await provider.getBalance(walletAddress);
        setBalance1(balance);
        setSymbol1(coinSymbols[chain]);
        setIsEther(1);
      } else {
        const balance = await tokenContract(chain, farm.token1).balanceOf(walletAddress);
        const symbol = await tokenContract(chain, farm.token1).symbol();
        setBalance1(balance);
        setSymbol1(symbol);
      }
      const balance = await tokenContract(chain, farm.lptoken).balanceOf(walletAddress);
      setLpBalance(balance);
    }
    getPairTokens();
  }, [farm]);

  const handleApprove = async () => {
    if (isEther !== 0) {
      const tx = await tokenWeb3(farm.token0).approve(swapFactories[chain]['router'], parseEther(amountIn0));
      await tx.wait();
    }
    if (isEther !== 1) {
      const tx = await tokenWeb3(farm.token1).approve(swapFactories[chain]['router'], parseEther(amountIn1));
      await tx.wait();
    }
    setIsApproved(true);
  }

  const addLiquidity = async () => {
    const deadline = Math.round(Date.now() / 1000) + 10;
    if (isEther == 0) {
      const tx = await routerWeb3(chain).addLiquidityETH(
        farm.token1,
        parseEther(amountIn1),
        0,
        0,
        walletAddress,
        deadline,
        { value: parseEther(amountIn0) }
      );
      await tx.wait();
    } else if (isEther == 1) {
      const tx = await routerWeb3(chain).addLiquidityETH(
        farm.token0,
        parseEther(amountIn0),
        0,
        0,
        walletAddress,
        deadline,
        { value: parseEther(amountIn1) }
      );
      await tx.wait();
    } else {
      const tx = await routerWeb3(chain).addLiquidity(
        farm.token0,
        farm.token1,
        parseEther(amountIn0),
        parseEther(amountIn1),
        0,
        0,
        walletAddress,
        deadline,
      );
      await tx.wait();
    }
  }

  const stake = async () => {
    await tokenWeb3(farm.lptoken).approve(farm.address, parseEther(amountIn));
    tokenWeb3(farm.lptoken).once("Approval", async () => {
      const tx = await farmWeb3.apply(farm.address).deposit(parseEther(amountIn));
      await tx.wait();
      window.alert("Deposit.");
    });
    onClose();
  }

  return !!farm && (
    <Card
      sx={{
        position: 'absolute',
        left: '50%',
        background: 'rgb(0,36,48)',
        padding: '30px',
        transform: 'translate(-50%, -50%)',
        width: '650px',
        borderRadius: '20px'
      }}
    >
      <Box
        sx={{
          display: 'flex'
        }}
      >
        <Box sx={{ flexGrow: 1 }}></Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <Box>
        <Box sx={{ m: '10px' }}>
          <Typography variant='h6' component='h6'>
            Add Liquidity
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid item xs={4} >
            <Box
              sx={{
                display: 'flex'
              }}
            >
              Balance: {Number(formatEther(balance0)).toFixed(1)} {symbol0}
              <Box sx={{ flexGrow: 1 }}></Box>
              <button onClick={() => setAmountIn0(formatEther(balance0))} style={{ cursor: 'pointer', background: '#2494F3', color: 'white', border: 'none' }}>Max</button>
            </Box>
            <Box>
              <TextField value={amountIn0} onChange={e => setAmountIn0(e.target.value)} fullWidth />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: 'flex'
              }}
            >
              Balance: {Number(formatEther(balance1)).toFixed(1)} {symbol1}
              <Box sx={{ flexGrow: 1 }}></Box>
              <button onClick={() => setAmountIn1(formatEther(balance1))} style={{ cursor: 'pointer', background: '#2494F3', color: 'white', border: 'none' }}>Max</button>
            </Box>
            <Box>
              <TextField value={amountIn1} onChange={e => setAmountIn1(e.target.value)} fullWidth />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box>
              {
                isApproved ? (
                  <Button onClick={addLiquidity} sx={{ mt: '20px' }} variant='contained'>Add liquidity</Button>
                ) : (
                  <Button onClick={handleApprove} sx={{ mt: '20px' }} variant='contained'>Approve</Button>
                )
              }
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ m: '10px' }}>
          <Typography variant='h6' component='h6'>
            Stake
          </Typography>
          <Grid container spacing={2} sx={{alignItems: 'center'}}>
            <Grid item xs={6}>
              <Box sx={{display: 'flex'}}>
                Balance: { Number(formatEther(lpBalance)).toFixed(1)}
                <Box sx={{flexGrow: 1}}></Box>
                <button onClick={() => setAmountIn(formatEther(lpBalance))} style={{ cursor: 'pointer', background: '#2494F3', color: 'white', border: 'none' }}>Max</button>
              </Box>
              <TextField value={amountIn} onChange={e=>setAmountIn(e.target.value)} fullWidth/>
            </Grid>
            <Grid item xs={6}>
              <Button onClick={stake} sx={{mt: '20px'}} variant='contained'>Stake</Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  );
}

export default StakeDlg;
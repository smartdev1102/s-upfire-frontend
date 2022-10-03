import React, { useState } from 'react';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import { Button, Card, Grid, TextField } from '@mui/material';
import farmIcon from '../../assets/icons/farm.svg';
import airdropIcon from '../../assets/icons/airdrop.svg';
import accountIcon from '../../assets/icons/account.svg';
import { farm, farmWeb3, tokenContract, tokenWeb3 } from '../../utils/ethers.util';
import { parseEther } from 'ethers/lib/utils';
import moment from 'moment';
import Hidden from '@mui/material/Hidden';
import { useWeb3React } from '@web3-react/core';

const FarmCard = ({ farmInfo, chain, setSelectedFarm }) => {
  const [openStake, setOpenStake] = useState(false);
  const [amountIn, setAmountIn] = useState('0');
  const [amountOut, setAmountOut] = useState('0');

  const { library } = useWeb3React()

  const handleSelectedFarm = () => {
    setSelectedFarm(farmInfo);
  }

  const stake = async () => {
    await tokenWeb3(farmInfo.lptoken, library.getSigner()).approve(farmInfo.address, parseEther(amountIn));
    tokenWeb3(farmInfo.lptoken, library.getSigner()).once("Approval", async () => {
      const tx = await farmWeb3(farmInfo.address, library.getSigner()).deposit(parseEther(amountIn));
      await tx.wait();
      window.alert("Deposit.");
    });
  }

  const withdraw = async () => {
    const tx = await farmWeb3(farmInfo.address, library.getSigner()).withdraw(parseEther(amountIn));
    await tx.wait();
    window.alert("Withdraw");
  }

  return (
    <Card
      sx={{
        my: '10px',
        borderRadius: '20px',
        border: '1px solid #2494F3',
        fontFamily: 'Exo'
      }}
    >
      <Box
        onClick={() => setOpenStake(!openStake)}
        sx={{
          p: '1%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            mx: '1%'
          }}
        >
          <Hidden smDown>
            <Typography sx={{ mb: 0 }} variant="h5" gutterBottom component="h5">
              {`Farm ${farmInfo.name.toUpperCase()}`}
            </Typography>
          </Hidden>
          <Box>
            {`${farmInfo.symbol} / ${farmInfo.baseToken}`}
          </Box>
          <Box>
            {
              farmInfo.start > new Date() && (
                <Box sx={{ color: 'skyBlue' }}>
                  Farming is not started.
                </Box>
              )
            }
            {
              (farmInfo.start < new Date() && farmInfo.end > new Date()) && (
                <Box sx={{ color: 'skyBlue' }}>
                  Farming is active.
                </Box>
              )
            }
            {
              farmInfo.bonusEndBlock < new Date() && (
                <Box sx={{ color: 'skyBlue' }}>
                  Farming has finished.
                </Box>
              )
            }
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box sx={{ mx: '3%' }}>
          <img src={farmIcon} />
        </Box>
        <Hidden smDown>
          <Box
            sx={{
              width: '10%'
            }}
          >
            ~{moment(farmInfo.start).format('MMM DD YYYY')}
          </Box>
        </Hidden>
        <Box
          sx={{
            width: '10%'
          }}
        >
          ~{moment(farmInfo.end).format('MMM DD YYYY')}
        </Box>
        <Box sx={{ mx: '10%', display: 'flex', width: '80px' }}>
          <Box sx={{ mx: '2%' }}>
            <img src={airdropIcon} />
          </Box>
          <Box>
            {Math.trunc(farmInfo.supply)}
          </Box>
        </Box>
        <Box sx={{ mx: '1%', display: 'flex', width: '80px' }}>
          <Box sx={{ mx: '1%' }}>
            <img style={{ height: '50%' }} src={accountIcon} />
          </Box>
          <Box>
            {farmInfo.numFarmers}
          </Box>
        </Box>
      </Box>
      {/* stake */}
      {
        openStake && (
          <Box
            sx={{
              background: '#020826',
              px: '3%',
              py: '1%'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Box sx={{ mx: '2%' }}>
                <Button onClick={handleSelectedFarm} variant='contained'>add liquidity and stake</Button>
              </Box>
              {/* <Box>
                <TextField value={amountIn} onChange={e => setAmountIn(e.target.value)} label="amount" xs={6} fullWidth />
              </Box>
              <Box sx={{ mx: '20px' }}>
                <Button onClick={stake} variant='contained'>stake</Button>
              </Box> */}
              <Box>
                <TextField value={amountOut} onChange={e => setAmountOut(e.target.value)} label="amount" xs={6} fullWidth />
              </Box>
              <Box sx={{ mx: '2%' }}>
                <Button onClick={withdraw} variant='contained'>withdraw</Button>
              </Box>
            </Box>
          </Box>
        )
      }

    </Card>
  );
}

export default FarmCard;